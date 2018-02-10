Ext.define('Slate.cbl.view.tasks.TaskForm', {
    extend: 'Slate.ui.form.Panel',
    xtype: 'slate-cbl-tasks-taskform',
    requires: [
        'Ext.form.field.Display',
        'Ext.form.field.Checkbox',
        'Ext.form.field.TextArea',

        'Jarvus.store.FieldValuesStore',

        'Slate.ui.PanelFooter',

        'Slate.cbl.field.TaskSelector',
        'Slate.cbl.field.ClearableSelector',
        'Slate.cbl.field.SkillsSelector',
        'Slate.cbl.widget.AssignmentsField',
        'Slate.cbl.widget.AttachmentsField'
    ],


    config: {
        // TODO: add slotted components for optional fields

        title: 'Create Task',

        footer: [
            {
                xtype: 'checkboxfield',
                name: 'Status',
                itemId: 'status',
                uncheckedValue: 'private',
                inputValue: 'shared',
                boxLabel: 'Share with other teachers'
            },
            {
                xtype: 'button',
                scale: 'large',
                text: 'Create',
                margin: '0 0 0 16',
                action: 'save'
            }
        ]
    },


    items: [
        {
            name: 'Section',

            xtype: 'displayfield',
            fieldLabel: 'Section',
            renderer: function(value) {
                return value && value.Title || '&mdash;';
            }
        },
        {
            name: 'Title',

            xtype: 'slate-cbl-taskselector',
            fieldLabel: 'Title',
            valueField: 'Title'
        },
        {
            name: 'ParentTaskID',

            xtype: 'slate-cbl-taskselector',
            fieldLabel: 'Subtask of',
            emptyText: '(Optional)',
            queryMode: 'local',
            anyMatch: true,
            allowBlank: true,
            store: {
                type: 'chained',
                source: 'Tasks',
                filters: [{
                    filterFn: function(task) {
                        return !task.get('ParentTaskID');
                    }
                }]
            }
        },
        {
            name: 'ExperienceType',

            xtype: 'slate-cbl-clearableselector',
            fieldLabel: 'Type of Experience',
            displayField: 'value',
            valueField: 'value',
            allowBlank: true,
            autoSelect: false,
            queryMode: 'local',
            store: {
                fields: ['value'],
                pageSize: 0,
                proxy: {
                    type: 'emergence-values',
                    url: '/cbl/tasks/*experience-types'
                }
            }
        },
        {
            xtype: 'slate-cbl-skillsselector',
            selectOnFocus: false
        },
        {
            xtype: 'slate-tasks-attachmentsfield'
        },
        {
            xtype: 'textareafield',
            itemId: 'instructions',
            name: 'Instructions',
            fieldLabel: 'Instructions',
            grow: true,
            growMin: 200
        }
    ],


    // config handlers
    // applyStudentSelector: function(studentSelector, oldStudentSelector) {
    //     if (typeof studentSelector === 'boolean') {
    //         studentSelector = {
    //             hidden: !studentSelector
    //         };
    //     }

    //     if (typeof studentSelector == 'object' && !studentSelector.isComponent) {
    //         studentSelector = Ext.apply({
    //             name: 'StudentID',
    //             autoSelect: true
    //         }, studentSelector);
    //     }

    //     return Ext.factory(studentSelector, 'Slate.cbl.field.StudentSelector', oldStudentSelector);
    // },


    // component lifecycle
    initItems: function() {
        var me = this;

        me.callParent();

        // me.insert(0, [
        //     me.getStudentSelector()
        // ]);
    }
});