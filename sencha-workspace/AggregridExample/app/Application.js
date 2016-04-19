/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('AggregridExample.Application', {
    extend: 'Ext.app.Application',
    requires: [
        'Ext.plugin.Viewport'
    ],


    name: 'AggregridExample',

    views: [
        'MyAggregrid'
    ],
    
    stores: [
        'AggregridExample.store.Student',
        'AggregridExample.store.TimePeriod',
        'AggregridExample.store.Absence'
    ],

    mainView: 'AggregridExample.view.MyAggregrid',

    launch: function () {
        window.mainView = this.getMainView();
    },

    control: {
        'app-myaggregrid': {
            beforerefresh: function() {
                console.info('app.myaggregrid->beforerefresh');
            },
            refresh: function() {
                console.info('app.myaggregrid->refresh');
            }
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
