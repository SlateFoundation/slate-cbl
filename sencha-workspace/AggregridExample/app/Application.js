/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('AggregridExample.Application', {
    extend: 'Ext.app.Application',

    name: 'AggregridExample',

    stores: [
        // TODO: add global / shared stores here
    ],

    views: [
        'Main'
    ],

    mainView: 'AggregridExample.view.Main',

    launch: function () {
        // TODO - Launch the application
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
