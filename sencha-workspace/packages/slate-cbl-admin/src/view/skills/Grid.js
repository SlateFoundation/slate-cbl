Ext.define('Slate.cbl.admin.view.skills.Grid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.toolbar.Paging'
    ],

    xtype: 'cbl-admin-skills-grid',

    store: 'Skills',
    height: "100%",

    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'Skills',
        dock: 'bottom',
        displayInfo: true
    }],

    columns: {
        defaults: {
            flex: 1
        },
        items: [{
            dataIndex: 'Code',
            text: 'Code'
        },{
            dataIndex: 'Descriptor',
            text: 'Descriptor',
            flex: 5
        },{
            dataIndex: 'Statement',
            text: 'Statement',
            flex: 5
        }]
    }
});