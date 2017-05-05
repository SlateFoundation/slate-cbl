/* jslint browser: true, undef: true, laxcomma:true *//* global Ext, Slate*/
/**
 * The Dashboard controller manages the main functionality of the SlateTasksTeacher application where teachers can
 * browse, search, create, edit, and assign tasks.
 *
 * ## Responsibilities
 * - Handle section/:sectionId route
 * - Handle CRUD operations for tasks/student tasks
 * - Filter StudentsGrid tasks/students by selected section
 */
Ext.define('SlateTasksTeacher.controller.Dashboard', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.window.Toast',
        'Ext.window.MessageBox',
        'Slate.cbl.util.Google'
    ],


    // dependencies
    views: [
        'Dashboard',
        'TaskEditor',
        'TaskRater',
        'TaskAssigner',
        'tasks.AttachmentConfirmation'
    ],
    stores: [
        'CourseSections',
        'Students',
        'StudentTasks',
        'Tasks'
    ],
    models: [
        'Task@Slate.cbl.model',
        'StudentTask@Slate.cbl.model',
        'Comment@Slate.cbl.model.tasks'
    ],


    refs: {
        dashboardCt: {
            selector: 'slate-tasks-teacher-dashboard',
            autoCreate: true,

            xtype: 'slate-tasks-teacher-dashboard'
        },
        tasksGrid: {
            selector: 'slate-studentsgrid',
            autoCreate: true,

            xtype: 'slate-studentsgrid'
        },
        taskAssigner: {
            selector: 'slate-tasks-teacher-taskassigner',
            autoCreate: true,

            xtype: 'slate-tasks-teacher-taskassigner'
        },
        taskRater: {
            selector: 'slate-tasks-teacher-taskrater',
            autoCreate: true,

            xtype: 'slate-tasks-teacher-taskrater'
        },
        taskEditor: {
            selector: 'slate-tasks-teacher-taskeditor',
            autoCreate: true,

            xtype: 'slate-tasks-teacher-taskeditor'
        },
        attachmentConfirmationWindow: {
            selector: 'slate-tasks-attachmentconfirmation',
            autoCreate: true,

            xtype: 'slate-tasks-attachmentconfirmation'
        },
        taskEditorForm: 'slate-tasks-teacher-taskeditor slate-modalform',
        skillsField: 'slate-tasks-teacher-taskeditor slate-skillsfield',
        commentsField: 'slate-tasks-teacher-taskrater slate-commentsfield',
        attachmentsField: 'slate-tasks-teacher-taskeditor slate-tasks-attachmentsfield',
        attachmentsList: 'slate-tasks-teacher-taskeditor slate-tasks-attachmentsfield slate-attachmentslist',
        assignmentsField: 'slate-tasks-teacher-taskeditor slate-tasks-assignmentsfield',
        assignmentsComboField: 'slate-tasks-teacher-taskeditor slate-tasks-assignmentsfield combo',

        courseSelector: 'slate-tasks-teacher-appheader combo',
        acceptTaskBtn: 'slate-tasks-teacher-taskrater button[action=accept]'
    },


    // entry points
    routes: {
        'section/:sectionId': {
            sectionId: '([a-zA-Z0-9])+',
            action: 'showCourseSection'
        }
    },

    control: {
        courseSelector: {
            select: 'onCourseSectionSelect'
        },
        dashboardCt: {
            coursesectionselect: 'onDashboardSectionChange'
        },
        tasksGrid: {
            cellclick: 'onTasksGridCellClick',
            subcellclick: 'onTasksGridCellClick',
            rowheaderclick: 'onTasksGridRowHeaderClick',
            subrowheaderclick: 'onTasksGridRowHeaderClick',
            beforeexpand: 'onBeforeRowHeaderToggle',
            beforecollapse: 'onBeforeRowHeaderToggle',
            columnheaderclick: 'onTasksGridColumnHeaderClick'
        },
        taskRater: {
            reassign: 'onReAssignStudentTaskClick'
        },
        assignmentsComboField: {
            render: 'onAssigneeComboRender'
        },
        commentsField: {
            publish: 'onCommentsFieldPublish'
        },

        acceptTaskBtn: {
            click: 'onAcceptTaskClick'
        },

        attachmentsList: {
            sharemethodchange: 'onGoogleFileShareMethodChange'
        },

        'slate-tasks-teacher-taskrater button[action=reassign]': {
            click: 'onAssignRevisionClick'
        },
        'slate-tasks-teacher-taskrater button[action=unassign]': {
            click: 'onUnassignStudentTaskClick'
        },
        'slate-tasks-teacher-taskrater button[action=edit]': {
            click: 'onEditStudentTaskClick'
        },
        'slate-tasks-teacher-taskrater slate-ratingview': {
            rateskill: 'onRateSkillClick'
        },
        'slate-tasks-teacher-taskassigner button[action=assign]': {
            click: 'onAssignTaskClick'
        },
        'slate-tasks-teacher-taskeditor button[action=save]': {
            click: 'onSaveTaskClick'
        },
        'slate-tasks-teacher-appheader button[action=create]': {
            click: 'onCreateTaskClick'
        },
        'slate-tasks-teacher-taskeditor slate-tasks-titlefield[clonable]': {
            select: 'onClonableTitleFieldSelect'
        },
        'slate-tasks-teacher-taskeditor slate-tasks-attachmentsfield': {
            addgoogleattachment: 'onAddGoogleAttachmentClick'
        }
    },


    // controller templates method overrides
    onLaunch: function () {
        this.getDashboardCt().render('slateapp-viewport');
    },

    // route handlers
    showCourseSection: function(sectionCode) {
        var me = this,
            courseSelector = me.getCourseSelector(),
            courseSectionsStore = courseSelector.getStore(),
            studentsStore = me.getStudentsStore(),
            tasksStore = me.getTasksStore(),
            studentTasksStore = me.getStudentTasksStore(),
            courseSection = courseSectionsStore.findRecord('Code', sectionCode);

        // select section
        if (!courseSection && courseSectionsStore.isLoaded()) {
            Ext.Msg.alert('Error', 'Course Section not found.');
            return;
        } else if (!courseSectionsStore.isLoaded()) {
            courseSectionsStore.load(function() {
                me.showCourseSection(sectionCode);
            });
            return;
        }
        if (!me.getDashboardCt().getCourseSection() || me.getDashboardCt().getCourseSection().getId() != sectionCode) {
            me.getDashboardCt().setCourseSection(courseSection);
        }
        courseSelector.setValue(courseSectionsStore.findRecord('Code', sectionCode));

        // update store urls
        studentsStore.setCourseSection(sectionCode).load();
        tasksStore.setCourseSection(sectionCode).load();
        studentTasksStore.setCourseSection(sectionCode).load();
    },

    // event handlers
    onCourseSectionSelect: function(combo, record) {
        var me = this;

        me.getDashboardCt().setCourseSection(record);
    },

    onDashboardSectionChange: function(dashboardView, record) {
        this.redirectTo('section/'+record.get('Code'));
    },

    onTasksGridCellClick: function(grid, taskId, studentId) {
        var me = this,
            dataStore = grid.getDataStore(),
            studentTask = dataStore.getAt(dataStore.findBy(function(r) {
                return r.get('TaskID') == taskId && r.get('StudentID') == studentId;
            }));

        if (studentTask) {
            return me.doRateStudentTask(studentTask);
        }

        return me.doAssignStudentTask(taskId, studentId);
    },

    onReAssignStudentTaskClick: function(taskRater, dateField, date) {
        var studentTask = taskRater.getStudentTask();

        studentTask.set({
            DueDate: date,
            TaskStatus: 're-assigned'
        });

        studentTask.save({
            success: function(rec) {
                taskRater.close();
                Ext.toast('Student task successfully reassigned.');
            }
        });
    },

    onTasksGridRowHeaderClick: function(grid, rowId, el, ev) {
        var me = this,
            task;

        if (ev.getTarget('.jarvus-aggregrid-rowheader .edit-row')) {
            task = me.getTasksStore().getById(rowId);

            me.doEditTask(task);
        }

        return;
    },

    onTasksGridColumnHeaderClick: function(grid, columnId, el, ev) {
        var me = this,
            courseSection,
            student;

        if (ev.getTarget('.jarvus-aggregrid-colheader')) {
            student = me.getStudentsStore().getById(columnId);
            courseSection = me.getDashboardCt().getCourseSection();

            window.open(Slate.API.buildUrl('/cbl/dashboards/tasks/student')+'?student='+student.get('Username')+'&course_section='+courseSection.get('Code'), '_blank');
        }
    },

    onBeforeRowHeaderToggle: function(grid, rowId, el, ev) {
        if (ev.getTarget('.jarvus-aggregrid-rowheader .edit-row')) {
            return false;
        }
        return null;
    },

    onAssigneeComboRender: function(combo) {
        var me = this,
            comboStore = combo.getStore(),
            studentsStore = me.getStudentsStore();

        comboStore.removeAll();
        comboStore.add(studentsStore.getRange());
        combo.setValueOnData();
    },

    onCommentsFieldPublish: function(fieldContainer, field) {
        var me = this,
            record = fieldContainer.getRecord(),
            comment,
            originalComments = record.get('Comments') || [];

        comment = me.getCommentModel().create({
            Message: field.getValue(),
            ContextID: record.getId(),
            ContextClass: record.get('Class')
        });

        comment.save({
            success: function(rec) {
                originalComments.push(rec.getData({ serialize: true }));
                record.set('Comments', originalComments);
                fieldContainer.updateRecord(record);
                field.setValue('');
            }
        });
    },

    onAcceptTaskClick: function() {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = taskRater.getStudentTask(),
            status = studentTask.get('TaskStatus') === 'completed' ? 're-assigned' : 'completed';

        studentTask.set('TaskStatus', status);

        me.doSaveStudentTask(studentTask, function(rec, request, success) {
            if (success) {
                taskRater.close();
                me.getStudentTasksStore().load({
                    id: studentTask.getId(),
                    addRecords: true
                });

                if (status === 're-assigned') {
                    me.doRateStudentTask(rec);
                }
            }
        });
    },

    onAssignRevisionClick: function(btn) {
        var me = this,
            coords = btn.getXY(),
            datepicker;

        if (btn.dateSelected) {
            me.doAssignStudentTaskRevision(btn.dateSelected);
        } else {
            datepicker = Ext.widget({
                xtype: 'datepicker',
                floating: true,
                handler: function(picker, date) {
                    picker.destroy();
                    btn.dateSelected = date;
                    return btn.setText('Re-Assign revision due on '+Ext.Date.format(date, 'm/d/y'));
                }
            });
            datepicker.show().showAt(coords[0], coords[1] - datepicker.getHeight()); // subtract datepicker height from y coord to show above button.
        }
    },

    onUnassignStudentTaskClick: function() {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = taskRater.getStudentTask();

        Ext.Msg.confirm('Are you sure?', 'Do you want to unassign this student task? This can not be undone.', function(ans) {
            if (ans === 'yes') {
                me.doUnAssignStudentTask(studentTask);
            }
        });

    },

    onEditStudentTaskClick: function() {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = taskRater.getStudentTask();

        taskRater.close();
        me.doEditStudentTask(studentTask);
    },

    onRateSkillClick: function(ratingView, ratingObject) {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = taskRater.getStudentTask();

        Slate.API.request({
            url: studentTask.toUrl() + '/rate',
            method: 'POST',
            params: {
                SkillID: ratingObject.SkillID,
                Score: ratingObject.rating
            },
            callback: function(opts, success, response) {
                // var record = response.data.record;

                if (success) {
                    me.getStudentTasksStore().load({
                        id: studentTask.getId(),
                        addRecords: true
                    });
                    // studentTask.set(record);
                } else {
                    Ext.toast('Error. Please try again.');
                }
            }
        });
    },

    onAssignTaskClick: function() {
        var me = this,
            taskAssigner = me.getTaskAssigner(),
            taskAssignerValues = taskAssigner.down('slate-modalform').getValues(),
            task = taskAssigner.getTask(),
            student = taskAssigner.getStudent(),
            studentTask = me.getStudentTaskModel().create({
                TaskID: task.getId(),
                Task: task.getData(),
                StudentID: student.getId(),
                Student: student.getData(),
                DueDate: taskAssignerValues.DueDate,
                ExpirationDate: taskAssignerValues.ExpirationDate,
                ExperienceType: taskAssignerValues.ExperienceType,
                SectionID: me.getCourseSelector().getSelection().getId()
            });

        me.doSaveStudentTask(studentTask, function(rec, request, success) {
            if (success) {
                taskAssigner.close();
                me.getStudentTasksStore().load({
                    id: studentTask.getId(),
                    addRecords: true
                });
                Ext.toast(student.getFullName() + ' was assigned task: ' + task.get('Title'));
            }
        });

    },

    onSaveTaskClick: function() {
        var me = this,
            taskEditor = me.getTaskEditor(),
            task = taskEditor.getTask(),
            studentTask = taskEditor.getStudentTask();

        if (studentTask) {
            me.getTaskEditorForm().updateRecord(studentTask);
            studentTask.set('SkillIDs', me.getSkillsField().getSkills(false, true)); // returnRecords, idsOnly
            return me.doSaveStudentTask(studentTask, function(rec, request, success) {
                if (success) {
                    me.getStudentTasksStore().load({
                        id: studentTask.getId(),
                        addRecords: true
                    });
                    taskEditor.close();
                    Ext.toast('Student task successfully updated.');
                }
            });
        }

        if (!task.phantom && task.getAssigneeIds().length) {
            return me.doConfirmTaskAssignees(task);
        }

        return me.doSaveTask();

    },

    onCreateTaskClick: function() {
        var me = this;

        me.getTaskEditor().close();
        return me.doEditTask();
    },

    onClonableTitleFieldSelect: function(combo) {
        var me = this,
            record = combo.getSelectedRecord(),
            title = 'New Task',
            message = 'Do you want to clone this task?<br><strong>' + record.get('Title') + '</strong>';

        Ext.Msg.confirm(title, message, function(btnId) {
            if (btnId === 'yes') {
                me.doCloneTask(record);
            }
        });
    },

    onGoogleFileShareMethodChange: function(list, record, radio, selected) {
        var me = this,
            shareMethod = radio.inputValue;

        if (selected === false) {
            return false;
        }

        record.set('ShareMethod', shareMethod);

        if (shareMethod === 'collaborate') {
            return Slate.cbl.util.Google.getUserFilePermissions(record.get('File').DriveID).
                then(function(role) {
                    var errorMessage;

                    if (!role) {
                        errorMessage = 'Unable to collaborate with this file. <br>You can either:<ul><li>Duplicate this file into your drive</li>Request write access from the file owner.<li>b</li></ul>';
                        Ext.Msg.alert('Unable to collaborate', errorMessage);
                    }

                });
        }

        return false;
    },

    onAddGoogleAttachmentClick: function() {
        var me = this,
            taskEditor = me.getTaskEditor(),
            googleUtil = Slate.cbl.util.Google;

        if (googleUtil.getToken()) {
            googleUtil.loadAPI().
                then(function() {
                    return gapi.client.request({
                        path: '/drive/v3/about',
                        params: {
                            fields: 'user',
                            'access_token': googleUtil.getToken()
                        }
                    });
                }).
                then(function(response) {
                    Ext.Promise.resolve(googleUtil.setAuthenticatedUser(response.result.user));
                }, googleUtil.authenticateUser).
                then(Ext.bind(me.openFilePicker, me)).
                then(null, function(error) {
                    Ext.Msg.alert('Error', error);
                });
        } else {
            googleUtil.loadAPI().
                then(googleUtil.authenticateUser).
                then(Ext.bind(me.openFilePicker, me)).
                then(null, function(error) {
                    Ext.Msg.alert('Error', error);
                });
        }
    },

    onGoogleAuthentication: function(authResult) {
        var me = this,
            googleAppsDomain = SiteEnvironment && SiteEnvironment.googleAppsDomain || location.host,
            googleAppsEmailRegex = new RegExp('^.+\@'+googleAppsDomain+'$'),
            tokenExpiration,
            _verifyUserIsWithinDomain, _userIsNotWithinDomain;

        console.info('handleAuthResult(%o)', authResult);

        if (!authResult || authResult.error) {
            Ext.Msg.alert('Error', 'Unable to authenticate user. Please try again or contact an administrator.');
            return;
        }

        _userIsNotWithinDomain = function(errorMessage) {
            Ext.Msg.alert('Error', errorMessage);
            return;
        };

        _verifyUserIsWithinDomain = function(response) {
            console.info('loaded user', response.result);

            if (!response.result || !response.result.user || !response.result.user.emailAddress.match(googleAppsEmailRegex)) {
                return _userIsNotWithinDomain('Account must be under the correct domain. ' + googleAppsDomain);
                // return false;
            }

            tokenExpiration = new Date(authResult.expires_at * 1000);

            Ext.util.Cookies.set('googleAppsToken', authResult.access_token, tokenExpiration, '/');

            me.doOpenFilePicker(authResult.access_token);
        };

        // confirm authentication is within google apps domain
        gapi.client.request({
            path: '/drive/v3/about',
            params: {
                fields: 'user'
            }
        }).
        then(_verifyUserIsWithinDomain);
    },

    doAddGoogleFile: function(file, ownerEmail) {
        var me = this,
            attachmentsField = me.getAttachmentsField(),
            fileId = file[google.picker.Document.ID];

        gapi.client.request({
            path: '/drive/v3/files/'+fileId+'/revisions/head',
            method: 'GET',
            params: {
                'access_token': Ext.util.Cookies.get('googleAppsToken', '/')
            }
        }).then(function(response) {
            var latestRevision = response.result;

            if (response.error) {
                Ext.Msg.alert('Error', 'Unable to lookup details about google document. Please try again, or contact an administrator.');
                return;
            }

            attachmentsField.setAttachments({
                Class: 'Slate\\CBL\\Tasks\\Attachments\\GoogleDriveFile',
                URL: file[google.picker.Document.URL],
                Title: file[google.picker.Document.NAME],
                FileRevisionID: latestRevision.id,
                File: {
                    DriveID: fileId,
                    OwnerEmail: ownerEmail
                }
            }, true);
        });
    },

    openFilePicker: function() {
        var me = this,
            googleUtil = Slate.cbl.util.Google,
            taskEditor = me.getTaskEditor();

        taskEditor.hide(true);

        googleUtil.
            initFilePicker().
            setCallback(function(data) {
                var showTaskEditor = [
                        google.picker.Action.CANCEL,
                        google.picker.Action.PICKED
                    ].indexOf(data[google.picker.Response.ACTION]) > -1,

                    filePicked = data[google.picker.Response.ACTION] == google.picker.Action.PICKED,
                    fileData = filePicked && data[google.picker.Response.DOCUMENTS][0];

                if (data[google.picker.Response.ACTION] == 'loaded') {
                    return;
                } else if (data[google.picker.Response.ACTION] === google.picker.Action.CANCEL) {
                    googleUtil.setAuthenticatedUser(null);
                }

                if (showTaskEditor) {
                    taskEditor.show();
                }

                if (fileData) {
                    googleUtil.
                        getGoogleFileOwnerEmail(fileData).
                        then(function(response) {
                            var emailIsValid = googleUtil.verifyEmailAddress(response.result.emailAddress);

                            if (emailIsValid) {
                                return Ext.Promise.resolve({
                                    file: fileData,
                                    email: response.result.emailAddress
                                });
                            }

                            return new Ext.Promise(function(resolve) {
                                Ext.Msg.confirm('Clone File', 'This google drive file is currently owned by someone outside of the '+googleUtil.getGoogleAppsDomain() + ' domain. Would you like to clone this file instead?', function(answer) {
                                    if (answer === 'yes') {
                                        resolve(googleUtil.cloneGoogleFile(fileData));
                                    }
                                });
                            });
                        }).
                        then(null, function(response) {
                            return new Ext.Promise(function(resolve) {
                                if (response.result && response.result.error && response.result.error.code === 403) {
                                    Ext.Msg.confirm('Clone File', 'You must have write access to the file in order to share. Would you like to clone this file instead?', function(answer) {
                                        if (answer === 'yes') {
                                            resolve(googleUtil.cloneGoogleFile(fileData));
                                        }
                                    });
                                }
                            });
                        }).
                        then(function(response) {
                            me.doAddGoogleFile(response.file, response.email);
                        });
                }
            }).
            build().
            setVisible(true);
    },

    doAssignStudentTaskRevision: function(date) {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = taskRater.getStudentTask();

        studentTask.set('DueDate', date.getTime()/1000);
        studentTask.set('TaskStatus', 're-assigned');
        studentTask.save({
            callback: function() {
                taskRater.close();
                Ext.toast('Student task successfully updated.');
                me.doRateStudentTask(studentTask);
            }
        });
    },

    doUnAssignStudentTask: function(studentTask) {
        var me = this;

        studentTask.erase({
            callback: function(opts, success) {
                if (success) {
                    Ext.toast('Student task unassigned.');
                    me.getTaskRater().close();
                }
            }
        });
    },

    doSaveStudentTask: function(studentTask, callback, scope) {
        studentTask.save({
            callback: function(record, request, success) {
                var message = [],
                    response = request.getResponse().data,
                    validationErrors, key;

                if (!success) {
                    message.push(
                        '<p>',
                        'Unable to save task.',
                        '</p>'
                    );

                    if (response.failed && response.failed.length) {
                        validationErrors = response.failed[0].validationErrors;

                        for (key in validationErrors) {
                            if (validationErrors.hasOwnProperty(key)) {
                                message.push(
                                    '<p>',
                                    validationErrors[key],
                                    '</p>'
                                );
                            }
                        }
                        record.reject();
                        Ext.Msg.alert('Error', message.join(' '));
                    }
                }
                Ext.callback(callback, scope, arguments);
            }
        });
    },

    doSaveTask: function(forceReload) {
        var me = this,
            form = me.getTaskEditorForm(),
            skillsField = me.getSkillsField(),
            attachmentsField = me.getAttachmentsField(),
            assignmentsField = me.getAssignmentsField(),
            courseSection = me.getCourseSelector().getSelection(),
            record = form.updateRecord().getRecord(),
            wasPhantom = record.phantom,
            currentAssignees = assignmentsField.getAssignees(false),
            errors,
            showDocumentSharingWarning = false,
            attachment, i = 0,
            confirmationWindow = me.getAttachmentConfirmationWindow(),
            _saveRecord;

        record.set({
            Skills: skillsField.getSkills(false), // returnRecords
            Attachments: attachmentsField.getAttachments(false), // returnRecords
            Assignees: currentAssignees, // returnRecords
            SectionID: courseSection.getId()
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

        if (record.phantom && !Ext.util.Cookies.get('skipGoogleDocumentSharingConfirmation', '/')) {
            for (; i < record.get('Attachments').length; i++) {
                attachment = record.get('Attachments')[i];

                if (attachment.Class == 'Slate\\CBL\\Tasks\\Attachments\\GoogleDriveFile') {
                    showDocumentSharingWarning = true;
                    continue;
                }
            }
        }

        _saveRecord = function() {
            record.save({
                success: function(rec) {
                    me.getTaskEditor().close();

                    if (wasPhantom) {
                        me.getTasksStore().add(rec);
                    }
                    // reload studenttasks, as new records may exist
                    if (forceReload === true || wasPhantom) {
                        setTimeout(function() {
                            me.getStudentTasksStore().reload();
                            // reload record to ensure relationships are included.
                            // todo: remove this when API removes the need
                            rec.load();
                        }, 1000);
                    }
                    Ext.toast('Task succesfully saved!');
                }
            });
        };

        if (showDocumentSharingWarning === true) {
            confirmationWindow.show({
                message: 'Publishing this task will share the attached Google Documents with all assignees and course instructors. You <strong>must not<strong> delete or trash this document after publishing this task.',
                buttons: Ext.MessageBox.YESNO,
                callback: function(answer) {
                    if (answer == 'yes') {
                        _saveRecord();

                        if (confirmationWindow.down('checkboxfield').isChecked()) {
                            Ext.util.Cookies.set('skipGoogleDocumentSharingConfirmation', '/');
                        }
                    }
                }
            });
            return;
        }

        _saveRecord();
    },

    doConfirmTaskAssignees: function(task) {
        var me = this,
            assigneeIds = me.getAssignmentsField().getAssignees(false);

        Slate.API.request({
            url: task.toUrl() + '/assignees',
            callback: function(request, success, response) {
                var assigned = response.data.data,
                    unassigned = [],
                    i = 0,
                    message = 'Completing this action would result in un-assigning these students:';

                for (; i < assigned.length; i++) {
                    if (assigneeIds.indexOf(parseInt(assigned[i].ID, 10)) === -1) {
                        unassigned.push(assigned[i]);
                    }
                }

                if (unassigned.length) {
                    i = 0;
                    for (; i < unassigned.length; i++) {
                        message += '<br> ' + unassigned[i].FirstName + ' ' + unassigned[i].LastName;
                    }
                    message += '<br> Would you like to continue?';
                    Ext.Msg.confirm('Task Assignments', message, function(ans) {
                        if (ans === 'yes') {
                            me.doSaveTask(true);
                        }
                    });
                    return;
                }

                me.doSaveTask(true);
            }
        });
    },

    doEditStudentTask: function(studentTask) {
        var me = this,
            grid = me.getTasksGrid(),
            taskEditor = me.getTaskEditor(),
            task = grid.getRowsStore().getById(studentTask.get('TaskID'));

        if (!task || !studentTask) { // is this likely?
            Ext.Msg.error('Error', 'Unable to find task. Please refresh the page and try again.'); // is this optimal?
            return;
        }

        taskEditor.setTask(task);
        taskEditor.setStudentTask(studentTask);
        taskEditor.show();
    },

    doEditTask: function(taskRecord) {
        var me = this,
            taskEditor = me.getTaskEditor();

        if (!taskRecord) {
            taskRecord = me.getTaskModel().create();
        }

        taskEditor.setTask(taskRecord);
        taskEditor.setStudentTask(null);
        taskEditor.show();
    },

    doRateStudentTask: function(studentTask) {
        var me = this,
            taskRater = me.getTaskRater(),
            task = me.getTasksStore().getById(studentTask.get('TaskID')),
            readOnly = studentTask.get('TaskStatus') === 'completed',
            acceptTaskBtn;

        // handle failure
        if (!task) {
            // how can this fail?
            Ext.Msg.alert('Task not found. Please refresh.');
            return;
        }

        taskRater.setTask(task);
        taskRater.setStudentTask(studentTask);
        taskRater.setReadOnly(readOnly);

        if (readOnly) {
            acceptTaskBtn = me.getAcceptTaskBtn();
            acceptTaskBtn.setDisabled(false);
            acceptTaskBtn.setText('UnAccept Task');
        }

        taskRater.show();
    },

    doAssignStudentTask: function(taskId, studentId) {
        var me = this,
            taskAssigner = me.getTaskAssigner(),
            student = me.getStudentsStore().getById(studentId),
            task = me.getTasksStore().getById(taskId);

        if (!task) {
            // handle failure / how can this fail?
            Ext.Msg.alert('Task not found. Please refresh.');
            return;
        }

        taskAssigner.setStudent(student);
        taskAssigner.setTask(task);
        taskAssigner.show();
    },

    doCloneTask: function(taskRecord) {
        var me = this,
            taskCopy = taskRecord.copy(null),
            copiedAttachments = taskCopy.get('Attachments'),
            attachments = [],
            i = 0;


        for (; i < copiedAttachments.length; i++) {
            attachments.push(Ext.apply(copiedAttachments[i], {
                ID: null,
                ContextID: null,
                ContextClass: null
            }));
        }

        taskCopy.set({
            Title: taskCopy.get('Title') + ' Clone',
            Attachments: attachments
        });

        me.doEditTask(taskCopy);
    }
});
