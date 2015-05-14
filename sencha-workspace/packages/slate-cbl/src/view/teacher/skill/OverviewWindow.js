/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.view.teacher.skill.OverviewWindow', {
    extend: 'Slate.cbl.view.standard.AbstractOverviewWindow',
    xtype: 'slate-cbl-teacher-skill-overviewwindow',
    requires: [
        'Slate.cbl.view.teacher.skill.OverviewWindowController',

        'Ext.form.field.ComboBox',
        'Ext.data.ChainedStore'
    ],

    controller: 'slate-cbl-teacher-skill-overviewwindow',

    config: {
        competency: null,
        showEditLinks: true,
        studentsStore: null,
        competenciesStore: null,
        skillsStore: null
    },

    dockedItems: [
        {
            dock: 'top',

            xtype: 'toolbar',
            items: [
                'Competency:',
                {
                    reference: 'competencyCombo',
                    flex: 1,

                    xtype: 'combobox',

                    store: {
                        type: 'chained'
                    },
                    queryMode: 'local',
                    displayField: 'Descriptor',
                    valueField: 'ID',

                    forceSelection: true
                },
                'Standard:',
                {
                    reference: 'skillCombo',
                    flex: 1,

                    xtype: 'combobox',

                    store: {
                        type: 'chained'
                    },
                    queryMode: 'local',
                    displayField: 'Descriptor',
                    valueField: 'ID',

                    forceSelection: true
                }
            ]
        },
        {
            dock: 'top',

            xtype: 'toolbar',
            items: [
                {
                    flex: 1,

                    reference: 'studentCombo',
                    xtype: 'combobox',
                    emptyText: 'Start typing student\'s name',

                    store: {
                        type: 'chained'
                    },
                    queryMode: 'local',
                    displayField: 'FullName',
                    valueField: 'ID',

                    forceSelection: true,
                    autoSelect: true
                }
            ]
        },
        {
            dock: 'bottom',
            xtype: 'toolbar',
            items: [
                {
                    xtype: 'button',
                    action: 'override',
                    text: 'Override'
                },
                '->',
                {
                    xtype: 'button',
                    action: 'demonstration-create',
                    text: 'Log a Demonstration'
                }
            ]
        }
    ],
    
    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        me.lookupReference('studentCombo').getStore().setSource(me.getStudentsStore());
        me.lookupReference('competencyCombo').getStore().setSource(me.getCompetenciesStore());
        me.lookupReference('skillCombo').getStore().setSource(me.getSkillsStore());
    }
});
