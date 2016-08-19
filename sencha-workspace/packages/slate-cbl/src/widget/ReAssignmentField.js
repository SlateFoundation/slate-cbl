Ext.define('Slate.cbl.widget.ReAssignmentField', {
    extend: 'Ext.form.FieldContainer',

    xtype: 'slate-tasks-reassignfield',

    fieldLabel: 'Re-Assign Task',
    layout: 'hbox',

    items: [{
        xtype: 'datefield',
        name: 'RevisionDate',
        flex: 7,
        listeners: {
            change: function() {
                var me = this;

                // enable reassign button if date is set & valid
                me.next('button').setDisabled(!(me.getValue() && me.isValid()));
            }
        }
    }, {
        xtype: 'button',
        text: 'ReAssign',
        disabled: true,
        flex: 3,
        handler: function() {
            var me = this,
                modal = me.up('slate-ratetaskwindow'),
                dateField = me.prev('datefield');

            // fire reassign event
            modal.fireEvent('reassign', modal, dateField, dateField.getValue());
        }
    }]
});