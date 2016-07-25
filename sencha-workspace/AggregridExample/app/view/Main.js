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
        ],
        bbar: [
            {
                text: 'Add 100 absences',
                action: 'add-absences'
            },
            {
                text: 'Remove 50 absences',
                action: 'remove-absences'
            },
            {
                text: 'Add row',
                action: 'add-row'
            }
        ]
    }
});