Ext.define('SlateTasksManager.controller.Tasks', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API',
        'Ext.window.Toast'
    ],

    views: [
        'TasksManager',
        'TaskForm@Slate.cbl.view.tasks',
        'Window@Slate.ui'
    ],

    stores: [
        'Tasks',
        'ParentTasks'
    ],

    models: [
        'Task@Slate.cbl.model.tasks'
    ],

    config: {
        refs: {
            tasksManager: {
                selector: 'slate-tasks-manager',
                autoCreate: true,

                xtype: 'slate-tasks-manager'
            },

            taskDetails: 'slate-tasks-manager-details',
            clonedTaskField: 'slate-cbl-tasks-taskform field[name=ClonedTaskID]',

            taskWindow: {
                autoCreate: true,

                xtype: 'slate-window',
                closeAction: 'hide',
                modal: true,
                layout: 'fit',
                minWidth: 300,
                width: 600,
                minHeight: 600,

                mainView: {
                    xtype: 'slate-cbl-tasks-taskform',

                    parentTaskField: {
                        store: 'ParentTasks'
                    },
                    sectionField: false,
                    clonedTaskDisplayField: false,
                    assignmentsField: false
                }
            }
        }
    },

    control: {
        'slate-tasks-manager toolbar button[action=delete]': {
            click: 'onDeleteTaskClick'
        },
        'slate-tasks-manager toolbar button[action=edit]': {
            click: 'onEditTaskClick'
        },
        'slate-tasks-manager toolbar button[action=create]': {
            click: 'onCreateTaskClick'
        },
        'slate-cbl-tasks-taskform ^ window button[action=submit]': {
            click: 'onSaveTaskClick'
        },
        'slate-cbl-tasks-taskform': {
            taskchange: 'onTaskFormTaskChange'
        },
        clonedTaskField: {
            beforeselect: 'onBeforeClonedTaskSelect',
            select: 'onClonedTaskSelect'
        },
        tasksManager: {
            rowdblclick: 'onTaskManagerRowDblClick',
            select: 'onTaskManagerRecordSelect'
        }
    },

    onLaunch: function () {
        this.getTasksManager().render('slateapp-viewport');
        this.getTasksStore().load();
    },

    onCreateTaskClick: function({ btnEl: { el }}) {
        return this.editTask({
            animateTarget: el
        });
    },

    onEditTaskClick: function({ el }) {
        var me = this,
            task = me.getTasksManager().getSelection()[0],
            taskWindow = me.getTaskWindow(),
            taskEditor = taskWindow.getMainView(),
            lastEditedTask = taskEditor.getTask();

        if (!task) {
            return Ext.Msg.alert('Edit Task', 'Nothing selected. Please select a task to edit.');
        }

        // fix issue with editing phantom tasks
        if (lastEditedTask && task.getId() === lastEditedTask.getId()) {
            taskEditor.setTask(null);
        }

        return me.editTask({
            task,
            animateTarget: el
        });
    },

    onDeleteTaskClick: function() {
        var me = this,
            taskManager = me.getTasksManager(),
            selection = taskManager.getSelection()[0],
            title, message;

        if (!selection) {
            Ext.Msg.alert('Delete Task', 'Nothing selected. Please select a task to delete.');
            return;
        }

        title = 'Delete Task';
        message = 'Are you sure you want to delete this task? <br><strong>' + selection.get('Title') + '</strong>';
        Ext.Msg.confirm(title, message, function(response) {
            if (response === 'yes') {
                me.deleteTask(selection);
            }
        });
    },

    onSaveTaskClick: function() {
        return this.saveTask();
    },

    onTaskManagerRecordSelect: function() {
        this.showTaskDetails();
    },

    onTaskManagerRowDblClick: function(taskManager, task, taskRowEl) {
        return this.editTask({
            task,
            animateTarget: taskRowEl
        });
    },

    onBeforeClonedTaskSelect: function(clonedTaskField, clonedTask) {
        var taskWindow = this.getTaskWindow(),
            taskEditor = taskWindow.getMainView();

        if (!taskEditor.getTask().phantom) {
            return true;
        }

        if (
            clonedTaskField.confirmedOverwrite === clonedTask
            || !taskEditor.isDirty()
        ) {
            delete clonedTaskField.confirmedOverwrite;
            return true;
        }

        Ext.Msg.confirm(
            'Are you sure?',
            'Selecting a task to clone may overwrite what you have input already, proceed?',
            function(btnId) {
                if (btnId == 'yes') {
                    clonedTaskField.confirmedOverwrite = clonedTask;
                    clonedTaskField.setSelection(clonedTask);
                }
            }
        );

        return false;
    },

    onClonedTaskSelect: function(clonedTaskField, clonedTask) {
        var taskWindow = this.getTaskWindow(),
            formPanel = taskWindow.getMainView(),
            form = formPanel.getForm(),
            fields = clonedTask.getFields(),
            fieldsLength = fields.length, fieldIndex = 0, field, fieldName, formField;

        formPanel.setLoading('Cloning task&hellip;');

        clonedTask.load({
            success: function(loadedTask, operation) {
                for (; fieldIndex < fieldsLength; fieldIndex++) {
                    field = fields[fieldIndex];

                    if (!field.clonable) {
                        continue;
                    }

                    fieldName = field.name;
                    formField = form.findField(fieldName);

                    if (formField) {
                        formField.setValue(loadedTask.get(fieldName));
                    } else {
                        Ext.Logger.warn('Could not find form field for clonable task model field: '+fieldName);
                    }
                }

                formPanel.setLoading(false);
            },
            failure: function(savedTask, operation) {
                formPanel.setLoading(false);

                Ext.Msg.show({
                    title: 'Failed to save task',
                    message: Ext.util.Format.htmlEncode(operation.getError()),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },

    onTaskFormTaskChange: function(form, task, oldTask) {
        var me = this,
            skillsField = form.getSkillsSelectorField(),
            attachmentsField = form.getAttachmentsField(),
            parentTaskField = form.getParentTaskField(),
            footer = form.getFooter(),
            statusField = footer.down('checkboxfield[name=Status]');

        form.reset();

        if (task) {
            statusField.setValue(task.get('Status') ? task.get('Status') : 'shared');
            form.loadRecord(task);
            skillsField.setValue(task.get('Skills'));
            attachmentsField.setValue(task.get('Attachments'));

            form.setTitle((task.phantom ? 'Create' : 'Edit') + ' Task');
            footer.down('button[action=submit]').setText(task.phantom ? 'Create' : 'Save');
            // clear previous filters
            parentTaskField.getStore().clearFilter();
            // filter out subtasks and current task
            parentTaskField
                .getStore()
                .filterBy(
                    rec => rec.get('ParentTaskID') === null && rec.getId() !== task.getId()
                );

            if (task.get('ParentTaskID')) {
                parentTaskStore = parentTaskField.getStore();
                //load parent task if store does not contain the record
                if (!parentTaskStore.getById(task.get('ParentTaskID'))) {
                    parentTaskStore.source.load({
                        url: Slate.API.buildUrl('/cbl/tasks/'+task.get('ParentTaskID')),
                        params: {
                            summary: true
                        },
                        addRecords: true,
                        callback: function (records) {
                            parentTaskField.setValue(task.get('ParentTaskID'));
                        }
                    });
                }
            }
        }

    },

    showTaskDetails: function(task) {
        var me = this,
            taskDetails = me.getTaskDetails(),
            taskManager = me.getTasksManager();

        if (!task && !(task = taskManager.getSelection()[0])) {
            return;
        }

        taskDetails.setTask(task);
    },

    saveTask: function() {
        var me = this,
            taskWindow = me.getTaskWindow(),
            form = taskWindow.getMainView(),
            record = form.getRecord(),
            skillsField = form.getSkillsSelectorField(),
            attachmentsField = form.getAttachmentsField(),
            statusField = form.getFooter().down('checkboxfield[name=Status]'),
            errors;

        form.updateRecord(record);

        record.set({
            Status: statusField.getSubmitValue(),
            Skills: skillsField.getValue(),
            Attachments: attachmentsField.getValue()
        });

        errors = record.validate();

        if (errors.length) {
            Ext.each(errors.items, function(item) {
                var itemField = form.down('[name='+item.field +']');

                if (itemField) {
                    itemField.markInvalid(item.message);
                }
            });
            return;
        }

        taskWindow.setLoading('Saving task&hellip;');
        record.save({
            success: function(savedTask) {
                var tasksStore = me.getTasksStore();

                tasksStore.beginUpdate();
                tasksStore.mergeData([savedTask]);
                tasksStore.endUpdate();

                taskWindow.setLoading(false);
                taskWindow.hide();

                Ext.toast('Task succesfully saved!');
            },
            failure: function(savedTask, operation) {
                taskWindow.setLoading(false);
                Ext.Msg.show({
                    title: 'Failed to save task',
                    message: Ext.util.Format.htmlEncode(operation.getError()),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },

    editTask: function({ task, animateTarget }) {
        var me = this,
            taskWindow = me.getTaskWindow({
                ownerCmp: me.getTasksManager()
            }),
            taskEditor = taskWindow.getMainView();

        if (!task || (typeof task == 'object' && !task.isModel)) {
            task = me.getTaskModel().create(Ext.apply({
                SectionID: 0,
                Status: 'shared'
            }, task || null));
        }

        taskWindow.animateTarget = animateTarget;
        taskEditor.setClonedTaskDisplayField({ hidden: !task });
        taskEditor.setClonedTaskField({ hidden: !!task });
        taskEditor.setTask(task);

        taskWindow.show();
    },

    deleteTask: function(taskRecord) {
        var store = this.getTasksStore();

        store.remove(taskRecord);
        store.sync();
    }
});