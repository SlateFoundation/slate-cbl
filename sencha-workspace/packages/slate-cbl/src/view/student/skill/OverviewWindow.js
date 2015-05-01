/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext*/
Ext.define('Slate.cbl.view.student.skill.OverviewWindow', {
    extend: 'Slate.cbl.view.standard.AbstractOverviewWindow',
    xtype: 'slate-cbl-student-skill-overviewwindow',
    requires: [
        'Slate.cbl.view.student.skill.OverviewWindowController',
        'Slate.cbl.model.Skill',

        'Ext.form.field.ComboBox'
    ],

    controller: 'slate-cbl-student-skill-overviewwindow',

    config: {
        competency: null
    },

    modal: true,
    fixed: true,
    shadow: 'frame',

    dockedItems: [
        {
            dock: 'top',

            xtype: 'toolbar',
            items: [
                'Standard:',
                {
                    reference: 'skillCombo',
                    flex: 1,

                    xtype: 'combobox',

                    store: {
                        model: 'Slate.cbl.model.Skill'
                    },
                    queryMode: 'local',
                    displayField: 'Descriptor',
                    valueField: 'ID',

                    forceSelection: true
                }
            ]
        }
    ]
});