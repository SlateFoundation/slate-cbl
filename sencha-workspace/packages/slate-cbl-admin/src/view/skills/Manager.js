Ext.define('Slate.cbl.admin.view.skills.Manager', {
    extend: 'Ext.Container',

    xtype: 'cbl-admin-skills-manager',

    requires: [
        'Slate.cbl.admin.view.skills.Grid',
        'Slate.cbl.admin.view.skills.Form'
    ],

    layout: 'border',

    items: [{
        region: 'west',
        split: true,
        xtype: 'cbl-admin-skills-grid',
        autoScroll: true,
        width: 500
    }, {
        region: 'center',
        xtype: 'cbl-admin-skills-form',
        flex: 1
    }]
});