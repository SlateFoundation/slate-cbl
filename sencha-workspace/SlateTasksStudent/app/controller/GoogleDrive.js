/**
 * This controller provides optional Google Drive integration for attachments
 */
Ext.define('SlateTasksStudent.controller.GoogleDrive', {
    extend: 'Ext.app.Controller',
    requires: [
        /* global Slate */
        'Slate.cbl.util.Google'
    ],


    // entry points
    listen: {
        controller: {
            '#': {
                bootstrapdataload: 'onBootstrapDataLoad'
            }
        }
    },


    // event handlers
    onBootstrapDataLoad: function(app, bootstrapData) {
        var googleApiConfig = bootstrapData.googleApiConfig;

        // configure Google API
        if (googleApiConfig) {
            Slate.cbl.util.Google.setConfig(googleApiConfig);
        }
    }
});