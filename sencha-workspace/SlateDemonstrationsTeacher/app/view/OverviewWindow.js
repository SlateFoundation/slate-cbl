/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateDemonstrationsTeacher.view.OverviewWindow', {
    extend: 'Slate.cbl.view.standard.AbstractOverviewWindow',
    xtype: 'slate-demonstrations-teacher-skill-overviewwindow',
    requires: [
        'SlateDemonstrationsTeacher.view.OverviewWindowController',

        'Slate.cbl.data.Skills',

        'Ext.form.field.ComboBox',
        'Ext.data.ChainedStore'
    ],

    controller: 'slate-demonstrations-teacher-skill-overviewwindow',

    config: {
        competency: null,
        showEditLinks: true,
        studentsStore: null,
        competenciesStore: null
    },

    title: 'Skill Overview',

    dockedItems: [
        {
            dock: 'top',

            xtype: 'form',
            bodyPadding: '0 7',
            defaults: {
                anchor: '100%',
                xtype: 'combobox',
                queryMode: 'local',
                forceSelection: true,
                displayField: 'Descriptor',
                valueField: 'ID'
            },
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaults: {
                        flex: 1,
                        margin: '10 10 0',
                        xtype: 'combobox',
                        labelAlign: 'top',
                        queryMode: 'local',
                        forceSelection: true,
                        displayField: 'Descriptor',
                        valueField: 'ID'
                    },
                    items: [
                        {
                            reference: 'competencyCombo',
                            fieldLabel: 'Competency',

                            store: {
                                type: 'chained'
                            }
                        },
                        {
                            reference: 'skillCombo',
                            fieldLabel: 'Skill',

                            store: {
                                type: 'chained',
                                source: 'cbl-skills'
                            },

                            disabled: true
                        }
                    ]
                },
                {
                    margin: 10,
                    reference: 'studentCombo',
                    emptyText: 'Start typing student’s name',

                    store: {
                        type: 'chained'
                    },
                    displayField: 'FullName',

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
                    text: 'Submit Evidence'
                }
            ]
        }
    ]
});