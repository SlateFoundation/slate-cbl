/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext*/
Ext.define('Slate.cbl.view.student.skill.OverviewWindow', {
    extend: 'Slate.cbl.view.standard.AbstractOverviewWindow',
    xtype: 'slate-cbl-student-skill-overviewwindow',
    requires: [
        'Slate.cbl.view.student.skill.OverviewWindowController',

        'Slate.cbl.data.Skills',

        'Ext.form.field.ComboBox',
        'Ext.data.ChainedStore'
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
                    disabled: true,

                    store: {
                        type: 'chained',
                        source: 'cbl-skills'
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