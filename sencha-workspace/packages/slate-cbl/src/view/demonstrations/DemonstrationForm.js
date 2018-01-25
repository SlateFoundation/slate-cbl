Ext.define('Slate.cbl.view.demonstrations.DemonstrationForm', {
    extend: 'Ext.container.Container',
    xtype: 'slate-cbl-demonstrations-demonstrationform',
    requires: [
        'Jarvus.store.FieldValuesStore',

        'Slate.cbl.widget.StudentSelector',
        'Slate.cbl.store.Competencies',
        'Slate.cbl.model.demonstrations.Demonstration'
    ],


    trackResetOnLoad: true,

    layout: 'anchor',

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

            xtype: 'slate-cbl-studentselector',
            name: 'StudentID',
            fieldLabel: 'Student',
            autoSelect: true
        },
        {
            anchor: '50%',
            xtype: 'datefield',
            name: 'Demonstrated',
            fieldLabel: 'Demonstrated',
            displayField: 'Demonstrated',
            valueField: 'Demonstrated',
            value: new Date().toLocaleDateString() // TODO: use model default
        },

        {
            xtype: 'combobox',
            name: 'ExperienceType',
            fieldLabel: 'Type of Experience',
            queryMode: 'local',
            store: {
                type: 'fieldvalues',
                valuesModel: 'Slate.cbl.model.demonstrations.Demonstration',
                valuesField: 'ExperienceType'
            }
        },
        {
            xtype: 'combobox',
            name: 'Context',
            fieldLabel: 'Name of Experience',
            queryMode: 'local',
            store: {
                type: 'fieldvalues',
                valuesModel: 'Slate.cbl.model.demonstrations.Demonstration',
                valuesField: 'Context'
            }
        },
        {
            xtype: 'combobox',
            name: 'PerformanceType',
            fieldLabel: 'Performance Task',
            queryMode: 'local',
            store: {
                type: 'fieldvalues',
                valuesModel: 'Slate.cbl.model.demonstrations.Demonstration',
                valuesField: 'PerformanceType'
            }
        },
        {
            xtype: 'textfield',
            name: 'ArtifactURL',
            fieldLabel: 'Artifact (URL)',

            allowBlank: true,
            regex: /^https?:\/\/.+/i,
            regexText: 'Artifact must be a complete URL (starting with http:// or https://)'
        },
        {
            anchor: '100%',

            // competencyTipTitleTpl: '{Descriptor}',
            // competencyTipBodyTpl: '{Statement}',

            xtype: 'tabpanel',
            tabBar: {
                hidden: true
            },
            margin: '10 -16',
            // bodyPadding: '16 75',
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
                        type: 'slate-cbl-competencies',
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
                        }
                    ],
                    features: [
                        {
                            id: 'grouping',
                            ftype: 'grouping',
                            groupHeaderTpl: [
                                '<tpl for="this.getContentAreaData(values.groupValue)">',
                                    '<span class="title">{Title}</span>',
                                    // '<span class="count">{[parent.children.length]}</span>',
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
                    xtype: 'checkboxfield',
                    boxLabel: 'Continue with next student'
                }
            ]
        }
    ]
});