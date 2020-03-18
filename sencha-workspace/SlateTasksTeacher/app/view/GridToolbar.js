Ext.define('SlateTasksTeacher.view.GridToolbar', {
    extend: 'Ext.container.Container',
    xtype: 'slate-gridtoolbar',

    requires: [
        'Ext.form.field.Checkbox'
    ],

    layout: 'hbox',
    margin: '10 25',

    defaults: {
        flex: 1
    },

    items: [{
        xtype: 'checkboxfield',
        fieldLabel: 'Show Archived Tasks',
        name: 'include_archived',
        labelWidth: 200
    }]

});