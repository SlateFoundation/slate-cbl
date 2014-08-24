/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.view.teacher.demonstration.CreateWindow', {
    extend: 'Ext.window.Window',
    xtype: 'slate-cbl-teacher-demonstration-createwindow',
    requires: [
        'Slate.cbl.view.teacher.demonstration.CreateWindowController',
        'Slate.cbl.store.AllCompetencies',
        'Slate.cbl.model.Demonstration',
        'Slate.cbl.field.LevelSlider',

        'Ext.layout.container.Fit',
        'Ext.form.Panel',
        'Ext.grid.Panel',
        'Ext.grid.feature.Grouping',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Checkbox',
        'Ext.data.ChainedStore'
    ],
    
    controller: 'slate-cbl-teacher-demonstration-createwindow',
    
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
                    source: 'cbl-students'
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
                
                store: ['Journalism', 'Mythbusters', 'Personal Finance', 'Math Workshop', 'Literacy Workshop', 'Culinary Arts', 'Etnrepreneurship', 'Performing Arts', 'Help Desk']
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

                xtype: 'tabpanel',
                margin: '10 -16',
//                bodyPadding: '16 75',
                bodyStyle: {
	                backgroundColor: '#ddd'
                },
                // title: 'Competencies',
//                defaults: {
//                    xtype: 'container',
//                    closable: true,
//                    layout: 'anchor',
//                    defaults: {
//                        xtype: 'slate-cbl-levelsliderfield',
//						labelAlign: 'top',
//                        anchor: '100%'
//                        // labelWidth: 150
//                    }
//                },
                items: [
                    {
                        reference: 'competenciesGrid',
                        title: 'Add competency',
                        glyph: 0xf0fe + '@FontAwesome',
                        closable: false,
                        tabConfig: {
                            hidden: true
                        },

                        xtype: 'gridpanel',
                        height: 300,
                        hideHeaders: true,
                        store: {
                            xclass: 'Slate.cbl.store.AllCompetencies'
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
                                            var contentAreaData = this.owner.grid.getStore().contentAreas.get(values.groupValue),
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
                                emptyText: 'Type competency code or statement...'
                            }
                        ]
                    }
//                    {
//                        reference: 'addCompetencyCt',
//                        title: 'Add competency',
//                        glyph: 0xf0fe + '@FontAwesome',
//
//                        closable: false,
//                        tabConfig: {
//                            hidden: true
//                        },
//                        defaults: {
//                            xtype: 'button',
//                            scale: 'large',
//                            margin: '0 0 5'
//                        },
//                        layout: {
//                            type: 'vbox',
//                            align: 'stretch'
//                        }
//                    }
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
                        boxLabel: 'Load next student',
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
    }
});