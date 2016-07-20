Ext.define('AggregridExample.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',
    requires: [
        'AggregridExample.view.BasicAggregrid'
    ],


    config: {
        items: [{
            title: 'Basic Aggregrid',

            xtype: 'app-basicaggregrid'
        }]
    }
});