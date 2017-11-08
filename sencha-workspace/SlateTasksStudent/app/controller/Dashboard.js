/**
 * Main controller for SlateTasksStudent app
 *
 * Responsibilities:
 * - Configure and render main view
 * - Manage selection of student
 * - Manage selection of section
 */
Ext.define('SlateTasksStudent.controller.Dashboard', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],


    views: [
        'Dashboard'
        // 'RecentActivity'
    ],

    stores: [
        'Students',
        'CourseSections@Slate.store'
    ],

    refs: {
        dashboard: {
            selector: 'slatetasksstudent-dashboard',
            autoCreate: true,

            xtype: 'slatetasksstudent-dashboard'
        },
        appHeader: 'slatetasksstudent-appheader',
        studentSelector: 'combobox#studentSelector',
        sectionSelector: 'combobox#sectionSelector',
        taskTree: 'slatetasksstudent-tasktree',
        todoList: 'slatetasksstudent-todolist'
        // taskHistory: 'slate-taskhistory',

        // recentActivity: {
        //     selector: 'slatetasksstudent-recentactivity',
        //     autoCreate: true,

        //     xtype: 'slatetasksstudent-recentactivity'
        // },
    },


    // entry points
    routes: {
        'section/:sectionCode': {
            sectionCode: '([a-zA-Z0-9])+',
            action: 'showCourseSection'
        }
    },

    listen: {
        global: {
            resize: 'onBrowserResize'
        },
        controller: {
            '#': {
                unmatchedroute: 'onUnmatchedRoute'
            }
        },
        store: {
            '#CourseSections': {
                load: 'onCourseSectionsLoad'
            }
        }
    },

    control: {
        studentSelector: {
            change: 'onStudentSelectorChange'
        },
        sectionSelector: {
            change: 'onSectionSelectorChange'
        }
        // 'slatetasksstudent-appheader button[action="show-recent"]': {
        //     click: 'onShowRecentClick'
        // }
    },


    // controller templates method overrides
    onLaunch: function () {
        var me = this,
            siteEnv = window.SiteEnvironment || {},
            pageParams = Ext.Object.fromQueryString(location.search),
            selectedStudent = pageParams.student,
            sectionsStore = me.getCourseSectionsStore(),
            dashboard = me.getDashboard(),
            studentCombo = me.getStudentSelector(),
            taskTree = me.getTaskTree(),
            todoList = me.getTodoList();

        // show and load student selector for priveleged users
        if (!siteEnv.user || siteEnv.user.AccountLevel != 'User') {
            studentCombo.show();

            studentCombo.getStore().load({
                params: {
                    q: 'username:'+selectedStudent
                },
                callback: function() {
                    studentCombo.setValue(selectedStudent);
                }
            });
        }

        // load section selector
        sectionsStore.getProxy().setExtraParam('enrolled_user', selectedStudent || 'current');
        sectionsStore.load();

        // lock task tree and todo list to a student if selected
        if (selectedStudent) {
            taskTree.setStudent(selectedStudent);
            taskTree.setReadOnly(true);

            todoList.setStudent(selectedStudent);
            todoList.setReadOnly(true);
        }

        // instantiate and render viewport
        dashboard.render('slateapp-viewport');
    },


    // route handlers
    showCourseSection: function(sectionCode) {
        var me = this;

        if (sectionCode == 'all') {
            sectionCode = false; // use false instead of null, to indicate selecting *no section* vs having no selection
        }

        me.getSectionSelector().setValue(sectionCode);
        me.getTaskTree().setCourseSection(sectionCode);
        me.getTodoList().setCourseSection(sectionCode);
    },


    // event handlers
    onBrowserResize: function() {
        this.getDashboard().updateLayout();
    },

    onUnmatchedRoute: function() {
        this.redirectTo('section/all');
    },

    onCourseSectionsLoad: function() {
        this.getSectionSelector().enable();
    },

    onStudentSelectorChange: function(studentCombo, studentUsername) {
        var params = Ext.Object.fromQueryString(location.search);

        // skip rerouting if student selection hasn't changed
        if (params.student == studentUsername) {
            return;
        }

        // reroute page to reflect selected student
        params.student = studentUsername;
        window.location = '?' + Ext.Object.toQueryString(params) + '#section/all';
    },

    onSectionSelectorChange: function(sectionCombo, sectionCode) {
        this.redirectTo('section/' + (sectionCode || 'all'));
    }

    // onShowRecentClick: function(button) {
    //     var win = this.getRecentActivity();

    //     if (button.pressed) {
    //         win.showBy(button, 'tr-bl');
    //     } else {
    //         win.hide();
    //     }
    // },
});
