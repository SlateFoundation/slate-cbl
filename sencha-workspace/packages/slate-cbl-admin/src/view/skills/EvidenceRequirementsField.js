Ext.define('Slate.cbl.admin.view.skills.EvidenceRequirementsField', {
    extend: 'Ext.form.FieldContainer',
    xtype: 'cbl-admin-skills-evidencerequirementsfield',

    requires: [
        'Ext.form.field.Number',
        'Ext.layout.container.HBox'
    ],

    layout: 'hbox',
    fieldLabel: '',
    config: {
        level: 'default',
        value: 0
    },

    initComponent: function() {
        var me = this,
            level = me.getLevel();

        me.items = [{
            xtype: 'numberfield',
            fieldLabel: (level == 'default' ? 'Default Level' : 'Level ' + level),
            value: me.getValue(),
            minValue: 0,
            listeners: {
                change: function(field, val) {
                    this.up('cbl-admin-skills-evidencerequirementsfield').setValue(val);
                }
            }
        }];

        if (level !== 'default') {
            me.items.push({
                xtype: 'button',
                cls: 'glyph-danger',
                glyph: 0xf056, // fa-minus-circle
                text: 'Remove',
                handler: function() {
                    this.up('fieldcontainer').destroy();
                }
            });
        }

        me.callParent(arguments);
    }
})