/* global Slate *//* eslint new-cap: 0 */
/**
 * The Tasks controller manages the student task list and the task details pop-up.
 */
Ext.define('SlateTasksStudent.controller.Tasks', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.window.Toast',
        'Slate.cbl.util.Google'
    ],


    // dependencies
    views: [
        'TaskTree',
        'TaskDetails',
        'TaskFilters'
    ],

    stores: [
        'StudentTasks'
    ],


    // component references
    refs: {
        taskTree: {
            selector: 'slatetasksstudent-tasktree',
            autoCreate: true,

            xtype: 'slatetasksstudent-tasktree'
        },
        taskDetails: {
            selector: 'slate-taskdetails',
            autoCreate: true,

            xtype: 'slate-taskdetails'
        },
        filterMenu: 'button#filter menu',
        taskForm: 'slate-taskdetails slate-modalform',
        parentTaskField: 'slate-modalform field[name="ParentTaskTitle"]',
        ratingView: 'slate-modalform slate-ratingview',
        taskAttachmentsList: 'slate-modalform slate-attachmentslist#task-attachments',
        commentsField: 'slate-commentsfield',
        teacherAttachmentsField: 'slate-tasks-attachmentsfield#teacher-attachments',
        studentAttachmentsField: 'slate-tasks-attachmentsfield#student-attachments',
        // attachmentsTextField: 'slate-tasks-attachmentsfield textfield',
        // addLinkButton: 'slate-tasks-attachmentsfield button[action=addlink]',
        // addAttachmentButton: 'slate-tasks-attachmentsfield button[action=addattachment]',
        submitButton: 'slate-taskdetails button#submit',
        studentAttachmentsField: 'slate-tasks-attachmentsfield#student-attachments'
    },


    // entry points
    control: {
        'slatetasksstudent-tasktree': {
            itemclick: 'onTaskTreeItemClick',
            coursesectionchange: 'onTaskTreeCourseSectionChange'
        },
        submitButton: {
            click: 'onSubmitButtonClick'
        },
        studentAttachmentsField: {
            addgoogleattachment: 'onAddGoogleAttachmentClick'
        },
        'button#filter menucheckitem': {
            checkchange: 'onFilterItemCheckChange'
        },
        'button#filter button#view-all': {
            click: 'onFilterViewAllClick'
        }
    },

    listen: {
        store: {
            '#StudentTasks': {
                beforeload: 'onStudentTasksStoreBeforeLoad',
                load: 'onStudentTasksStoreLoad'
            }
        }
    },


    // event handlers
    onStudentTasksStoreBeforeLoad: function() {
        this.getTaskTree().mask('Loading Tasks');
    },

    onStudentTasksStoreLoad: function(store) {
        this.displayTaskData(store.getRange(), true);
    },

    onTaskTreeItemClick: function(id) {
        var me = this,
            rec = me.getStudentTasksStore().getById(id),
            details = me.getTaskDetails(),
            form = me.getTaskForm(),
            ratingView = me.getRatingView(),
            teacherAttachmentsField = me.getTeacherAttachmentsField(),
            studentAttachmentsField = me.getStudentAttachmentsField(),
            studentAttachmentList = studentAttachmentsField.down('slate-attachmentslist'),
            commentsField = me.getCommentsField(),
            submissions = rec.get('Submissions'),
            readonly = me.getTaskTree().getReadOnly() || rec.get('TaskStatus') === 'completed';

        form.getForm().loadRecord(rec);

        if (submissions && submissions.length && submissions.length > 0) {
            form.down('displayfield[name="Submitted"]').hide();
            form.down('displayfield[name="Submissions"]').show();
        } else {
            form.down('displayfield[name="Submitted"]').show();
            form.down('displayfield[name="Submissions"]').hide();
        }

        ratingView.setData({
            ratings: [1, 2, 3, 4, 'M'],
            competencies: rec.getTaskSkillsGroupedByCompetency()
        });

        me.getParentTaskField().setVisible(rec.get('ParentTaskID') !== null);
        teacherAttachmentsField.setAttachments(rec.getTeacherAttachments());
        teacherAttachmentsField.setReadOnly(true);
        commentsField.setRecord(rec);
        commentsField.setReadOnly(true);

        studentAttachmentsField.setAttachments(rec.getStudentAttachments());
        studentAttachmentsField.setReadOnly(readonly);

        studentAttachmentList.setConfig({
            editable: !readonly,
            shareMethodMutable: false
        });
        me.getSubmitButton().setDisabled(readonly);

        details.show();
    },

    onSubmitButtonClick: function() {
        var me = this,
            taskDetails = me.getTaskDetails(),
            form = me.getTaskForm(),
            attachmentsField = me.getStudentAttachmentsField(),
            attachments = attachmentsField.getAttachments(false),
            record = form.getRecord(),
            studentTaskAttachments = Ext.Array.filter(attachments, function(attachment) {
                if (attachment.ContextClass == 'Slate\\CBL\\Tasks\\Task') {
                    return false;
                }
                return true;
            });

        taskDetails.mask('Submitting&hellip;');
        Slate.API.request({
            url: Slate.API.buildUrl('/cbl/student-tasks/submit'),
            jsonData: {
                ID: record.get('ID'),
                Attachments: studentTaskAttachments
            },
            success: function() {
                Ext.toast('Task successfully submitted!');
                me.getStudentTasksStore().reload();
                me.getTaskDetails().close();
            },
            failure: function() {
                taskDetails.unmask();
                Ext.toast('Task could not be submitted.');
            }
        });
    },

    onFilterItemCheckChange: function() {
        var me = this,
            menu = me.getFilterMenu(),
            statusFilters = menu.query('menucheckitem[filterGroup=Status][checked]'),
            timelineFilters = menu.query('menucheckitem[filterGroup=Timeline][checked]'),
            store = me.getStudentTasksStore(),
            recs = store.getRange(),
            recLength = recs.length,
            i = 0,
            rec;

        for (; i < recLength; i++) {
            rec = recs[i];
            rec.set('filtered', me.filterRecord(rec, statusFilters) || me.filterRecord(rec, timelineFilters));
        }

        me.displayTaskData(store.getRange());

    },

    onFilterViewAllClick: function() {
        var me = this,
            menu = me.getFilterMenu(),
            checkedFilters = menu.query('menucheckitem[checked]'),
            checkedFiltersLength = checkedFilters.length,
            store = this.getStudentTasksStore(),
            recs = store.getRange(),
            recLength = recs.length,
            i = 0;

        for (; i < checkedFiltersLength; i++) {
            checkedFilters[i].setChecked(false, true);
        }

        for (i = 0; i < recLength; i++) {
            recs[i].set('filtered', false);
        }

        me.displayTaskData(store.getRange());
    },

    onTaskTreeCourseSectionChange: function(taskTree, courseSectionId) {
        var student = taskTree.getStudent(),
            params = {};

        if (courseSectionId) {
            params.course_section = courseSectionId;  // eslint-disable-line camelcase
        }

        if (student) {
            params.student = student;
        }

        this.getStudentTasksStore().load({
            params: params
        });
    },

    onAddGoogleAttachmentClick: function() {
        var me = this,
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
                then(Ext.bind(me.openFilePicker, me));
        } else {
            googleUtil.loadAPI().
                then(googleUtil.authenticateUser).
                then(Ext.bind(me.openFilePicker, me)).
                then(null, function(error) {
                    if (Ext.isObject(error)) {
                        if (error.error == 'popup_closed_by_user' || error.error == 'access_denied') {
                            return;
                        }

                        if (error.error == 'popup_blocked_by_browser') {
                            error = 'The sign-in popup was blocked by the browser. Please try again.';
                        }
                    }

                    if (!Ext.isString(error)) {
                        error = 'An error occured. Please try again.';
                    }

                    Ext.Msg.alert('Error', error);
                });
        }
    },

    openFilePicker: function() {
        var me = this,
            googleUtil = Slate.cbl.util.Google,
            taskDetails = me.getTaskDetails();

        taskDetails.hide(true);

        googleUtil.
            initFilePicker().
            setCallback(function(data) {
                var filePicked = data[google.picker.Response.ACTION] == google.picker.Action.PICKED,
                    fileData = filePicked && data[google.picker.Response.DOCUMENTS][0];

                if (data[google.picker.Response.ACTION] == 'loaded') {
                    return;
                } else if (data[google.picker.Response.ACTION] === google.picker.Action.CANCEL) {
                    googleUtil.setAuthenticatedUser(null);
                }

                taskDetails.show(true);

                if (fileData) {
                    googleUtil.
                        getGoogleFileOwnerEmail(fileData).
                        then(function(response) { // TODO: add to google util class?
                            var emailIsValid = googleUtil.verifyEmailAddress(response.result.emailAddress);

                            if (emailIsValid) {
                                return Ext.Promise.resolve({
                                    file: fileData,
                                    email: response.result.emailAddress
                                });
                            }

                            return new Ext.Promise(function(resolve) {
                                Ext.Msg.confirm('Clone File', 'This google drive file is currently owned by someone outside of the '+googleUtil.getGoogleAppsDomain() + ' domain. Would you like to clone this document instead?', function(answer) {
                                    if (answer === 'yes') {
                                        resolve(googleUtil.cloneGoogleFile(fileData));
                                    }
                                });
                            });
                        }).
                        then(null, function(response) {
                            return new Ext.Promise(function(resolve) {
                                if (response.result && response.result.error && response.result.error.code === 403) {
                                    Ext.Msg.confirm('Clone File', 'You must have write access to the file in order to share. Would you like to clone this document instead?', function(answer) {
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

    doAddGoogleFile: function(file, ownerEmail) {
        var me = this,
            attachmentsField = me.getStudentAttachmentsField(),
            fileId = file[google.picker.Document.ID];

        gapi.client.request({
            path: '/drive/v3/files/'+fileId+'/revisions/head',
            method: 'GET',
            params: {
                'access_token': Ext.util.Cookies.get('googleAppsToken', '/')
            }
        }).then(function(response) {
            var fileInfo = response.result;

            if (response.error) {
                Ext.Msg.alert('Error', 'Unable to lookup details about google document. Please try again, or contact an administrator.');
                return;
            }

            attachmentsField.setAttachments({
                Class: 'Slate\\CBL\\Tasks\\Attachments\\GoogleDriveFile',
                URL: file[google.picker.Document.URL],
                Title: file[google.picker.Document.NAME],
                FileRevisionID: fileInfo.id,
                File: {
                    DriveID: fileId,
                    OwnerEmail: ownerEmail
                }
            }, true);
        },
        function(response) { // revision id could not be found
            var error = response.result.error;

            if (Ext.isObject(error) && error.code === 404) {
                attachmentsField.setAttachments({
                    Class: 'Slate\\CBL\\Tasks\\Attachments\\GoogleDriveFile',
                    URL: file[google.picker.Document.URL],
                    Title: file[google.picker.Document.NAME],
                    File: {
                        DriveID: fileId,
                        OwnerEmail: ownerEmail
                    }
                }, true);
            }
        });
    },

    // custom controller methods
    displayTaskData: function(recs) {
        var me = this,
            tree = me.getTaskTree(),
            tasks;

        tasks = me.formatTaskData(recs);
        tree.setData({ tasks: tasks });
        tree.unmask();
    },

    formatTaskData: function(recs) {
        var me = this,
            parentRecs = me.getParentRecs(recs),
            parentRecsLength = parentRecs.length,
            parentRec,
            tasks = [],
            task,
            subTasks,
            i = 0;

        for (; i<parentRecsLength; i++) {
            parentRec = parentRecs[i];
            task = parentRec.getData();
            subTasks = me.getSubTasks(recs, task.TaskID);

            if (subTasks.length > 0) {
                task.subtasks = subTasks;
                parentRec.set('filtered', false); // do not filter parent tasks that have unfiltered subtasks
            }
            if (!parentRec.get('filtered')) {
                tasks.push(task);
            }
        }

        return tasks;
    },

    getParentRecs: function(recs) {
        var recsLength = recs.length,
            parentRecs = [],
            i = 0,
            rec;

        for (; i<recsLength; i++) {
            rec = recs[i];
            if (rec.get('ParentTaskID') === null) {
                parentRecs.push(rec);
            }
        }

        return parentRecs;
    },

    getSubTasks: function(recs, parentId) {
        var recsLength = recs.length,
            i = 0,
            subTasks = [],
            rec;

        for (; i<recsLength; i++) {
            rec = recs[i];
            if (rec.get('ParentTaskID') === parentId && !rec.get('filtered')) {
                rec.set('ParentTaskTitle', rec.get('Task').ParentTask.Title);
                subTasks.push(rec.getData());
            }
        }

        return subTasks;
    },

    /**
     * Passes a record through a group of filters.
     * @param {Ext.data.Model} rec- The record to be tested.
     * @param {Array} filterGroup - An array of objects with a filter function.
     * @returns {boolean} filtered - true if this rec should be filtered
     */
    filterRecord: function(rec, filterGroup) {
        var filterGroupLength = filterGroup.length,
            filtered = filterGroupLength !== 0,  // if no filters, return false
            i = 0;

        for (; i < filterGroupLength; i++) {
            filtered = filtered && filterGroup[i].filterFn(rec);
        }

        return filtered;
    }

});
