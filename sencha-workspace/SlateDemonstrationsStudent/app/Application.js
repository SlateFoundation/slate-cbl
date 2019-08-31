/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('SlateDemonstrationsStudent.Application', {
    extend: 'Ext.app.Application',
    requires: [
        'Ext.window.MessageBox',

        /* global Slate */
        'Slate.API'
    ],


    name: 'SlateDemonstrationsStudent',
    defaultToken: 'me',

    controllers: [
        'Dashboard',
        'RecentProgress',
        'Skills'
    ],

    launch: function() {
        var me = this;

        // load bootstrap data
        Slate.API.request({
            method: 'GET',
            url: '/cbl/dashboards/demonstrations/student/bootstrap',
            params: {
                include: 'Wards'
            },
            success: function(response) {
                me.fireEvent('bootstrapdataload', me, response.data);
            }
        });
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
