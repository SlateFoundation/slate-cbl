Ext.define('Slate.cbl.view.demonstrations.DemonstrationForm', {
    extend: 'Ext.form.Panel',
    xtype: 'slate-cbl-demonstrations-demonstrationform',
    requires: [
        'Jarvus.store.FieldValuesStore',

        'Slate.cbl.widget.StudentSelector',
        'Slate.cbl.store.Competencies',
        'Slate.cbl.model.demonstrations.Demonstration'
    ],


    config: {
        studentSelector: true
    },


    trackResetOnLoad: true,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    defaults: {
        allowBlank: false,
        msgTarget: 'side',
        selectOnFocus: true,
        labelAlign: 'right',
        labelWidth: 150
    },

    items: [
        {
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
            flex: 2,
            // competencyTipTitleTpl: '{Descriptor}',
            // competencyTipBodyTpl: '{Statement}',

            xtype: 'tabpanel',
            tabBar: {
                hidden: true
            },
            // margin: '10 -16',
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
            flex: 1,
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
                    xtype: 'checkboxfield',
                    boxLabel: 'Continue with next student'
                }
            ]
        }
    ],


    // config handlers
    applyStudentSelector: function(studentSelector, oldStudentSelector) {
        if (typeof studentSelector === 'boolean') {
            studentSelector = {
                hidden: !studentSelector
            };
        }

        if (typeof studentSelector == 'object' && !studentSelector.isComponent) {
            studentSelector = Ext.apply({
                name: 'StudentID',
                autoSelect: true
            }, studentSelector);
        }

        return Ext.factory(studentSelector, 'Slate.cbl.widget.StudentSelector', oldStudentSelector);
    },


    // component lifecycle
    initItems: function() {
        var me = this;

        me.callParent();

        me.insert(0, [
            me.getStudentSelector()
        ]);
    }
});