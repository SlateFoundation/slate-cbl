/**
 * The Tasks controller manages the creation, opening, and editing of tasks
 *
 * ## Responsibilities
 * -
 */
Ext.define('SlateTasksTeacher.controller.Tasks', {
    extend: 'Ext.app.Controller',
    // requires: [
    //     'Ext.window.Toast',
    //     'Ext.window.MessageBox'
    // ],


    // dependencies
    views: [
        'Window@Slate.ui',
        'TaskForm@Slate.cbl.view.tasks'
    ],

    stores: [
        'StudentTasks',
        'Tasks'
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
        // studentsGrid: 'slate-studentsgrid',

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
                xtype: 'slate-cbl-tasks-taskform'
            }
        }

    //     taskEditorForm: 'slate-tasks-teacher-taskeditor slate-modalform',
    //     skillsField: 'slate-tasks-teacher-taskeditor slate-skillsfield',
    //     attachmentsField: 'slate-tasks-teacher-taskeditor slate-tasks-attachmentsfield',
    //     attachmentsList: 'slate-tasks-teacher-taskeditor slate-tasks-attachmentsfield slate-attachmentslist',
    //     assignmentsField: 'slate-tasks-teacher-taskeditor slate-tasks-assignmentsfield',
    //     assignmentsComboField: 'slate-tasks-teacher-taskeditor slate-tasks-assignmentsfield combo',

    //     attachmentConfirmationWindow: {
    //         selector: 'slate-tasks-attachmentconfirmation',
    //         autoCreate: true,

    //         xtype: 'slate-tasks-attachmentconfirmation'
    //     },

    //     taskAssigner: {
    //         selector: 'slate-tasks-teacher-taskassigner',
    //         autoCreate: true,

    //         xtype: 'slate-tasks-teacher-taskassigner'
    //     },

    //     taskRater: {
    //         selector: 'slate-tasks-teacher-taskrater',
    //         autoCreate: true,

    //         xtype: 'slate-tasks-teacher-taskrater'
    //     },
    //     commentsField: 'slate-tasks-teacher-taskrater slate-commentsfield',
    //     acceptTaskBtn: 'slate-tasks-teacher-taskrater button[action=accept]'
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
            selectedsectionchange: 'onSelectedSectionChange',
            loadedsectionchange: 'onLoadedSectionChange'
        },
        createBtn: {
            click: 'onCreateClick'
        }
    //     tasksGrid: {
    //         cellclick: 'onTasksGridCellClick',
    //         subcellclick: 'onTasksGridCellClick',
    //         rowheaderclick: 'onTasksGridRowHeaderClick',
    //         subrowheaderclick: 'onTasksGridRowHeaderClick',
    //         beforeexpand: 'onBeforeRowHeaderToggle',
    //         beforecollapse: 'onBeforeRowHeaderToggle',
    //         columnheaderclick: 'onTasksGridColumnHeaderClick'
    //     },
    //     taskRater: {
    //         reassign: 'onReAssignStudentTaskClick'
    //     },
    //     assignmentsComboField: {
    //         afterrender: 'onAssigneeComboRender'
    //     },
    //     commentsField: {
    //         publish: 'onCommentsFieldPublish'
    //     },

    //     acceptTaskBtn: {
    //         click: 'onAcceptTaskClick'
    //     },

    //     'slate-tasks-teacher-taskrater button[action=reassign]': {
    //         click: 'onAssignRevisionClick'
    //     },
    //     'slate-tasks-teacher-taskrater button[action=unassign]': {
    //         click: 'onUnassignStudentTaskClick'
    //     },
    //     'slate-tasks-teacher-taskrater button[action=edit]': {
    //         click: 'onEditStudentTaskClick'
    //     },
    //     'slate-tasks-teacher-taskrater slate-ratingview': {
    //         rateskill: 'onRateSkillClick'
    //     },
    //     'slate-tasks-teacher-taskassigner button[action=assign]': {
    //         click: 'onAssignTaskClick'
    //     },
    //     'slate-tasks-teacher-taskeditor button[action=save]': {
    //         click: 'onSaveTaskClick'
    //     },
    //     'slate-tasks-teacher-appheader button[action=create]': {
    //         click: 'onCreateTaskClick'
    //     },
    //     'slate-tasks-teacher-taskeditor slate-tasks-titlefield[clonable]': {
    //         select: 'onClonableTitleFieldSelect'
    //     }
    },


    // event handlers
    onBootstrapDataLoad: function(app, bootstrapData) {
        var Task = this.getTaskModel(),
            taskDefaults = bootstrapData.taskDefaults,
            fieldName, field;

        // configure model defaults from server configuration
        if (taskDefaults) {
            for (fieldName in taskDefaults) {
                if (!taskDefaults.hasOwnProperty(fieldName)) {
                    continue;
                }

                field = Task.getField(fieldName);

                if (field) {
                    field.defaultValue = taskDefaults[fieldName];
                }
            }
        }

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

    onSelectedSectionChange: function(dashboardCt, sectionCode) {
        var me = this,
            studentTasksStore = me.getStudentTasksStore();

        // (re)load StudentTask list
        studentTasksStore.setSection(sectionCode);
        studentTasksStore.loadIfDirty(true);
    },

    onLoadedSectionChange: function(dashboardCt, section) {
        // show create button
        this.getCreateBtn().setHidden(!section);
    },

    onCreateClick: function(createBtn) {
        var me = this,
            dashboardCt = me.getDashboardCt(),
            section = dashboardCt.getLoadedSection(),
            task = me.getTaskModel().create({
                SectionID: section.getId(),
                Section: section.getData()
            }),
            taskWindow = me.getTaskWindow({
                ownerCmp: dashboardCt
            }),
            formPanel = taskWindow.getMainView();


        // reconfigure form and window
        formPanel.loadRecord(task);
        taskWindow.animateTarget = createBtn;


        // show window
        taskWindow.show();
    }

    // onTasksGridCellClick: function(grid, taskId, studentId) {
    //     var me = this,
    //         dataStore = grid.getDataStore(),
    //         studentTask = dataStore.getAt(dataStore.findBy(function(r) {
    //             return r.get('TaskID') == taskId && r.get('StudentID') == studentId;
    //         }));

    //     if (studentTask) {
    //         return me.doRateStudentTask(studentTask);
    //     }

    //     return me.doAssignStudentTask(taskId, studentId);
    // },

    // onReAssignStudentTaskClick: function(taskRater, dateField, date) {
    //     var studentTask = taskRater.getStudentTask();

    //     studentTask.set({
    //         DueDate: date,
    //         TaskStatus: 're-assigned'
    //     });

    //     studentTask.save({
    //         success: function(rec) {
    //             taskRater.close();
    //             Ext.toast('Student task successfully reassigned.');
    //         }
    //     });
    // },

    // onTasksGridRowHeaderClick: function(grid, rowId, el, ev) {
    //     var me = this,
    //         task;

    //     if (ev.getTarget('.jarvus-aggregrid-rowheader .edit-row')) {
    //         task = me.getTasksStore().getById(rowId);

    //         me.doEditTask(task);
    //     }

    //     return;
    // },

    // onTasksGridColumnHeaderClick: function(grid, columnId, el, ev) {
    //     var me = this,
    //         courseSection,
    //         student;

    //     if (ev.getTarget('.jarvus-aggregrid-colheader')) {
    //         student = me.getStudentsStore().getById(columnId);
    //         courseSection = me.getDashboardCt().getCourseSection();

    //         window.open(Slate.API.buildUrl('/cbl/dashboards/tasks/student')+'#'+student.get('Username')+'/'+courseSection.get('Code'), '_blank');
    //     }
    // },

    // onBeforeRowHeaderToggle: function(grid, rowId, el, ev) {
    //     if (ev.getTarget('.jarvus-aggregrid-rowheader .edit-row')) {
    //         return false;
    //     }
    //     return null;
    // },

    // onAssigneeComboRender: function(combo) {
    //     var me = this,
    //         comboStore = combo.getStore(),
    //         studentsStore = me.getStudentsStore();

    //     comboStore.removeAll();
    //     comboStore.add(studentsStore.getRange());
    //     combo.setValueOnData();
    // },

    // onCommentsFieldPublish: function(fieldContainer, field) {
    //     var me = this,
    //         record = fieldContainer.getRecord(),
    //         comment,
    //         originalComments = record.get('Comments') || [];

    //     comment = me.getCommentModel().create({
    //         Message: field.getValue(),
    //         ContextID: record.getId(),
    //         ContextClass: record.get('Class')
    //     });

    //     comment.save({
    //         success: function(rec) {
    //             originalComments.push(rec.getData({ serialize: true }));
    //             record.set('Comments', originalComments);
    //             fieldContainer.updateRecord(record);
    //             field.setValue('');
    //         }
    //     });
    // },

    // onAcceptTaskClick: function() {
    //     var me = this,
    //         taskRater = me.getTaskRater(),
    //         studentTask = taskRater.getStudentTask(),
    //         status = studentTask.get('TaskStatus') === 'completed' ? 're-assigned' : 'completed';

    //     studentTask.set('TaskStatus', status);
    //     taskRater.mask((status === 'completed' ? 'Accepting' : 'Unaccepting') + '&hellip;');
    //     me.doSaveStudentTask(studentTask, function(rec, request, success) {
    //         taskRater.unmask();
    //         if (success) {
    //             taskRater.close();
    //             me.getStudentTasksStore().load({
    //                 id: studentTask.getId(),
    //                 addRecords: true
    //             });

    //             if (status === 're-assigned') {
    //                 me.doRateStudentTask(rec);
    //             }
    //         }
    //     });
    // },

    // onAssignRevisionClick: function(btn) {
    //     var me = this,
    //         coords = btn.getXY(),
    //         datepicker;

    //     if (btn.dateSelected) {
    //         me.doAssignStudentTaskRevision(btn.dateSelected);
    //     } else {
    //         datepicker = Ext.widget({
    //             xtype: 'datepicker',
    //             floating: true,
    //             handler: function(picker, date) {
    //                 picker.destroy();
    //                 btn.dateSelected = date;
    //                 return btn.setText('Re-Assign revision due on '+Ext.Date.format(date, 'm/d/y'));
    //             }
    //         });
    //         datepicker.show().showAt(coords[0], coords[1] - datepicker.getHeight()); // subtract datepicker height from y coord to show above button.
    //     }
    // },

    // onUnassignStudentTaskClick: function() {
    //     var me = this,
    //         taskRater = me.getTaskRater(),
    //         studentTask = taskRater.getStudentTask();

    //     Ext.Msg.confirm('Are you sure?', 'Do you want to unassign this student task? This can not be undone.', function(ans) {
    //         if (ans === 'yes') {
    //             me.doUnAssignStudentTask(studentTask);
    //         }
    //     });

    // },

    // onEditStudentTaskClick: function() {
    //     var me = this,
    //         taskRater = me.getTaskRater(),
    //         studentTask = taskRater.getStudentTask();

    //     taskRater.close();
    //     me.doEditStudentTask(studentTask);
    // },

    // onRateSkillClick: function(ratingView, ratingData) {
    //     var me = this,
    //         studentTask = me.getTaskRater().getStudentTask();

    //     Slate.API.request({
    //         url: studentTask.toUrl() + '/rate',
    //         method: 'POST',
    //         params: {
    //             include: me.getStudentTasksStore().getProxy().getInclude()
    //         },
    //         jsonData: {
    //             SkillID: ratingData.SkillID,
    //             Rating: ratingData.Rating,
    //         },
    //         callback: function(options, success, response) {
    //             if (success && response.data && response.data.success) {
    //                 studentTask.set(response.data.StudentTask, { dirty: false });
    //             } else {
    //                 Ext.toast(response.data && response.data.message || 'Please try again or report the issue to an administrator', 'Failed to save rating');
    //             }
    //         }
    //     });
    // },

    // onAssignTaskClick: function() {
    //     var me = this,
    //         taskAssigner = me.getTaskAssigner(),
    //         taskAssignerValues = taskAssigner.down('slate-modalform').getValues(),
    //         task = taskAssigner.getTask(),
    //         student = taskAssigner.getStudent(),
    //         studentTask = me.getStudentTaskModel().create({
    //             TaskID: task.getId(),
    //             Task: task.getData(),
    //             StudentID: student.getId(),
    //             Student: student.getData(),
    //             DueDate: taskAssignerValues.DueDate,
    //             ExpirationDate: taskAssignerValues.ExpirationDate,
    //             ExperienceType: taskAssignerValues.ExperienceType,
    //             SectionID: me.getCourseSelector().getSelection().getId()
    //         });

    //     taskAssigner.mask('Assigning&hellip;');
    //     me.doSaveStudentTask(studentTask, function(rec, request, success) {
    //         if (success) {
    //             taskAssigner.close();
    //             me.getStudentTasksStore().load({
    //                 id: studentTask.getId(),
    //                 addRecords: true
    //             });
    //             Ext.toast(student.getFullName() + ' was assigned task: ' + task.get('Title'));
    //         } else {
    //             Ext.Msg.alert('An error occured', 'Please try again later.');
    //             taskAssigner.unmask();
    //         }
    //     });

    // },

    // onSaveTaskClick: function() {
    //     var me = this,
    //         taskEditor = me.getTaskEditor(),
    //         task = taskEditor.getTask(),
    //         studentTask = taskEditor.getStudentTask();

    //     if (studentTask) {
    //         me.getTaskEditorForm().updateRecord(studentTask);
    //         studentTask.set('SkillIDs', me.getSkillsField().getSkills(false, true)); // returnRecords, idsOnly
    //         taskEditor.mask('Publishing&hellip;');
    //         return me.doSaveStudentTask(studentTask, function(rec, request, success) {
    //             taskEditor.unmask();
    //             if (success) {
    //                 me.getStudentTasksStore().load({
    //                     id: studentTask.getId(),
    //                     addRecords: true
    //                 });
    //                 taskEditor.close();
    //                 Ext.toast('Student task successfully updated.');
    //             }
    //         });
    //     }

    //     if (!task.phantom && task.getAssigneeIds().length) {
    //         return me.doConfirmTaskAssignees(task);
    //     }

    //     return me.doSaveTask();

    // },

    // onClonableTitleFieldSelect: function(combo) {
    //     var me = this,
    //         record = combo.getSelectedRecord(),
    //         title = 'New Task',
    //         message = 'Do you want to clone this task?<br><strong>' + record.get('Title') + '</strong>';

    //     Ext.Msg.confirm(title, message, function(btnId) {
    //         if (btnId === 'yes') {
    //             me.doCloneTask(record);
    //         }
    //     });
    // },

    // doAssignStudentTaskRevision: function(date) {
    //     var me = this,
    //         taskRater = me.getTaskRater(),
    //         studentTask = taskRater.getStudentTask();

    //     studentTask.set('DueDate', date.getTime()/1000);
    //     studentTask.set('TaskStatus', 're-assigned');
    //     studentTask.save({
    //         callback: function() {
    //             taskRater.close();
    //             Ext.toast('Student task successfully updated.');
    //             me.doRateStudentTask(studentTask);
    //         }
    //     });
    // },

    // doUnAssignStudentTask: function(studentTask) {
    //     var me = this;

    //     studentTask.erase({
    //         callback: function(opts, success) {
    //             if (success) {
    //                 Ext.toast('Student task unassigned.');
    //                 me.getTaskRater().close();
    //             }
    //         }
    //     });
    // },

    // doSaveStudentTask: function(studentTask, callback, scope) {
    //     var me = this,
    //         taskEditor = me.getTaskEditor();

    //     studentTask.save({
    //         callback: function(record, request, success) {
    //             var message = [],
    //                 response = request.getResponse().data,
    //                 validationErrors, key;

    //             if (!success) {
    //                 message.push(
    //                     '<p>',
    //                     'Unable to save task.',
    //                     '</p>'
    //                 );

    //                 if (response.failed && response.failed.length) {
    //                     validationErrors = response.failed[0].validationErrors;

    //                     for (key in validationErrors) {
    //                         if (validationErrors.hasOwnProperty(key)) {
    //                             message.push(
    //                                 '<p>',
    //                                 validationErrors[key],
    //                                 '</p>'
    //                             );
    //                         }
    //                     }
    //                     record.reject();
    //                     Ext.Msg.alert('Error', message.join(' '));
    //                 }
    //             }
    //             Ext.callback(callback, scope, arguments);
    //         }
    //     });
    // },

    // doSaveTask: function(forceReload) {
    //     var me = this,
    //         taskEditor = me.getTaskEditor(),
    //         form = me.getTaskEditorForm(),
    //         skillsField = me.getSkillsField(),
    //         attachmentsField = me.getAttachmentsField(),
    //         assignmentsField = me.getAssignmentsField(),
    //         courseSection = me.getCourseSelector().getSelection(),
    //         record = form.updateRecord().getRecord(),
    //         wasPhantom = record.phantom,
    //         currentAssignees = assignmentsField.getAssignees(false),
    //         errors,
    //         showDocumentSharingWarning = false,
    //         attachment, i = 0,
    //         confirmationWindow = me.getAttachmentConfirmationWindow(),
    //         _saveRecord;

    //     record.set({
    //         Skills: skillsField.getSkills(false), // returnRecords
    //         Attachments: attachmentsField.getAttachments(false), // returnRecords
    //         Assignees: currentAssignees, // returnRecords
    //         SectionID: courseSection.getId()
    //     });

    //     errors = record.validate();

    //     if (errors.length) {
    //         Ext.each(errors.items, function(item) {
    //             var itemField = form.down('[name='+item.field +']');

    //             if (itemField) {
    //                 itemField.markInvalid(item.message);
    //             }
    //         });
    //         return;
    //     }

    //     if (record.phantom && !Ext.util.Cookies.get('skipGoogleDocumentSharingConfirmation', '/')) {
    //         for (; i < record.get('Attachments').length; i++) {
    //             attachment = record.get('Attachments')[i];

    //             if (attachment.Class == 'Slate\\CBL\\Tasks\\Attachments\\GoogleDriveFile') {
    //                 showDocumentSharingWarning = true;
    //                 continue;
    //             }
    //         }
    //     }

    //     _saveRecord = function() {
    //         taskEditor.mask('Publishing&hellip;');
    //         record.save({
    //             success: function(rec) {
    //                 taskEditor.unmask();
    //                 taskEditor.close();

    //                 if (wasPhantom) {
    //                     me.getTasksStore().add(rec);
    //                 }
    //                 // reload studenttasks, as new records may exist
    //                 if (forceReload === true || wasPhantom) {
    //                     setTimeout(function() {
    //                         me.getStudentTasksStore().reload();
    //                         // reload record to ensure relationships are included.
    //                         // todo: remove this when API removes the need
    //                         rec.load();
    //                     }, 1000);
    //                 }
    //                 Ext.toast('Task succesfully saved!');
    //             },
    //             failure: function() {
    //                 Ext.Msg.alert('Error', 'There was an error while publishing. Please try again.');
    //                 taskEditor.unmask();
    //             }
    //         });
    //     };

    //     if (showDocumentSharingWarning === true) {
    //         confirmationWindow.show({
    //             message: 'Publishing this task will share the attached Google Documents with all assignees and course instructors. You <strong>must not<strong> delete or trash this document after publishing this task.',
    //             buttons: Ext.MessageBox.YESNO,
    //             callback: function(answer) {
    //                 if (answer == 'yes') {
    //                     _saveRecord();

    //                     if (confirmationWindow.down('checkboxfield').isChecked()) {
    //                         Ext.util.Cookies.set('skipGoogleDocumentSharingConfirmation', '/');
    //                     }
    //                 }
    //             }
    //         });
    //         return;
    //     }

    //     _saveRecord();
    // },

    // doConfirmTaskAssignees: function(task) {
    //     var me = this,
    //         assigneeIds = me.getAssignmentsField().getAssignees(false);

    //     Slate.API.request({
    //         url: task.toUrl() + '/assignees',
    //         callback: function(request, success, response) {
    //             var assigned = response.data.data,
    //                 unassigned = [],
    //                 i = 0,
    //                 message = 'Completing this action would result in un-assigning these students:';

    //             for (; i < assigned.length; i++) {
    //                 if (assigneeIds.indexOf(parseInt(assigned[i].ID, 10)) === -1) {
    //                     unassigned.push(assigned[i]);
    //                 }
    //             }

    //             if (unassigned.length) {
    //                 i = 0;
    //                 for (; i < unassigned.length; i++) {
    //                     message += '<br> ' + unassigned[i].FirstName + ' ' + unassigned[i].LastName;
    //                 }
    //                 message += '<br> Would you like to continue?';
    //                 Ext.Msg.confirm('Task Assignments', message, function(ans) {
    //                     if (ans === 'yes') {
    //                         me.doSaveTask(true);
    //                     }
    //                 });
    //                 return;
    //             }

    //             me.doSaveTask(true);
    //         }
    //     });
    // },

    // doEditStudentTask: function(studentTask) {
    //     var me = this,
    //         grid = me.getTasksGrid(),
    //         taskEditor = me.getTaskEditor(),
    //         task = grid.getRowsStore().getById(studentTask.get('TaskID'));

    //     if (!task || !studentTask) { // is this likely?
    //         Ext.Msg.error('Error', 'Unable to find task. Please refresh the page and try again.'); // is this optimal?
    //         return;
    //     }

    //     taskEditor.setTask(task);
    //     taskEditor.setStudentTask(studentTask);
    //     taskEditor.show();
    // },

    // doEditTask: function(taskRecord) {
    //     var me = this,
    //         taskEditor = me.getTaskEditor();

    //     if (!taskRecord) {
    //         taskRecord = me.getTaskModel().create();
    //     }

    //     taskEditor.setTask(taskRecord);
    //     taskEditor.setStudentTask(null);
    //     taskEditor.show();
    // },

    // doRateStudentTask: function(studentTask) {
    //     var me = this,
    //         taskRater = me.getTaskRater(),
    //         task = me.getTasksStore().getById(studentTask.get('TaskID')),
    //         readOnly = studentTask.get('TaskStatus') === 'completed',
    //         acceptTaskBtn;

    //     // handle failure
    //     if (!task) {
    //         // how can this fail?
    //         Ext.Msg.alert('Task not found. Please refresh.');
    //         return;
    //     }

    //     taskRater.setTask(task);
    //     taskRater.setStudentTask(studentTask);
    //     taskRater.setReadOnly(readOnly);

    //     if (readOnly) {
    //         acceptTaskBtn = me.getAcceptTaskBtn();
    //         acceptTaskBtn.setDisabled(false);
    //         acceptTaskBtn.setText('UnAccept Task');
    //     }

    //     taskRater.show();
    // },

    // doAssignStudentTask: function(taskId, studentId) {
    //     var me = this,
    //         taskAssigner = me.getTaskAssigner(),
    //         student = me.getStudentsStore().getById(studentId),
    //         task = me.getTasksStore().getById(taskId);

    //     if (!task) {
    //         // handle failure / how can this fail?
    //         Ext.Msg.alert('Task not found. Please refresh.');
    //         return;
    //     }

    //     taskAssigner.setStudent(student);
    //     taskAssigner.setTask(task);
    //     taskAssigner.show();
    // },

    // doCloneTask: function(taskRecord) {
    //     var me = this,
    //         taskCopy = taskRecord.copy(null),
    //         copiedAttachments = taskCopy.get('Attachments'),
    //         attachments = [],
    //         i = 0;


    //     for (; i < copiedAttachments.length; i++) {
    //         attachments.push(Ext.apply(copiedAttachments[i], {
    //             ID: null,
    //             ContextID: null,
    //             ContextClass: null
    //         }));
    //     }

    //     taskCopy.set({
    //         Title: taskCopy.get('Title') + ' Clone',
    //         Attachments: attachments
    //     });

    //     me.doEditTask(taskCopy);
    // }
});