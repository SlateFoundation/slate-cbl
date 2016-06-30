Ext.define('Slate.cbl.widget.AssignmentsField', {
    extend: 'Ext.form.FieldContainer',
    requires: [
        'Ext.form.field.Checkbox',
        'Ext.form.field.ComboBox'
    ],

    xtype: 'slate-tasks-assignmentsfield',

    fieldLabel: 'Assigned To',
    layout: 'hbox',
    defaults: {
        margin: 0
    },

    items: [{
        itemId: 'assigned-to',
        flex: 1,
        xtype: 'combo',
        multiSelect: true,
        store: [
            'Assign All',
            'Student A',
            'Student B',
            'Student C',
            'Student D',
            'Student E',
            'Student F',
            'Student G',
            'Student H',
            'Student I'
        ]
    },{
        xtype: 'checkboxfield',
        itemId: 'assign-all',
        boxLabel: 'All',
        margin: '0 0 0 8'
    }]
});