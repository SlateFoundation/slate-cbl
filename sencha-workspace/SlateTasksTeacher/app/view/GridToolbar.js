Ext.define('SlateTasksTeacher.view.GridToolbar', {
    extend: 'Ext.container.Container',
    xtype: 'slate-gridtoolbar',

    requires: [
        'Ext.form.field.Checkbox'
    ],

    layout: 'hbox',
    margin: '10 25',

    defaults: {
        padding: '0 40',
    },

    items: [{
        xtype: 'checkboxfield',
        fieldLabel: 'Show Archived Tasks',
        name: 'include_archived',
        labelWidth: 168
    }, {
        xtype: 'checkboxfield',
        fieldLabel: 'Show Inactive Students',
        name: 'include_deactivated',
        labelWidth: 192
    }]

});