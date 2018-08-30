/* global google, gapi */
/**
 * The Tasks controller manages the student task list and the task details pop-up.
 */
Ext.define('SlateTasksStudent.controller.Tasks', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.window.Toast',

        /* global Slate */
        'Slate.API',
        'Slate.cbl.util.Google'
    ],


    studentTaskInclude: [
        'availableActions',
        'Attachments',
        'Demonstration.DemonstrationSkills',
        'Skills'
    ],


    // dependencies
    views: [
        'Window@Slate.ui',
        'StudentTaskForm@Slate.cbl.view.tasks'
    ],

    stores: [
        'Tasks'
    ],

    models: [
        'StudentTask@Slate.cbl.model.tasks',
    //     'Comment@Slate.cbl.model.tasks'
    ],


    // component references
    refs: {
        dashboardCt: 'slate-tasks-student-dashboard',

        taskTree: 'slate-tasks-student-tasktree',
        filterMenu: 'slate-tasks-student-tasktree slate-tasks-student-taskfiltersmenu',

        taskWindow: {
            autoCreate: true,

            xtype: 'slate-window',
            closeAction: 'hide',
            modal: true,
            layout: 'fit',
            minWidth: 300,
            width: 600,
            minHeight: 200,

            mainView: {
                xtype: 'slate-cbl-tasks-studenttaskform'
            }
        },
        formPanel: 'slate-cbl-tasks-studenttaskform',
        // clonedTaskField: 'slate-cbl-tasks-taskform field[name=ClonedTaskID]',
        // statusField: 'slate-cbl-tasks-taskform ^ window field[name=Status]',
        submitBtn: 'slate-cbl-tasks-studenttaskform ^ window button[action=submit]'

        // parentTaskField: 'slate-modalform field[name="ParentTaskTitle"]',
        // ratingView: 'slate-modalform slate-ratingview',
        // taskAttachmentsList: 'slate-modalform slate-attachmentslist#task-attachments',
        // commentsField: 'slate-commentsfield',
        // teacherAttachmentsField: 'slate-tasks-attachmentsfield#teacher-attachments',
        // studentAttachmentsField: 'slate-tasks-attachmentsfield#student-attachments',
        // attachmentsTextField: 'slate-tasks-attachmentsfield textfield',
        // addLinkButton: 'slate-tasks-attachmentsfield button[action=addlink]',
        // addAttachmentButton: 'slate-tasks-attachmentsfield button[action=addattachment]',

        // taskDetails: {
        //     selector: 'slate-tasks-student-taskdetails',
        //     autoCreate: true,

        //     xtype: 'slate-tasks-student-taskdetails'
        // },
        // taskForm: 'slate-tasks-student-taskdetails slate-modalform',
        // submitButton: 'slate-tasks-student-taskdetails button#submit'
    },


    // entry points
    control: {
        dashboardCt: {
            studentchange: 'onStudentChange',
            sectionchange: 'onSectionChange'
        },
        'slate-tasks-student-tasktree': {
            itemclick: 'onTaskTreeItemClick'
        },
        'slate-tasks-student-taskfiltersmenu menucheckitem': {
            checkchange: 'onFilterItemCheckChange'
        },
        'slate-tasks-student-taskfiltersmenu button#view-all': {
            click: 'onFilterViewAllClick'
        }
        // submitButton: {
        //     click: 'onSubmitButtonClick'
        // },
        // studentAttachmentsField: {
        //     addgoogleattachment: 'onAddGoogleAttachmentClick'
        // },
    },


    // event handlers
    onStudentChange: function(dashboardCt, studentUsername) {
        var tasksStore = this.getTasksStore();

        tasksStore.setStudent(studentUsername || '*current');
        tasksStore.loadIfDirty();
    },

    onSectionChange: function(dashboardCt, sectionCode) {
        var tasksStore = this.getTasksStore();

        tasksStore.setSection(sectionCode);
        tasksStore.loadIfDirty();
    },

    onTaskTreeItemClick: function(tasksTree, studentTask, itemEl) {
        this.openTaskWindow(studentTask, { animateTarget: itemEl });
    },

    // TODO: audit and optimize
    // TODO: use store filters?
    onFilterItemCheckChange: function() {
        var me = this,
            menu = me.getFilterMenu(),
            statusFilters = menu.query('menucheckitem[filterGroup=Status][checked]'),
            timelineFilters = menu.query('menucheckitem[filterGroup=Timeline][checked]'),
            store = me.getTasksStore(),
            recs = store.getRange(),
            recLength = recs.length,
            i = 0,
            rec;

        for (; i < recLength; i++) {
            rec = recs[i];
            rec.set('filtered', me.filterRecord(rec, statusFilters) || me.filterRecord(rec, timelineFilters));
        }

        me.getTaskTree().refresh();
    },

    // TODO: audit and optimize
    onFilterViewAllClick: function() {
        var me = this,
            menu = me.getFilterMenu(),
            checkedFilters = menu.query('menucheckitem[checked]'),
            checkedFiltersLength = checkedFilters.length,
            store = this.getTasksStore(),
            recs = store.getRange(),
            recLength = recs.length,
            i = 0;

        for (; i < checkedFiltersLength; i++) {
            checkedFilters[i].setChecked(false, true);
        }

        for (i = 0; i < recLength; i++) {
            recs[i].set('filtered', false);
        }

        me.getTaskTree().refresh();
    },

    // TODO: audit and optimize
    // onSubmitButtonClick: function() {
    //     var me = this,
    //         taskDetails = me.getTaskDetails(),
    //         form = me.getTaskForm(),
    //         attachmentsField = me.getStudentAttachmentsField(),
    //         attachments = attachmentsField.getAttachments(false),
    //         record = form.getRecord(),
    //         studentTaskAttachments = Ext.Array.filter(attachments, function(attachment) {
    //             if (attachment.ContextClass == 'Slate\\CBL\\Tasks\\Task') {
    //                 return false;
    //             }
    //             return true;
    //         });

    //     taskDetails.setLoading('Submitting&hellip;');
    //     Slate.API.request({
    //         url: '/cbl/student-tasks/submit',
    //         jsonData: {
    //             ID: record.get('ID'),
    //             Attachments: studentTaskAttachments
    //         },
    //         success: function() {
    //             Ext.toast('Task successfully submitted!');
    //             me.getTasksStore().reload();
    //             taskDetails.close();
    //         },
    //         failure: function() {
    //             taskDetails.setLoading(false);
    //             Ext.toast('Task could not be submitted.');
    //         }
    //     });
    // },

    // TODO: audit and optimize
    // onAddGoogleAttachmentClick: function() {
    //     var me = this,
    //         googleUtil = Slate.cbl.util.Google;

    //     if (googleUtil.getToken()) {
    //         googleUtil.loadAPI().
    //             then(function() {
    //                 return gapi.client.request({
    //                     path: '/drive/v3/about',
    //                     params: {
    //                         fields: 'user',
    //                         'access_token': googleUtil.getToken()
    //                     }
    //                 });
    //             }).
    //             then(function(response) {
    //                 Ext.Promise.resolve(googleUtil.setAuthenticatedUser(response.result.user));
    //             }, googleUtil.authenticateUser).
    //             then(Ext.bind(me.openFilePicker, me));
    //     } else {
    //         googleUtil.loadAPI().
    //             then(googleUtil.authenticateUser).
    //             then(Ext.bind(me.openFilePicker, me)).
    //             then(null, function(error) {
    //                 if (Ext.isObject(error)) {
    //                     if (error.error == 'popup_closed_by_user' || error.error == 'access_denied') {
    //                         return;
    //                     }

    //                     if (error.error == 'popup_blocked_by_browser') {
    //                         error = 'The sign-in popup was blocked by the browser. Please try again.';
    //                     }
    //                 }

    //                 if (!Ext.isString(error)) {
    //                     error = 'An error occured. Please try again.';
    //                 }

    //                 Ext.Msg.alert('Error', error);
    //             });
    //     }
    // },

    // TODO: audit and optimize
    // openFilePicker: function() {
    //     var me = this,
    //         googleUtil = Slate.cbl.util.Google,
    //         taskDetails = me.getTaskDetails();

    //     taskDetails.hide(true);

    //     googleUtil.
    //         initFilePicker().
    //         setCallback(function(data) {
    //             var filePicked = data[google.picker.Response.ACTION] == google.picker.Action.PICKED,
    //                 fileData = filePicked && data[google.picker.Response.DOCUMENTS][0];

    //             if (data[google.picker.Response.ACTION] == 'loaded') {
    //                 return;
    //             } else if (data[google.picker.Response.ACTION] === google.picker.Action.CANCEL) {
    //                 googleUtil.setAuthenticatedUser(null);
    //             }

    //             taskDetails.show(true);

    //             if (fileData) {
    //                 googleUtil.
    //                     getGoogleFileOwnerEmail(fileData).
    //                     then(function(response) { // TODO: add to google util class?
    //                         var emailIsValid = googleUtil.verifyEmailAddress(response.result.emailAddress);

    //                         if (emailIsValid) {
    //                             return Ext.Promise.resolve({
    //                                 file: fileData,
    //                                 email: response.result.emailAddress
    //                             });
    //                         }

    //                         return new Ext.Promise(function(resolve) {
    //                             Ext.Msg.confirm('Clone File', 'This google drive file is currently owned by someone outside of the '+googleUtil.getDomain() + ' domain. Would you like to clone this document instead?', function(answer) {
    //                                 if (answer === 'yes') {
    //                                     resolve(googleUtil.cloneGoogleFile(fileData));
    //                                 }
    //                             });
    //                         });
    //                     }).
    //                     then(null, function(response) {
    //                         return new Ext.Promise(function(resolve) {
    //                             if (response.result && response.result.error && response.result.error.code === 403) {
    //                                 Ext.Msg.confirm('Clone File', 'You must have write access to the file in order to share. Would you like to clone this document instead?', function(answer) {
    //                                     if (answer === 'yes') {
    //                                         resolve(googleUtil.cloneGoogleFile(fileData));
    //                                     }
    //                                 });
    //                             }
    //                         });
    //                     }).
    //                     then(function(response) {
    //                         me.doAddGoogleFile(response.file, response.email);
    //                     });
    //             }
    //         }).
    //         build().
    //         setVisible(true);
    // },

    // TODO: audit and optimize
    // doAddGoogleFile: function(file, ownerEmail) {
    //     var me = this,
    //         attachmentsField = me.getStudentAttachmentsField(),
    //         fileId = file[google.picker.Document.ID];

    //     gapi.client.request({
    //         path: '/drive/v3/files/'+fileId+'/revisions/head',
    //         method: 'GET',
    //         params: {
    //             'access_token': Ext.util.Cookies.get('googleAppsToken', '/')
    //         }
    //     }).then(function(response) {
    //         var fileInfo = response.result;

    //         if (response.error) {
    //             Ext.Msg.alert('Error', 'Unable to lookup details about google document. Please try again, or contact an administrator.');
    //             return;
    //         }

    //         attachmentsField.setAttachments({
    //             Class: 'Slate\\CBL\\Tasks\\Attachments\\GoogleDriveFile',
    //             URL: file[google.picker.Document.URL],
    //             Title: file[google.picker.Document.NAME],
    //             FileRevisionID: fileInfo.id,
    //             File: {
    //                 DriveID: fileId,
    //                 OwnerEmail: ownerEmail
    //             }
    //         }, true);
    //     },
    //     function(response) { // revision id could not be found
    //         var error = response.result.error;

    //         if (Ext.isObject(error) && error.code === 404) {
    //             attachmentsField.setAttachments({
    //                 Class: 'Slate\\CBL\\Tasks\\Attachments\\GoogleDriveFile',
    //                 URL: file[google.picker.Document.URL],
    //                 Title: file[google.picker.Document.NAME],
    //                 File: {
    //                     DriveID: fileId,
    //                     OwnerEmail: ownerEmail
    //                 }
    //             }, true);
    //         }
    //     });
    // },


    // local methods
    openTaskWindow: function(studentTask, options) {
        options = options || {};

        // eslint-disable-next-line vars-on-top
        var me = this,
            StudentTaskModel = me.getStudentTaskModel(),
            formWindow = me.getTaskWindow({
                ownerCmp: me.getDashboardCt()
            }),
            formPanel = formWindow.getMainView();


        // reconfigure form and window
        formWindow.animateTarget = options.animateTarget || null;


        // clear window and show with loading indicator
        formPanel.setStudentTask(null);
        formWindow.show();
        formWindow.setLoading('Loading task&hellip;');


        // fetch Student, Task, and StudentTask data from server
        StudentTaskModel.load({
            student: studentTask.get('StudentID'),
            task: studentTask.get('TaskID'),
            include: me.studentTaskInclude,
            success: function(loadedStudentTask, operation) {
                loadedStudentTask.readOperationData(operation);
                formPanel.setStudentTask(loadedStudentTask);
                formWindow.setLoading(false);
            },
            failure: function(loadedStudentTask, operation) {
                // request failed
                formWindow.hide();
                formWindow.setLoading(false);

                Ext.Msg.show({
                    title: 'Failed to load student task',
                    message: operation.getError(),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });




        // var me = this,
        //     details = me.getTaskDetails(),
        //     form = me.getTaskForm(),
        //     ratingView = me.getRatingView(),
        //     teacherAttachmentsField = me.getTeacherAttachmentsField(),
        //     studentAttachmentsField = me.getStudentAttachmentsField(),
        //     studentAttachmentList = studentAttachmentsField.down('slate-attachmentslist'),
        //     commentsField = me.getCommentsField(),
        //     submissions = rec.get('Submissions'),
        //     readonly = me.getTaskTree().getReadOnly() || rec.get('TaskStatus') === 'completed';

        // form.getForm().loadRecord(rec);

        // if (submissions && submissions.length && submissions.length > 0) {
        //     form.down('displayfield[name="Submitted"]').hide();
        //     form.down('displayfield[name="Submissions"]').show();
        // } else {
        //     form.down('displayfield[name="Submitted"]').show();
        //     form.down('displayfield[name="Submissions"]').hide();
        // }

        // ratingView.setData({
        //     ratings: [7, 8, 9, 10, 11, 12, 'M'],
        //     competencies: rec.getTaskSkillsGroupedByCompetency()
        // });

        // me.getParentTaskField().setVisible(rec.get('ParentTaskID') !== null);
        // teacherAttachmentsField.setAttachments(rec.getTeacherAttachments());
        // teacherAttachmentsField.setReadOnly(true);
        // commentsField.setRecord(rec);
        // commentsField.setReadOnly(true);

        // studentAttachmentsField.setAttachments(rec.getStudentAttachments());
        // studentAttachmentsField.setReadOnly(readonly);

        // studentAttachmentList.setConfig({
        //     editable: !readonly,
        //     shareMethodMutable: false
        // });
        // me.getSubmitButton().setDisabled(readonly);

        // details.show();
    },

    /**
     * Passes a record through a group of filters.
     * @param {Ext.data.Model} rec- The record to be tested.
     * @param {Array} filterGroup - An array of objects with a filter function.
     * @returns {boolean} filtered - true if this rec should be filtered
     */
    // TODO: audit and optimize
    filterRecord: function(rec, filterGroup) {
        var filterGroupLength = filterGroup.length,
            filtered = filterGroupLength !== 0, // if no filters, return false
            i = 0;

        for (; i < filterGroupLength; i++) {
            filtered = filtered && filterGroup[i].filterFn(rec);
        }

        return filtered;
    }
});