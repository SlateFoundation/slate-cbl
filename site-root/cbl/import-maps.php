<?php

$GLOBALS['Session']->requireAccountLevel('Developer');

if (Slate\CBL\ContentArea::getCount() > 0) {
    die ("Content area database is already populated, aborting");
}

$mapsCsvUrl = 'https://docs.google.com/a/slate.is/spreadsheets/d/1LnjTF5i2CeQrR9EQLB0llomtkpJ_xx38oyjat8wr2_g/export?format=csv&id=1LnjTF5i2CeQrR9EQLB0llomtkpJ_xx38oyjat8wr2_g&gid=1995361518';
$mapsCsv = SpreadsheetReader::createFromStream(fopen($mapsCsvUrl, 'r'));

while ($mapsRow = $mapsCsv->getNextRow()) {
    Debug::dumpVar($mapsRow, false, '$mapRow');
    $mapCsv = SpreadsheetReader::createFromStream(fopen($mapsRow['CSV'], 'r'));
    
    $ContentArea = Slate\CBL\ContentArea::create([
        'Code' => $mapsRow['Code'],
        'Title' => $mapsRow['Title']
    ], true);
    \Debug::dumpVar($ContentArea, false, 'creating content area');
    
    while ($row = $mapCsv->getNextRow()) {
        if ($row['Type'] == 'Competency Statement') {
            $lastCompetency = Slate\CBL\Competency::create([
                'ContentArea' => $ContentArea
                ,'Code' => $row['Code']
                ,'Descriptor' => $row['Descriptor']
                ,'Statement' => $row['Statement']
            ], true);
            \Debug::dumpVar($lastCompetency, false, 'creating competency');
        } elseif ($row['Type'] == 'Standard') {
            \Debug::dumpVar(Slate\CBL\Skill::create([
                'Competency' => $lastCompetency
                ,'Code' => $row['Code']
                ,'Descriptor' => $row['Descriptor']
                ,'Statement' => $row['Statement']
                ,'DemonstrationsRequired' => $row['ER']
            ], true), false, 'creating skill');
        }
    }
}
