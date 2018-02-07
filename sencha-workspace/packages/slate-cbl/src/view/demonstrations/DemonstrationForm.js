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
        ratingsField: true,
        commentsField: true,

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
        }
    ],

    dockedItems: [
        {
            xtype: 'slate-panelfooter',
            items: [
                {
                    xtype: 'button',
                    text: 'Reset',
                    scale: 'large',
                    action: 'reset',
                    margin: '0 16 0 155',
                    handler: function() {
                        this.up('window').down('form').reset();
                    }
                },
                {
                    xtype: 'button',
                    text: 'Submit',
                    scale: 'large',
                    action: 'submit',
                    formBind: true,
                    margin: '0 16 0 155'
                },
                {
                    itemId: 'continueField',

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

    updateStudentSelector: function(studentSelector) {
        studentSelector.on('change', 'onStudentChange', this);
    },

    applyRatingsField: function(ratingsField, oldRatingsField) {
        if (typeof ratingsField === 'boolean') {
            ratingsField = {
                hidden: !ratingsField
            };
        }

        if (typeof ratingsField == 'object' && !ratingsField.isComponent) {
            ratingsField = Ext.apply({
                fieldLabel: 'Demonstrated Skills',
                labelAlign: 'top'
            }, ratingsField);
        }

        return Ext.factory(ratingsField, 'Slate.cbl.field.Ratings', oldRatingsField);
    },

    applyCommentsField: function(commentsField, oldCommentsField) {
        if (typeof commentsField === 'boolean') {
            commentsField = {
                hidden: !commentsField
            };
        }

        if (typeof commentsField == 'object' && !commentsField.isComponent) {
            commentsField = Ext.apply({
                flex: 1,

                name: 'Comments',
                fieldLabel: 'Comments',
                allowBlank: true,
                selectOnFocus: false
            }, commentsField);
        }

        return Ext.factory(commentsField, 'Ext.form.field.TextArea', oldCommentsField);
    },


    // component lifecycle
    initItems: function() {
        var me = this;

        me.callParent();

        me.insert(0, [
            me.getStudentSelector()
        ]);

        me.add([
            me.getRatingsField(),
            me.getCommentsField()
        ]);
    },


    // event handlers
    onStudentChange: function(studentSelector) {
        var student = studentSelector.getSelectedRecord();

        this.getRatingsField().setSelectedStudent(student ? student.get('Username') : null);

    }
});