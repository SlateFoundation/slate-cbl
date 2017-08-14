<?php

$GLOBALS['Session']->requireAccountLevel('Developer');

use Slate\CBL\ContentArea;
use Slate\CBL\Competency;
use Slate\CBL\Skill;

$mapsCsvUrl = 'https://docs.google.com/a/slate.is/spreadsheets/d/1LnjTF5i2CeQrR9EQLB0llomtkpJ_xx38oyjat8wr2_g/export?format=csv&id=1LnjTF5i2CeQrR9EQLB0llomtkpJ_xx38oyjat8wr2_g&gid=1995361518';
$mapsCsv = SpreadsheetReader::createFromStream(fopen($mapsCsvUrl, 'r'));

while ($mapsRow = $mapsCsv->getNextRow()) {
    Debug::dumpVar($mapsRow, false, '$mapRow');
    $mapCsv = SpreadsheetReader::createFromStream(fopen($mapsRow['CSV'], 'r'));

    if (!$ContentArea = ContentArea::getByField('Code', $mapsRow['Code'])) {
        $ContentArea = ContentArea::create([
            'Code' => $mapsRow['Code'],
            'Title' => $mapsRow['Title']
        ], true);
        Debug::dumpVar($ContentArea, false, 'creating content area');

        while ($row = $mapCsv->getNextRow()) {
            if ($row['Type'] == 'Competency Statement') {
                $lastCompetency = Competency::create([
                    'ContentArea' => $ContentArea
                    ,'Code' => $row['Code']
                    ,'Descriptor' => $row['Descriptor']
                    ,'Statement' => $row['Statement']
                ], true);
                Debug::dumpVar($lastCompetency, false, 'creating competency');
            } elseif ($row['Type'] == 'Standard') {
                // handle numeric er values
                if (ctype_digit($row['ER'])) {
                    $demonstrationRequirements = [
                        'default' => $row['ER']
                    ];
                } else { // handle comma-delimited level:values pairs: i.e 9:2,10:3,default:4
                    $demonstrationRequirements = [];
                    $splitERs = explode(',', $row['ER']);
                    foreach ($splitERs as $er) {
                        list($lvl, $total) = explode(':', $er);

                        if (($lvl != 'default' && !ctype_digit($lvl)) || !ctype_digit($total)) {
                            throw new Exception('Unable to parse evidence requirements for Skill: '.$row['Code']);
                        }

                        $demonstrationRequirements[$lvl] = $total;
                    }

                    if (!isset($demonstrationRequirements['default'])) {
                        $demonstrationRequirements['default'] = 0;
                    }
                }

                Debug::dumpVar(Skill::create([
                    'Competency' => $lastCompetency
                    ,'Code' => $row['Code']
                    ,'Descriptor' => $row['Descriptor']
                    ,'Statement' => $row['Statement']
                    ,'DemonstrationsRequired' => $demonstrationRequirements
                ], true), false, 'creating skill');
            }
        }
    }
}
