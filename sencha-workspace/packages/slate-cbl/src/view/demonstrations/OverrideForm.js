Ext.define('Slate.cbl.view.demonstrations.OverrideForm', {
    extend: 'Slate.ui.form.Panel',
    xtype: 'slate-cbl-demonstrations-overrideform',
    requires: [
        'Ext.form.field.TextArea',

        'Slate.ui.PanelFooter'
    ],


    config: {
        student: null,
        skill: null,

        title: 'Override Standard',

        footer: [
            {
                xtype: 'button',
                text: 'Submit Override',
                action: 'submit',
            }
        ]
    },


    defaults: {
        labelWidth: 100
    },
    items: [
        {
            itemId: 'studentField',

            xtype: 'displayfield',
            // name: 'StudentName',
            fieldLabel: 'Student'
        },
        {
            itemId: 'skillCodeField',

            xtype: 'displayfield',
            // name: 'SkillCode',
            fieldLabel: 'Standard'
        },
        {
            itemId: 'skillStatementField',

            xtype: 'displayfield',
            // name: 'SkillStatement',
            fieldLabel: 'Statement'
        },
        {
            flex: 1,

            xtype: 'textarea',
            name: 'Comments',
            fieldLabel: 'Comments',
            allowBlank: true,
            selectOnFocus: false
        }
    ],


    // config handlers
    updateStudent: function(student) {
        this.getComponent('studentField').setValue(student.get('FullName'));
    },

    updateSkill: function(skill) {
        this.getComponent('skillCodeField').setValue(skill.get('Code'));
        this.getComponent('skillStatementField').setValue(skill.get('Statement'));
    }
});