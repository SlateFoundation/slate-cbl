/**
 * The Tasks controller manages the creation, opening, and editing of tasks
 *
 * ## Responsibilities
 * -
 */
Ext.define('SlateTasksTeacher.controller.Tasks', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.util.Format',
        'Ext.window.Toast',
        'Ext.window.MessageBox'
    ],


    saveNotificationTitleTpl: [
        '<tpl if="wasPhantom">',
            'Task Saved',
        '<tpl else>',
            'Task Updated',
        '</tpl>'
    ],

    saveNotificationBodyTpl: [
        '<tpl if="wasPhantom">',
            'Created',
        '<tpl else>',
            'Updated',
        '</tpl>',
        ' task',
        '<tpl for="task">',
            ' <strong>{Title}</strong>',
        '</tpl>',
        ' and assigneed to',
        ' <strong>',
            ' {assigneesCount}',
            ' <tpl if="assigneesCount == 1">student<tpl else>students</tpl>',
            '.',
        '</strong>'
    ],


    // dependencies
    views: [
        'Window@Slate.ui',
        'TaskForm@Slate.cbl.view.tasks'
    ],

    stores: [
        'StudentTasks',
        'Tasks',
        'SectionParticipants'
    ],

    models: [
        'Task@Slate.cbl.model.tasks'
    //     'StudentTask@Slate.cbl.model',
    //     'Comment@Slate.cbl.model.tasks'
    ],


    // component factories and selectors
    refs: {
        dashboardCt: 'slate-tasks-teacher-dashboard',
        createBtn: 'slate-tasks-teacher-dashboard slate-appheader button[action=create]',
        studentsGrid: 'slate-studentsgrid',

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
                assignmentsField: {
                    store: 'SectionParticipants',
                    valueField: 'PersonID',
                    displayField: 'PersonFullName'
                }
            }
        },
        formPanel: 'slate-cbl-tasks-taskform',
        clonedTaskField: 'slate-cbl-tasks-taskform field[name=ClonedTaskID]',
        statusField: 'slate-cbl-tasks-taskform ^ window field[name=Status]',
        submitBtn: 'slate-cbl-tasks-taskform ^ window button[action=submit]'
    },


    // entry points
    listen: {
        controller: {
            '#': {
                bootstrapdataload: 'onBootstrapDataLoad'
            }
        },
        store: {
            '#StudentTasks': {
                load: 'onStudentTasksLoad',
                clear: 'onStudentTasksClear'
            }
        }
    },

    control: {
        dashboardCt: {
            loadedsectionchange: 'onLoadedSectionChange'
        },
        createBtn: {
            click: 'onCreateClick'
        },
        formPanel: {
            dirtychange: 'onFormDirtyChange',
            validitychange: 'onFormValidityChange'
        },
        clonedTaskField: {
            beforeselect: 'onBeforeClonedTaskSelect',
            select: 'onClonedTaskSelect'
        },
        submitBtn: {
            click: 'onSubmitClick'
        },
        studentsGrid: {
            rowheaderclick: 'onRowHeaderClick',
            subrowheaderclick: 'onRowHeaderClick'
        }
    },


    // event handlers
    onBootstrapDataLoad: function(app, bootstrapData) {
        if (!bootstrapData) {
            return;
        }

        // configure model defaults from server configuration
        this.getTaskModel().loadFieldsConfig(bootstrapData.taskFields);

        // enable create button now that model is initialized
        this.getCreateBtn().enable();
    },

    onStudentTasksLoad: function(store, records, success) {
        if (!success) {
            return;
        }

        // eslint-disable-next-line vars-on-top
        var tasksCollection = store.getProxy().relatedCollections.Task;

        this.getTasksStore().loadRawData(tasksCollection ? tasksCollection.getRange() : []);
    },

    onStudentTasksClear: function() {
        this.getTasksStore().unload();
    },

    onLoadedSectionChange: function(dashboardCt, section) {
        // show create button
        this.getCreateBtn().setHidden(!section);
    },

    onCreateClick: function(createBtn) {
        this.openTaskWindow({
            animateTarget: createBtn
        });
    },

    onFormDirtyChange: function(form, dirty) {
        this.getSubmitBtn().setDisabled(!dirty || !form.isValid());
    },

    onFormValidityChange: function(form, valid) {
        this.getSubmitBtn().setDisabled(!valid || !form.isDirty());
    },

    onBeforeClonedTaskSelect: function(clonedTaskField, clonedTask) {
        var formPanel = this.getFormPanel();

        if (!formPanel.getTask().phantom) {
            return true;
        }

        if (
            clonedTaskField.confirmedOverwrite === clonedTask
            || !formPanel.isDirty()
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
        var formPanel = this.getFormPanel(),
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

    onSubmitClick: function(submitBtn) {
        var me = this,
            formWindow = submitBtn.up('window'),
            formPanel = formWindow.getMainView(),
            task = formPanel.getRecord(),
            wasPhantom = task.phantom;

        formPanel.updateRecord(task);
        task.set(me.getStatusField().getModelData());

        // ensure task doesn't become dirty when no changes are made to the form
        if (!task.dirty) {
            return;
        }

        formWindow.setLoading('Saving task&hellip;');

        task.save({
            include: 'StudentTasks',
            success: function(savedTask) {
                var tasksStore = me.getTasksStore(),
                    parentTask = tasksStore.getById(savedTask.get('ParentTaskID')),
                    tplData = {
                        wasPhantom: wasPhantom,
                        task: savedTask.getData(),
                        assigneesCount: Ext.Array.filter(Ext.Object.getValues(savedTask.get('Assignees')), Ext.identityFn).length
                    };

                // show notification to user
                Ext.toast(
                    Ext.XTemplate.getTpl(me, 'saveNotificationBodyTpl').apply(tplData),
                    Ext.XTemplate.getTpl(me, 'saveNotificationTitleTpl').apply(tplData)
                );

                // update loaded tasks data
                tasksStore.beginUpdate();
                tasksStore.mergeData([savedTask]);

                if (parentTask) {
                    parentTask.get('ChildTasks').push(savedTask);
                }

                tasksStore.endUpdate();

                // close window
                formWindow.hide();
                formWindow.setLoading(false);
            },
            failure: function(savedTask, operation) {
                formWindow.setLoading(false);

                Ext.Msg.show({
                    title: 'Failed to save task',
                    message: Ext.util.Format.htmlEncode(operation.getError()),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },

    onRowHeaderClick: function(studentsGrid, taskId, el, ev) {
        if (!ev.getTarget('.edit-row')) {
            return true;
        }

        this.openTaskWindow({
            animateTarget: el,
            task: taskId
        });

        return false;
    },


    // local methods
    openTaskWindow: function(options) {
        options = options || {};

        // eslint-disable-next-line vars-on-top
        var me = this,
            dashboardCt = me.getDashboardCt(),
            section = dashboardCt.getLoadedSection(),
            TaskModel = me.getTaskModel(),
            formWindow = me.getTaskWindow({
                ownerCmp: dashboardCt
            }),
            formPanel = formWindow.getMainView(),
            task = options.task;


        // reconfigure form and window
        formWindow.animateTarget = options.animateTarget || null;


        // fetch task and show window
        if (!task || (typeof task == 'object' && !task.isModel)) {
            task = TaskModel.create(Ext.apply({
                SectionID: section.getId(),
                Section: section.getData()
            }, task || null));

            formPanel.setTask(task);
            formWindow.show();
        } else if (typeof task == 'number') {
            formPanel.setTask(null);
            formWindow.show();
            formWindow.setLoading('Loading task&hellip;');

            TaskModel.load(task, {
                success: function(loadedTask) {
                    formPanel.setTask(loadedTask);
                    formWindow.setLoading(false);
                },
                failure: function(loadedTask, operation) {
                    formWindow.hide();
                    formWindow.setLoading(false);

                    Ext.Msg.show({
                        title: 'Failed to load task #'+task,
                        message: operation.getError(),
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            });
        } else {
            Ext.Logger.error('Invalid task option');
        }
    }
});