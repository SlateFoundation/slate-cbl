Ext.define('Slate.cbl.field.ClearableSelector', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'slate-cbl-clearableselector',


    config: {
        labelAlign: 'right',
        labelSeparator: '',
        labelPad: 10,
        triggers: {
            clear: {
                cls: 'x-form-clear-trigger',
                weight: -2,
                handler: 'onClearClick',
                scope: 'this'
            }
        }
    },


    // component lifecycle
    initComponent: function() {
        var me = this,
            allowBlank, clearTrigger;

        me.callParent(arguments);

        allowBlank = me.allowBlank;
        clearTrigger = me.getTrigger('clear');

        clearTrigger.setHidden(!allowBlank || !me.getValue());

        if (allowBlank) {
            me.on('change', function(combo, value) {
                clearTrigger.setHidden(!value);
            });
        }
    },


    // event handlers
    onClearClick: function(me) {
        me.clearValue();
        me.fireEvent('clear', me);
    }
});