/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.view.teacher.demonstration.EditWindow', {
    extend: 'Ext.window.Window',
    xtype: 'slate-cbl-teacher-demonstration-editwindow',
    requires: [
        'Slate.cbl.view.teacher.demonstration.EditWindowController',
        'Slate.cbl.view.teacher.demonstration.CompetencyCard',
        'Slate.cbl.store.AllCompetencies',
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
        'Ext.data.ChainedStore'
    ],

    controller: 'slate-cbl-teacher-demonstration-editwindow',

    config: {
        demonstration: true
    },

    title: 'Log a demonstration',
    width: 600,
    constrainHeader: true,

    tools: [
        {
            type: 'gear',
            tooltip: 'Override'
        }
    ],

    layout: 'fit',
    items: {
        reference: 'form',

        xtype: 'form',
        trackResetOnLoad: true,
        autoScroll: true,
        bodyPadding: 16,
        defaults: {
            anchor: '75%',
            allowBlank: false,
            msgTarget: 'side',
            selectOnFocus: true,
            labelAlign: 'right',
            labelWidth: 150
        },
        items: [
            {
                xtype: 'combobox',
                name: 'StudentID',
                fieldLabel: 'Student',

                store: {
                    type: 'chained',
                    source: 'cbl-students-loaded'
                },
                queryMode: 'local',
                displayField: 'FullName',
                valueField: 'ID',

                forceSelection: true,
                autoSelect: true
            },
            {
                xtype: 'combobox',
                name: 'ExperienceType',
                fieldLabel: 'Type of Experience',

                store: ['Core Studio', 'Choice Studio', 'Workshop', 'Health and Wellness', 'PE/Fitness', 'Online Courseware', 'Situated Learning', 'Work-based Learning', 'Advisory']
            },
            {
                xtype: 'combobox',
                name: 'Context',
                fieldLabel: 'Context',

                store: ['Journalism', 'Mythbusters', 'Personal Finance', 'Math Workshop', 'Literacy Workshop', 'Culinary Arts', 'Entrepreneurship', 'Performing Arts', 'Help Desk']
            },
            {
                xtype: 'combobox',
                name: 'PerformanceType',
                fieldLabel: 'Performance Task',

                store: ['Position paper', 'Lab report', 'Media presentation', 'Argumentative essay', 'Speech']
            },
            {
                anchor: '-59',

                xtype: 'textfield',
                name: 'ArtifactURL',
                fieldLabel: 'Artifact (URL)',

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
                defaultType: 'slate-cbl-teacher-demonstration-competencycard',
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
                            source: 'cbl-competencies-all',
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
                                    '{[this.getContentAreaHeader(values)]}',
                                    {
                                        contentAreaTpl: [
                                            '<span class="title">{Title}</span>'
//                                            '<span class="count">{[parent.children.length]}</span>'
                                        ],
                                        getContentAreaHeader: function(values) {
                                            var contentAreaData = Ext.getStore('cbl-competencies-all').contentAreas.get(values.groupValue),
                                                contentAreaTpl = Ext.XTemplate.getTpl(this, 'contentAreaTpl');

                                            return contentAreaTpl.apply(contentAreaData, values);
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
                        boxLabel: 'Continue with next student',
                        checked: true
                    }
                ]
            }
        ]
    },

    applyDemonstration: function(demonstration) {
        if (!demonstration) {
            return null;
        }

        if (demonstration.isModel) {
            return demonstration;
        }

        if (demonstration === true) {
            demonstration = {};
        }

        return Ext.create('Slate.cbl.model.Demonstration', demonstration);
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
    }
});