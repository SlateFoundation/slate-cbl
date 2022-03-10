/**
 * Main controller for SlateTasksStudent app
 *
 * ## Responsibilities:
 * - Configure and render main view
 * - Manage selection of student
 * - Manage selection of section
 */
Ext.define('SlateTasksStudent.controller.Dashboard', {
    extend: 'Ext.app.Controller',


    // dependencies
    views: [
        'Dashboard'
    ],

    stores: [
        'Sections@Slate.store.courses'
    ],


    // component factories and selectors
    refs: {
        dashboardCt: {
            selector: 'slate-tasks-student-dashboard',
            autoCreate: true,

            xtype: 'slate-tasks-student-dashboard'
        },
        studentSelector: 'slate-tasks-student-dashboard slate-appheader slate-cbl-studentselector',
        sectionSelector: 'slate-tasks-student-dashboard slate-appheader slate-cbl-sectionselector',
        taskTree: 'slate-tasks-student-tasktree',
        todoList: 'slate-tasks-student-todolist'
    },


    // entry points
    routes: {
        ':studentUsername/:sectionCode': {
            action: 'showDashboard',
            conditions: {
                ':studentUsername': '([^/]+)',
                ':sectionCode': '([^/]+)'
            }
        },
        ':studentUsername/:sectionCode/:taskId': {
          action: 'showDashboardAndTask',
          conditions: {
              ':studentUsername': '([^/]+)',
              ':sectionCode': '([^/]+)',
              ':taskId': '([^/]+)'
          }
      }
    },

    listen: {
        global: {
            resize: 'onBrowserResize'
        },
        controller: {
            '#': {
                unmatchedroute: 'onUnmatchedRoute',
                bootstrapdataload: 'onBootstrapDataLoad'
            }
        },
        store: {
            '#Sections': {
                load: 'onSectionsLoad'
            }
        }
    },

    control: {
        dashboardCt: {
            studentchange: 'onStudentChange',
            sectionchange: 'onSectionChange'
        },
        studentSelector: {
            select: 'onStudentSelectorSelect',
            clear: 'onStudentSelectorClear'
        },
        sectionSelector: {
            select: 'onSectionSelectorSelect',
            clear: 'onSectionSelectorClear'
        }
    },


    // controller lifecycle
    onLaunch: function () {

        // instantiate and render viewport
        this.getDashboardCt().render('slateapp-viewport');
    },


    // route handlers
    showDashboard: function(studentUsername, sectionCode) {
        var dashboardCt = this.getDashboardCt();

        // use false instead of null, to indicate selecting *nothing* vs having no selection
        dashboardCt.setStudent(studentUsername == 'me' ? false : studentUsername);
        dashboardCt.setSection(sectionCode == 'all' ? false : sectionCode);
    },

    showDashboardAndTask: function(studentUsername, sectionCode, studentTaskId) {
        var me = this,
            studentTaskStore = me.getTaskTree().getStore(),
            studentTask;

        me.showDashboard(studentUsername, sectionCode);

        if (!studentTaskStore.isLoaded()) {
            studentTaskStore.on('load', function() {
                me.showDashboardAndTask(studentUsername, sectionCode, studentTaskId);
            }, me, { single: true });
            return;
        }

        studentTask = studentTaskStore.getById(studentTaskId);

        if (studentTask) {
            me.getController('Tasks').openTaskWindow(studentTask);
        } else {
            studentTaskStore.getModel().load(studentTaskId, {
                success: function(studentTask) {
                    me.getController('Tasks').openTaskWindow(studentTask);
                },
                failure: function() {
                    Ext.Msg.alert('Unable to open student task', `Student task #${studentTaskId} was not able to be loaded`);
                }
            });
        }
    },


    // event handlers
    onBrowserResize: function() {
        this.getDashboardCt().updateLayout();
    },

    onUnmatchedRoute: function(token) {
        Ext.Logger.warn('Unmatched route: '+token);
    },

    onBootstrapDataLoad: function(app, bootstrapData) {
        var studentSelector = this.getStudentSelector(),
            studentsStore = studentSelector.getStore(),
            userData = bootstrapData.user,
            isStaff = userData.AccountLevel != 'User',
            wards = userData.Wards || [];

        // show and load student selector for privileged users
        if (isStaff || wards.length) {
            studentSelector.show();

            if (!isStaff) {
                studentSelector.queryMode = 'local';
                studentSelector.setEditable(false);

                if (studentsStore.isLoading()) {
                    studentsStore.getProxy().abortLastRequest();
                }

                studentsStore.loadRawData(wards);
                studentSelector.setValueOnData();
            }
        }
    },

    onSectionsLoad: function() {
        this.getSectionSelector().enable();
    },

    onStudentChange: function(dashboardCt, studentUsername) {
        var me = this,
            studentCombo = me.getStudentSelector(),
            sectionsStore = me.getSectionsStore();

        // (re)load sections list
        sectionsStore.getProxy().setExtraParam('enrolled_user', studentUsername || '*current');
        sectionsStore.load();

        // push value to selector
        studentCombo.setValue(studentUsername);

        // reload students store with just selected student if they're not in the current result set
        if (studentUsername && !studentCombo.getSelectedRecord()) {
            studentCombo.getStore().load({
                url: `/people/${studentUsername}`
            });
        }
    },

    onSectionChange: function(dashboardCt, sectionCode) {
        var me = this;

        me.getSectionSelector().setValue(sectionCode);
    },

    onStudentSelectorSelect: function(studentCombo, student) {
        this.redirectTo([student.get('Username'), 'all']);
    },

    onStudentSelectorClear: function() {
        this.redirectTo(['me', 'all']);
    },

    onSectionSelectorSelect: function(sectionCombo, section) {
        this.redirectTo([this.getDashboardCt().getStudent() || 'me', section.get('Code')]);
    },

    onSectionSelectorClear: function() {
        this.redirectTo([this.getDashboardCt().getStudent() || 'me', 'all']);
    }
});