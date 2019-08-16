<?php

namespace Slate\CBL;

use Exception;
use SpreadsheetReader;
use Emergence\Connectors\IJob;


class MapsConnector extends \Emergence\Connectors\AbstractSpreadsheetConnector implements \Emergence\Connectors\ISynchronize
{
    public static $title = 'CBL Maps';
    public static $connectorId = 'cbl-maps';

    public static $defaultCsvUrl = 'https://docs.google.com/a/slate.is/spreadsheets/d/1LnjTF5i2CeQrR9EQLB0llomtkpJ_xx38oyjat8wr2_g/export?format=csv&id=1LnjTF5i2CeQrR9EQLB0llomtkpJ_xx38oyjat8wr2_g&gid=1995361518';

    public static $indexColumns = [
        'Code'      => 'Code',
        'Title'     => 'Title',
        'CSV'       => 'Url'
    ];

    public static $indexRequiredColumns = [
        'Code',
        'Title',
        'Url'
    ];

    public static $contentAreaColumns = [
        'Code'          => 'Code',
        'Type'          => 'Type',
        'Descriptor'    => 'Descriptor',
        'Statement'     => 'Statement',
        'ER'            => 'DemonstrationsRequired'
    ];

    public static $contentAreaRequiredColumns = [
        'Code',
        'Type',
        'Descriptor',
    ];

    // workflow implementations
    protected static function _getJobConfig(array $requestData)
    {
        $config = parent::_getJobConfig($requestData);

        $config['indexCsv'] = !empty($requestData['indexCsv']) ? $requestData['indexCsv'] : null;
        $config['updateExisting'] = !empty($requestData['updateExisting']);

        return $config;
    }

    public static function synchronize(IJob $Job, $pretend = true)
    {
        if ($Job->Status != 'Pending' && $Job->Status != 'Completed') {
            return static::throwError('Cannot execute job, status is not Pending or Complete');
        }


        // update job status
        $Job->Status = 'Pending';

        if (!$pretend) {
            $Job->save();
        }


        // init results struct
        $results = [];


        // execute tasks based on available spreadsheets
        if (!empty($Job->Config['indexCsv'])) {
            $results = static::pullMaps(
                $Job,
                SpreadsheetReader::createFromStream(fopen($Job->Config['indexCsv'], 'r')),
                $pretend
            );
        }


        // save job results
        $Job->Status = 'Completed';
        $Job->Results = $results;

        if (!$pretend) {
            $Job->save();
        }

        return true;
    }

