/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('SlateStudentCompetenciesAdmin.Application', {
    extend: 'Ext.app.Application',
    requires: [
        'Ext.window.MessageBox',

        /* global Slate */
        'Slate.API'
    ],

    name: 'SlateStudentCompetenciesAdmin',

    controllers: [
        'Dashboard'
    ],

    launch: function() {
        var me = this;

        // load bootstrap data
        Slate.API.request({
            method: 'GET',
            url: '/cbl/dashboards/student-competencies/admin/bootstrap',
            success: function(response) {
                me.fireEvent('bootstrapdataload', me, response.data);
            }
        });
    },

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
