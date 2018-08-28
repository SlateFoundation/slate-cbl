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

        'Slate.cbl.model.demonstrations.Demonstration',
        'Slate.cbl.field.StudentSelector',
        'Slate.cbl.field.ratings.StudentCompetenciesField'
    ],


    config: {
        demonstration: null,

        studentSelector: true,
        ratingsField: true,
        commentsField: true,


        hidden: true,
        title: 'Log Demonstration',

        footer: [
            {
                xtype: 'button',
                text: 'Save Demonstration',
                scale: 'large',
                action: 'submit'
            },
            {
                itemId: 'continueField',

                xtype: 'checkboxfield',
                boxLabel: 'Continue with next student',
                margin: '0 16'
            }
        ]
    },


    componentCls: 'slate-cbl-demonstrations-demonstrationform',
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


    // config handlers
    updateDemonstration: function(demonstration) {
        var me = this;

        Ext.suspendLayouts();

        if (demonstration) {
            me.loadRecord(demonstration);

            if (demonstration.phantom) {
                me.getForm().clearInvalid();
            }

            me.setTitle(demonstration.phantom ? 'Log Demonstration' : 'Edit Demonstration #'+demonstration.getId());
            me.setStudentSelector(demonstration.phantom);
            me.getRatingsField().setSelectedStudent(me.getStudentSelector().getSelectedRecord());
            me.getFooter().getComponent('continueField').setHidden(!demonstration.phantom);

            me.show();
        } else {
            me.setTitle(null);
            me.hide();
        }

        Ext.resumeLayouts(true);
    },

    applyStudentSelector: function(studentSelector, oldStudentSelector) {
        if (typeof studentSelector === 'boolean') {
            studentSelector = {
                disabled: !studentSelector
            };
        }

        if (typeof studentSelector == 'object' && !studentSelector.isComponent && !oldStudentSelector) {
            studentSelector = Ext.apply({
                name: 'StudentID',
                valueField: 'ID',
                autoSelect: true,
                matchFieldWidth: true,
                allowBlank: false
            }, studentSelector);
        }

        return Ext.factory(studentSelector, 'Slate.cbl.field.StudentSelector', oldStudentSelector);
    },

    updateStudentSelector: function(studentSelector) {
        studentSelector.on('select', 'onStudentSelect', this);
    },

    applyRatingsField: function(ratingsField, oldRatingsField) {
        if (typeof ratingsField === 'boolean') {
            ratingsField = {
                hidden: !ratingsField
            };
        }

        if (typeof ratingsField == 'object' && !ratingsField.isComponent && !oldRatingsField) {
            ratingsField = Ext.apply({
                fieldLabel: 'Demonstrated Skills',
                labelAlign: 'top'
            }, ratingsField);
        }

        return Ext.factory(ratingsField, 'Slate.cbl.field.ratings.StudentCompetenciesField', oldRatingsField);
    },

    applyCommentsField: function(commentsField, oldCommentsField) {
        if (typeof commentsField === 'boolean') {
            commentsField = {
                hidden: !commentsField
            };
        }

        if (typeof commentsField == 'object' && !commentsField.isComponent && !oldCommentsField) {
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
    onStudentSelect: function(studentSelector, student) {
        this.getRatingsField().setSelectedStudent(student);
    }
});