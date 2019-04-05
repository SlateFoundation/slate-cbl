Ext.define('Slate.cbl.admin.view.skills.Form', {
    extend: 'Ext.form.Panel',

    xtype: 'cbl-admin-skills-form',
    requires: [
        'Ext.form.field.ComboBox',
        'Ext.form.field.Display',
        'Ext.form.field.Number',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'Slate.cbl.admin.view.skills.EvidenceRequirementsField'
    ],

    disabled: true,
    title: 'Selected Skill',
    componentCls: 'cbl-admin-skills-editor',
    bodyPadding: 10,
    scrollable: 'vertical',

    trackResetOnLoad: true,

    defaults: {
        labelWidth: 70,
        labelAlign: 'right',
        anchor: '100%'
    },

    items: [{
        xtype: 'displayfield',
        name: 'Code',
        fieldLabel: 'Code'
    }, {
        xtype: 'textareafield',
        name: 'Descriptor',
        fieldLabel: 'Descriptor',
        allowBlank: false
    }, {
        xtype: 'textareafield',
        name: 'Statement',
        fieldLabel: 'Statement',
        allowBlank: false,
        grow: true
    }, {
        xtype: 'panel',
        itemId: 'evidence-requirements-container',
        title: 'Evidence Requirements',
        tbar: [{
            xtype: 'numberfield',
            fieldLabel: 'Level',
            minValue: 1,
            isFormField: false, // set to ignore dirtychange events
            listeners: {
                change: function() {
                    this.next('button').setDisabled(!this.getValue());
                }
            }
        },{
            xtype: 'tbfill'
        }, {
            text: 'Add Level',
            action: 'add',
            disabled: true,
            glyph: 0xf055, //fa-plus-cicle
            cls: 'glyph-success',
            handler: function() {
                var form = this.up('form'),
                    field = this.prev('numberfield'),
                    level = field.getValue();

                if (Ext.isNumeric(level)) {
                    form.fireEvent('addevidencerequirementlevel', form, field, level);
                }
            }
        }]
    }],

    buttons: [{
        itemId: 'revertBtn',
        disabled: true,

        text: 'Revert Changes',
        cls: 'glyph-danger',
        glyph: 0xf057 // fa-times-circle
    }, {
        xtype: 'tbfill'
    }, {
        itemId: 'saveBtn',
        disabled: true,

        text: 'Save Changes',
        cls: 'glyph-success',
        glyph: 0xf058 // fa-check-circle
    }],

    loadRecord: function(record) {
        var me = this,
            evidenceRequirementsCt = me.down('#evidence-requirements-container'),
            requiredDemos = 0,
            items = [], key;

        evidenceRequirementsCt.removeAll();

        if (record && (requiredDemos = record.get('DemonstrationsRequired'))) {
            for (key in requiredDemos) {
                if (requiredDemos.hasOwnProperty(key)) {
                    items.push(Ext.factory({
                        level: key,
                        value: requiredDemos[key]
                    }, 'Slate.cbl.admin.view.skills.EvidenceRequirementsField'));
                }
            }
        }

        evidenceRequirementsCt.add(items);

        me.callParent(arguments);
    },

    getEvidenceRequirements: function(level) {
        var me = this,
            evidenceRequirements = {},
            evidenceRequirementFields = me.query('cbl-admin-skills-evidencerequirementsfield'),
            i = 0;

        for (; i < evidenceRequirementFields.length; i++) {
            evidenceRequirements[evidenceRequirementFields[i].getLevel()] = evidenceRequirementFields[i].getValue();
        }

        if (level) { // return for level
            return evidenceRequirements[level];
        }

        return evidenceRequirements;
    }
})