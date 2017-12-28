Ext.define('Slate.cbl.widget.AssignmentsField', {
    extend: 'Ext.form.FieldContainer',
    requires: [
        'Ext.form.field.Checkbox',
        'Ext.form.field.ComboBox',
        'Slate.model.person.Person'
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
        xtype: 'combo', // todo: update to tagfield?
        autoSelect: false,
        multiSelect: true,
        queryMode: 'local',
        displayField: 'FullName',
        valueField: 'ID',
        store: {
            model: 'Slate.model.person.Person'
        }
    }, {
        xtype: 'checkboxfield',
        itemId: 'assign-all',
        boxLabel: 'All',
        margin: '0 0 0 8',
        listeners: {
            change: function() {
                var combo = this.prev('combo');

                if (this.getValue()) {
                    combo.select(combo.getStore().getRange());
                    combo.setDisabled(true);
                } else {
                    combo.setDisabled(false);
                }
            }
        }
    }],

    getAssignees: function(returnRecords) {
        var me = this,
            combo = me.down('combo'),
            comboStore = combo.getStore(),
            assignees = [];

        if (returnRecords === true) {
            assignees = Ext.Array.map(combo.getValue(), function(studentId) {
                return comboStore.getById(studentId);
            });
        } else {
            assignees = combo.getValue();
        }

        return assignees;
    },

    setAssignees: function(assignees) {
        var me = this,
            combo = me.down('combo');

        combo.setValue(assignees);
    }
});