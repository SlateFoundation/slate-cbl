<?php

namespace Slate\CBL;

class ContentAreasRequestHandler extends RecordsRequestHandler
{
    public static $recordClass = ContentArea::class;
    public static $browseOrder = 'Code';
    public static $accountLevelBrowse = 'User';
}
