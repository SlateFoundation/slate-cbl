# Importing Competency Maps

## Clone and Customize Sample Spreadsheet

## Build CSV Index

## Import into Slate

1. Visit `/connectors/cbl-maps` in a web browser on your Slate instance
2. Click **Synchronize** to open the synchronization tool
3. Paste the CSV URL for your index sheet into the **Map Index CSV** field\*
4. Run the synchronization with **Pretend** enabled first to preview the changes to be made. If everything looks good, use your browser's back button to return to the setup form. Uncheck **Pretend** and run again with the same settings.

\* The default Maps Index CSV can be changed to save yours by creating a file called `php-config/Slate/CBL/MapsConnector.config.php`:

```php
<?php

Slate\CBL\MapsConnector::$defaultCsvUrl = 'https://docs.google.com/spreadsheets/.../export?format=csv&id=...&gid=...';
```