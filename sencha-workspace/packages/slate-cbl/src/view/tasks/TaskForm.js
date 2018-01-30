Ext.define('Slate.cbl.view.tasks.TaskForm', {
    extend: 'Slate.ui.form.Panel',
    xtype: 'slate-cbl-tasks-taskform',
    requires: [
        'Jarvus.store.FieldValuesStore',

        'Slate.ui.PanelFooter',

        'Slate.cbl.model.tasks.Task',
        'Slate.cbl.widget.TaskTitleField',
        'Slate.cbl.widget.SkillsField',
        'Slate.cbl.widget.AssignmentsField',
        'Slate.cbl.widget.AttachmentsField'
    ],


    config: {
        // TODO: add slotted components for optional fields

        title: 'Create Task'
    },


    items: [
        {
            xtype: 'slate-tasks-titlefield'
        },
        {
            xtype: 'slate-tasks-titlefield',
            fieldLabel: 'Subtask of',
            emptyText: '(Optional)',
            name: 'ParentTaskID',
            valueField: 'ID',
            queryMode: 'local',
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
            itemId: 'experience-type',
            name: 'ExperienceType',
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
            xtype: 'slate-skillsfield'
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

    dockedItems: [
        {
            xtype: 'slate-panelfooter',
            items: [
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

    //     return Ext.factory(studentSelector, 'Slate.cbl.widget.StudentSelector', oldStudentSelector);
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