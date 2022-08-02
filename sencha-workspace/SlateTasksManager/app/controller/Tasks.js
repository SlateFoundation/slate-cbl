/**
 * The Tasks controller manages the Task Library section where users can browse, create, and edit tasks.
 *
 * ## Responsibilities
 * - Manage the loading the search grid
 * - Respond to create, edit and delete button click in App Header
 * - Respond to create, edit and archive buttons in Task form
 */
Ext.define('SlateTasksManager.controller.Tasks', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API',
        'Ext.window.Toast'
    ],


    // dependencies
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


    // component references
    refs: {
        viewport: {
            selector: 'viewport',
            autoCreate: true,

            xclass: 'SlateTasksManager.view.Viewport'
        },
        tasksManager: 'slate-tasks-manager',
        tasksGrid: 'slate-tasks-manager-grid',

        resultsCountContainer: 'slate-tasks-manager-grid [itemId=results-count-container]',

        taskDetails: 'slate-tasks-manager-details',

        editTaskButton: 'slate-tasks-manager-appheader button[action=edit]',
        deleteTaskButton: 'slate-tasks-manager-appheader button[action=delete]',
        clearFiltersButton: 'slate-tasks-manager-grid button[action=clear-filters]',

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
    },


    // entry points
    listen: {
        store: {
            '#Tasks': {
                datachanged: 'onTasksStoreDataChanged'
            }
        }
    },

    control: {
        editTaskButton: {
            click: 'onEditTaskClick'
        },
        deleteTaskButton: {
            click: 'onDeleteTaskClick'
        },
        'slate-tasks-manager-appheader button[action=create]': {
            click: 'onCreateTaskClick'
        },
        clearFiltersButton: {
            click: 'onClearFiltersClick'
        },
        'slate-tasks-manager-grid menucheckitem[name=include-archived]': {
            checkChange: 'onArchiveCheckboxClick'
        },
        'slate-cbl-tasks-taskform ^ window button[action=archive]' :{
            click: 'onArchiveClick'
        },
        'slate-cbl-tasks-taskform ^ window button[action=un-archive]' :{
          click: 'onUnArchiveClick'
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
        tasksGrid: {
            rowdblclick: 'onTaskManagerRowDblClick',
            select: 'onTaskManagerRecordSelect',
            selectionchange: 'onTaskManagerSelectionChange',
            filterchange: 'onGridFilterChange',
        }
    },


    // controller templates method overrides
    onLaunch: function () {
        // trigger autocreation of main container that self-renders because it extends Viewport
        this.getViewport();

        // trigger initial data load
        this.getTasksStore().load();
    },


    // event handlers
    onTasksStoreDataChanged: function(store) {
        this.getResultsCountContainer().update({
            results: store.getTotalCount()
        })
    },

    onTaskManagerRecordSelect: function() {
        this.showTaskDetails();
    },

    onArchiveCheckboxClick: function(checkbox) {
        var tasksStore = this.getTasksStore();

        tasksStore.getProxy().extraParams.include_archived = checkbox.checked;
        tasksStore.load();
    },

    onGridFilterChange(store, filters) {
        this.getClearFiltersButton().setVisible(filters.length>0);
    },

    onClearFiltersClick(button) {
        this.getTasksGrid().filters.clearFilters();
    },

    onCreateTaskClick: function({ btnEl: { el }}) {
        return this.editTask({
            animateTarget: el
        });
    },

    onEditTaskClick: function({ el }) {
        var me = this,
            task = me.getTasksGrid().getSelection()[0],
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
            tasksGrid = me.getTasksGrid(),
            selection = tasksGrid.getSelection()[0],
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

    onTaskManagerSelectionChange: function(grid, selected) {
        this.getEditTaskButton().setDisabled(selected.length<=0);
        this.getDeleteTaskButton().setDisabled(selected.length<=0);
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

    onArchiveClick: function(archiveBtn) {
        var me = this,
            taskWindow = archiveBtn.up('window'),
            formPanel = taskWindow.getMainView(),
            task = formPanel.getRecord(),
            wasPhantom = task.phantom;

        formPanel.updateRecord(task);
        task.set({
            Status: 'archived'
        });

        // ensure task doesn't become dirty when no changes are made to the form
        if (!task.dirty) {
            return;
        }

        taskWindow.setLoading('Saving task&hellip;');

        task.save({
            include: 'StudentTasks',
            success: function(savedTask) {
                var tasksStore = me.getTasksStore(),
                    parentTask = tasksStore.getById(savedTask.get('ParentTaskID')),
                    tplData = {
                        task: savedTask.getData()
                    };

                // show notification to user
                Ext.toast('Task successfully archived!');

                // update loaded tasks data
                tasksStore.beginUpdate();
                tasksStore.mergeData([savedTask]);

                if (parentTask) {
                    parentTask.get('SubTasks').push(savedTask);
                }

                tasksStore.endUpdate();

                // close window
                taskWindow.hide();

                // update form panel
                formPanel.setTask(null);
                formPanel.setTask(savedTask);
                taskWindow.setLoading(false);

            },
            failure: function(savedTask, operation) {
                taskWindow.setLoading(false);
                taskWindow.hide();

                Ext.Msg.show({
                    title: 'Failed to save task',
                    message: Ext.util.Format.htmlEncode(operation.getError()),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },

    onUnArchiveClick: function(archiveBtn) {
        var me = this,
            taskWindow = archiveBtn.up('window'),
            formPanel = taskWindow.getMainView(),
            task = formPanel.getRecord(),
            wasPhantom = task.phantom;

        formPanel.updateRecord(task);
        task.set({
            Status: 'private'
        });

        // ensure task doesn't become dirty when no changes are made to the form
        if (!task.dirty) {
            return;
        }

        taskWindow.setLoading('Saving task&hellip;');

        task.save({
            include: 'StudentTasks',
            success: function(savedTask) {
                var tasksStore = me.getTasksStore(),
                    parentTask = tasksStore.getById(savedTask.get('ParentTaskID')),
                    tplData = {
                        task: savedTask.getData()
                    };

                // show notification to user
                Ext.toast('Task successfully un-archived!');

                // update loaded tasks data
                tasksStore.beginUpdate();
                tasksStore.mergeData([savedTask]);

                if (parentTask) {
                    parentTask.get('SubTasks').push(savedTask);
                }

                tasksStore.endUpdate();

                // close window
                taskWindow.hide();

                // update form panel
                formPanel.setTask(null);
                formPanel.setTask(savedTask);
                taskWindow.setLoading(false);
            },
            failure: function(savedTask, operation) {
                taskWindow.setLoading(false);
                taskWindow.hide();

                Ext.Msg.show({
                    title: 'Failed to save task',
                    message: Ext.util.Format.htmlEncode(operation.getError()),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },


    // custom controller methods
    showTaskDetails: function(task) {
        var me = this,
            taskDetails = me.getTaskDetails(),
            tasksGrid = me.getTasksGrid();

        if (!task && !(task = tasksGrid.getSelection()[0])) {
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