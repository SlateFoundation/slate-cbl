Ext.define('AggregridExample.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',
    requires: [
        'AggregridExample.view.BasicAggregrid',
        'AggregridExample.view.RollupAggregrid'
    ],


    config: {
        items: [
            {
                title: 'Rollup Aggregrid',

                xtype: 'app-rollupaggregrid'
            },
            {
                title: 'Basic Aggregrid',

                xtype: 'app-basicaggregrid'
            }
        ]
    }
});