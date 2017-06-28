/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateDemonstrationsTeacher.view.EditWindow', {
    extend: 'Ext.window.Window',
    xtype: 'slate-demonstrations-teacher-demonstration-editwindow',
    requires: [
        'SlateDemonstrationsTeacher.view.EditWindowController',
        'SlateDemonstrationsTeacher.view.CompetencyCard',

        'Slate.cbl.data.ContentAreas',
        'Slate.cbl.data.Competencies',
        'Slate.cbl.model.Demonstration',

        'Ext.layout.container.Fit',
        'Ext.form.Panel',
        'Ext.tab.Panel',
        'Ext.grid.Panel',
        'Ext.grid.feature.Grouping',
        'Ext.grid.column.Action',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Date',
        'Ext.data.ChainedStore'
    ],

    controller: 'slate-demonstrations-teacher-demonstration-editwindow',

    config: {
        demonstration: {
            Class: 'Slate\\CBL\\Demonstrations\\ExperienceDemonstration'
        },
        studentsStore: null,
        defaultStudent: null,
        defaultCompetency: null
    },

    title: 'Submit Evidence',
    width: 600,
    constrainHeader: true,

//    tools: [
//        {
//            type: 'gear',
//            tooltip: 'Override'
//        }
//    ],

    layout: 'fit',
    items: {
        reference: 'form',

        xtype: 'form',
        trackResetOnLoad: true,
        autoScroll: true,
        bodyPadding: 16,
        defaults: {
            anchor: '100%',
            allowBlank: false,
            msgTarget: 'side',
            selectOnFocus: true,
            labelAlign: 'right',
            labelWidth: 150
        },
        items: [
            {
                anchor: '75%',
                reference: 'studentCombo',

                xtype: 'combobox',
                name: 'StudentID',
                fieldLabel: 'Student',

                store: {
                    type: 'chained'
//                    source: 'cbl-students-loaded'
                },
                queryMode: 'local',
                displayField: 'FullName',
                valueField: 'ID',

                forceSelection: true,
                autoSelect: true
            },
            {
                anchor: '50%',
                xtype: 'datefield',
                name: 'Demonstrated',
                fieldLabel: 'Demonstrated',
                displayField: 'Demonstrated',
                valueField: 'Demonstrated',
                value: new Date().toLocaleDateString()
            },

            {
                xtype: 'combobox',
                name: 'ExperienceType',
                fieldLabel: 'Type of Experience',
                allowBlank: true,

                store: (window.SiteEnvironment && window.SiteEnvironment.cblExperienceTypeOptions) || []
            },
            {
                xtype: 'combobox',
                name: 'Context',
                fieldLabel: 'Name of Experience',
                allowBlank: true,

                store: (window.SiteEnvironment && window.SiteEnvironment.cblContextOptions) || []
            },
            {
                xtype: 'combobox',
                name: 'PerformanceType',
                fieldLabel: 'Performance Task',
                allowBlank: true,

                store: (window.SiteEnvironment && window.SiteEnvironment.cblPerformanceTypeOptions) || []
            },
            {
                xtype: 'textfield',
                name: 'ArtifactURL',
                fieldLabel: 'Artifact (URL)',
                allowBlank: true,

                allowBlank: true,
                regex: /^https?:\/\/.+/i,
                regexText: 'Artifact must be a complete URL (starting with http:// or https://)'
            },
            {
                reference: 'competenciesTabPanel',
                anchor: '100%',

//              competencyTipTitleTpl: '{Descriptor}',
//              competencyTipBodyTpl: '{Statement}',

                xtype: 'tabpanel',
                tabBar: {
                    hidden: true
                },
                margin: '10 -16',
//                bodyPadding: '16 75',
                bodyStyle: {
                    backgroundColor: '#ddd'
                },
                // title: 'Competencies',
                defaultType: 'slate-demonstrations-teacher-demonstration-competencycard',
                defaults: {
                    closable: true
                },
                items: [
                    {
                        reference: 'competenciesGrid',
                        title: 'Add competency',
                        glyph: 0xf0fe + '@FontAwesome',
                        closable: false,

                        xtype: 'gridpanel',
                        height: 300,
                        hideHeaders: true,
                        viewConfig: {
                            emptyText: 'No competencies match your search.',
                            loadingText: false,
                            stripeRows: false
                        },
                        store: {
                            type: 'chained',
                            source: 'cbl-competencies',
                            groupField: 'ContentAreaID'
                        },
                        columns: [
                            {
                                text: 'Code',
                                dataIndex: 'Code'
                            },
                            {
                                text: 'Descriptor',
                                dataIndex: 'Descriptor',
                                flex: 1
/*
                            },
                            {
                                xtype: 'actioncolumn',
                                width: 40,
                                items: [
                                    {
                                        action: 'add',
                                        glyph: 0xf0fe + '@FontAwesome',
                                        tooltip: 'Add competency to this demonstration'
                                    }
                                ]
*/
                            }
                        ],
                        features: [
                            {
                                id: 'grouping',
                                ftype: 'grouping',
                                groupHeaderTpl: [
                                    '<tpl for="this.getContentAreaData(values.groupValue)">',
                                        '<span class="title">{Title}</span>',
//                                        '<span class="count">{[parent.children.length]}</span>',
                                    '</tpl>',
                                    {
                                        getContentAreaData: function(contentAreaId) {
                                            return Slate.cbl.data.ContentAreas.getById(contentAreaId).getData();
                                        }
                                    }
                                ],
                                enableGroupingMenu: false,
                                startCollapsed: true
                            }
                        ],
                        dockedItems: [
                            {
                                reference: 'competenciesSearchField',
                                dock: 'top',

                                xtype: 'textfield',
                                margin: '6 12',
                                emptyText: 'Type competency code or statement&hellip;'
                            }
                        ]
                    }
                ]
            },
            {
                anchor: '-59', // add " -350" to make stretch with window
                xtype: 'textarea',
                name: 'Comments',
                fieldLabel: 'Comments',

                allowBlank: true,
                selectOnFocus: false
            },
            {
                anchor: '100%',

                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'center'
                },
                items: [
                    {
                        xtype: 'button',
                        text: 'Submit',
                        scale: 'large',
                        action: 'submit',
                        formBind: true,
                        margin: '0 16 0 155'
                    },
                    {
                        reference: 'loadNextStudentCheck',

                        xtype: 'checkboxfield',
                        boxLabel: 'Continue with next student'
                    }
                ]
            }
        ]
    },

    applyDemonstration: function(demonstration) {
        return Ext.factory(demonstration, 'Slate.cbl.model.Demonstration');
    },

    updateDemonstration: function(demonstration) {
        var me = this,
            _fireEvent = function() {
                me.fireEvent('loaddemonstration', me, demonstration);
            };

        // if component is not rendered yet, defer until it is
        if (me.rendered) {
            _fireEvent();
        } else {
            me.on('render', _fireEvent, me, { single: true });
        }
    },

    initComponent: function() {
        var me = this,
            studentCombo;

        me.callParent(arguments);

        studentCombo = me.lookupReference('studentCombo');
        studentCombo.getStore().setSource(me.getStudentsStore());
        studentCombo.setValue(me.getDefaultStudent());
    }
});