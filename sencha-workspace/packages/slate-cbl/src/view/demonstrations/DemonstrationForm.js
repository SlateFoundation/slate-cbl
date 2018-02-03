Ext.define('Slate.cbl.view.demonstrations.DemonstrationForm', {
    extend: 'Slate.ui.form.Panel',
    xtype: 'slate-cbl-demonstrations-demonstrationform',
    requires: [
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.form.field.Checkbox',

        'Jarvus.store.FieldValuesStore',

        'Slate.ui.PanelFooter',

        'Slate.cbl.model.demonstrations.Demonstration',
        'Slate.cbl.widget.StudentSelector',
        'Slate.cbl.field.Ratings'
    ],


    config: {
        studentSelector: true,

        title: 'Log Demonstration'
    },


    items: [
        {
            xtype: 'datefield',
            name: 'Demonstrated',
            fieldLabel: 'Demonstrated',
            displayField: 'Demonstrated',
            valueField: 'Demonstrated'
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
            regexText: 'Artifact must be a complete URL (starting with http:// or https://)',
            emptyText: 'http://…',
            inputType: 'url'
        },
        {
            xtype: 'slate-cbl-ratingsfield',
            fieldLabel: 'Demonstrated Skills',
            labelAlign: 'top'
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

    dockedItems: [
        {
            xtype: 'slate-panelfooter',
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
                valueField: 'ID',
                autoSelect: true,
                matchFieldWidth: true
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