    public static function pullMaps(IJob $Job, SpreadsheetReader $spreadsheet, $pretend = true)
    {
        $indexColumns = static::getStackedConfig('indexColumns');
        $contentAreaColumns = static::getStackedConfig('contentAreaColumns');

        // check input
        try {
            static::_requireColumns('index', $spreadsheet, static::getStackedConfig('indexRequiredColumns'), $indexColumns);
        } catch (Exception $e) {
            $Job->logException($e);
            return false;
        }

        // initialize results
        $results = [
            'analyzed' => 0
        ];


        // disable relational validation
        // TODO: remove if AR improvements eliminate need
        Competency::$validators['ContentArea'] = null;
        Skill::$validators['Competency'] = null;


        // loop through rows
        while ($row = $spreadsheet->getNextRow()) {

            // process input row through column mapping
            $row = static::_readRow($row, $indexColumns);


            // log progress
            $results['analyzed']++;
            static::_logRow($Job, 'index', $results['analyzed'], $row);


            // get existing or start creating a new content area
            if (!$ContentArea = ContentArea::getByField('Code', $row['Code'])) {
                $ContentArea = ContentArea::create(['Code' => $row['Code']]);

                $Job->notice('Building content area: {code}', [
                    'code' => $row['Code']
                ]);
            } elseif (!$Job->Config['updateExisting']) {
                $Job->notice('Skipping existing content area: {code}', [
                    'code' => $row['Code']
                ]);
                $results['skipped-existing']++;
                continue;
            }

            $ContentArea->Title = $row['Title'];


            // load and validate area sheet
            $contentAreaSpreadsheet = SpreadsheetReader::createFromStream(fopen($row['Url'], 'r'));
            $contentAreaRowsAnalyzed = 0;

            try {
                static::_requireColumns('content-area', $contentAreaSpreadsheet, static::getStackedConfig('contentAreaRequiredColumns'), $contentAreaColumns);
            } catch (Exception $e) {
                $Job->logException($e);
                return false;
            }


            // load competencies and skills from area sheet
            $competencies = [];
            $competencyIndex = -1;
            $skills = null;


            while ($contentAreaRow = $contentAreaSpreadsheet->getNextRow()) {

                // process input row through column mapping
                $contentAreaRow = static::_readRow($contentAreaRow, $contentAreaColumns);


                // log progress
                $results['analyzed:rows']++;
                $contentAreaRowsAnalyzed++;

                static::_logRow($Job, 'content-area', $contentAreaRowsAnalyzed, $contentAreaRow);

                if ($contentAreaRow['Type'] == 'Competency Statement') {
                    // flush skills to last competency
                    if ($skills) {
                        $competencies[$competencyIndex]->Skills = $skills;
                    }

                    // start next competency
                    $competencyIndex++;
                    $competencies[$competencyIndex] = Competency::create([
                        'Code' => $contentAreaRow['Code'],
                        'Descriptor' => $contentAreaRow['Descriptor'],
                        'Statement' => $contentAreaRow['Statement'] ?: null
                    ]);

                    $skills = [];

                    $Job->notice('Attaching competency {code}: {descriptor}', [
                        'code' => $contentAreaRow['Code'],
                        'descriptor' => $contentAreaRow['Descriptor']
                    ]);
                    $results['attached:competencies']++;
                } elseif ($contentAreaRow['Type'] == 'Standard') {
                    if ($competencyIndex < 0) {
                        $Job->error('Standard not preceded by competency: {type}', [
                            'type' => $contentAreaRow['Type']
                        ]);
                        $results['invalid:rows']['missing-context']++;
                        continue;
                    }

                    // parse demonstrations required
                    if (ctype_digit($contentAreaRow['DemonstrationsRequired'])) {
                        // handle numeric er values
                        $demonstrationsRequired = [
                            'default' => $contentAreaRow['DemonstrationsRequired']
                        ];
                    } else {
                        // handle comma-delimited level:values pairs: i.e 9:2,10:3,default:4
                        $demonstrationsRequired = [];

                        foreach (preg_split('/\s*,\s*/', $contentAreaRow['DemonstrationsRequired']) as $levelRequired) {
                            list($level, $required) = preg_split('/\s*:\s*/', $levelRequired);

                            if (($level != 'default' && !ctype_digit($level)) || !ctype_digit($required)) {
                                $Job->error('Unable to parse evidence requirements for skill {code}: {input}', [
                                    'code' => $contentAreaRow['Code'],
                                    'input' => $contentAreaRow['DemonstrationsRequired']
                                ]);
                                $results['invalid:rows']['evidence requirements']++;
                                continue;
                            }

                            $demonstrationsRequired[$level] = $required;
                        }

                        if (!isset($demonstrationsRequired['default'])) {
                            $demonstrationsRequired['default'] = 0;
                        }
                    }

                    $skills[] = Skill::create([
                        'Code' => $contentAreaRow['Code'],
                        'Descriptor' => $contentAreaRow['Descriptor'],
                        'Statement' => $contentAreaRow['Statement'] ?: null,
                        'DemonstrationsRequired' => $demonstrationsRequired
                    ]);

                    $Job->notice('Attaching skill {code}: {descriptor}', [
                        'code' => $contentAreaRow['Code'],
                        'descriptor' => $contentAreaRow['Descriptor']
                    ]);
                    $results['attached:skills']++;
                } else {
                    $Job->error('Invalid content area row type: {type}', [
                        'type' => $contentAreaRow['Type']
                    ]);
                    $results['invalid:rows']['content-type']++;
                    continue;
                }
            }


            // flush final skills to final competency
            if ($skills) {
                $competencies[$competencyIndex]->Skills = $skills;
            }


            // apply competencies to content area
            $ContentArea->Competencies = $competencies;


            // validate record
            if (!static::_validateRecord($Job, $ContentArea, $results)) {
                continue;
            }


            // save record
            static::_saveRecord($Job, $ContentArea, $pretend, $results);
        }


        return $results;
    }

    protected static function initIndexRequiredColumns(array $config)
    {
        return static::initRequiredColumns($config);
    }

    protected static function initContentAreaRequiredColumns(array $config)
    {
        return static::initRequiredColumns($config);
    }
}
