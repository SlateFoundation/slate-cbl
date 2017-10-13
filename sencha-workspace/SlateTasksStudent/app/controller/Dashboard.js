/**
 * The Dashboard controller manages the components of the student dashboard and
 * handles routing by course section.
 */
Ext.define('SlateTasksStudent.controller.Dashboard', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],


    // dependencies
    views: [
        'Dashboard',
        'AppHeader',
        'TaskTree',
        'RecentActivity',
        'Slate.cbl.view.student.TaskHistory'
    ],

    refs: {
        dashboard: {
            selector: 'slatetasksstudent-dashboard',
            autoCreate: true,

            xtype: 'slatetasksstudent-dashboard'
        },
        appHeader: {
            selector: 'slatetasksstudent-appheader',
            autoCreate: true,

            xtype: 'slatetasksstudent-appheader'
        },
        sectionSelectorCombo: {
            selector: 'combobox#section-selector',
        },
        studentSelectorCombo: {
            selector: 'combobox#student-selector',
        },
        taskTree: {
            selector: 'slatetasksstudent-tasktree',
            autoCreate: true,

            xtype: 'slatetasksstudent-tasktree'
        },
        todoList: {
            selector: 'slatetasksstudent-todolist',
            autoCreate: true,

            xtype: 'slatetasksstudent-todolist'
        },
        recentActivity: {
            selector: 'slatetasksstudent-recentactivity',
            autoCreate: true,

            xtype: 'slatetasksstudent-recentactivity'
        },
        taskHistory: {
            selector: 'slate-taskhistory',
            autoCreate: true,

            xtype: 'slate-taskhistory'
        }
    },


    // entry points
    routes: {
        'section/:sectionCode': {
            sectionCode: '([a-zA-Z0-9])+',
            action: 'showCourseSection'
        }
    },

    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onUnmatchedRoute'
            }
        }
    },

    control: {
        'slatetasksstudent-appheader button[action="show-recent"]': {
            click: 'onShowRecentClick'
        },
        'slatetasksstudent-tasktree': {
            resize: 'onTaskTreeResize'
        },
        'combo#section-selector': {
            select: 'onSectionSelectorSelect',
            boxready: 'onSectionSelectorBoxReady'
        },
        'combo#student-selector': {
            select: 'onStudentSelectorSelect'
        }
    },


    // controller templates method overrides
    onLaunch: function () {
        var me = this,
            studentCombo;

        me.getDashboard().render('slateapp-viewport');

        // hide student selector from students
        if (window.SiteEnvironment && SiteEnvironment.user && SiteEnvironment.user.AccountLevel != 'User') {
            me.getStudentSelectorCombo().setHidden(false);
        }

        // load student combo and set value
        studentCombo = me.getStudentSelectorCombo();        
        studentCombo.getStore().load({ callback: function() {
            var queryParams = Ext.Object.fromQueryString(location.search);
            this.getStudentSelectorCombo().setValue(queryParams.student);
        }, scope: me});
    },


    // event handlers
    onUnmatchedRoute: function() {
        this.redirectTo('section/all');
    },

    onShowRecentClick: function(button) {
        var win = this.getRecentActivity();

        if (button.pressed) {
            win.showBy(button, 'tr-bl');
        } else {
            win.hide();
        }
    },

    onTaskTreeResize: function () {
        this.maskDemoElements();
    },

    onSectionSelectorSelect: function(combo, rec) {
        var sectionCode = rec.get('Code'),
            route = 'section/all';

        if (sectionCode) {
            route = 'section/'+sectionCode;
        }
        this.redirectTo(route);
    },

    onSectionSelectorBoxReady: function(combo) {
        combo.getStore().on('load', function(store) {
            store.insert(0, {
                ID: 0,
                Code: null,
                Title: 'All'
            })
        });
    },

    onStudentSelectorSelect: function(studentCombo, student) {
        var params = Ext.Object.fromQueryString(location.search),
            username = student.get('Username');

        // skip rerouting if student selection hasn't changed
        if (username === params.student) {
            return;
        }

        // reset section state
        this.redirectTo('section/all');

        // reroute page to reflect selected student
        params.student = username;
        location.search = Ext.Object.toQueryString(params);
    },

    // custom controller methods
    maskDemoElements: function () {
        this.getTaskHistory().setLoading(false);

        this.getTaskHistory().setLoading('');
    },

    showCourseSection: function(sectionCode) {
        var me = this,
            params = Ext.urlDecode(location.search.substring(1)),
            sectionSelectorCombo = me.getSectionSelectorCombo(),
            courseSectionsStore = sectionSelectorCombo.getStore(),
            rec = courseSectionsStore.findRecord('Code', sectionCode),
            taskTree = me.getTaskTree(),
            todoList = me.getTodoList(),
            user = params.student ? params.student : 'current';

        // correct route if it does not match requested course_section parameter
        if (params.course_section && params.course_section !== sectionCode) {
            this.redirectTo('section/'+params.course_section);
            return;
        }

        if (!courseSectionsStore.isLoaded()) {
            courseSectionsStore.load({
                params: {
                    enrolled_user: user // eslint-disable-line camelcase
                },
                callback: function() {
                    me.showCourseSection(sectionCode);
                }
            });
            return;
        }

        if (params.student) {
            taskTree.setStudent(params.student);
            taskTree.setReadOnly(true);

            todoList.setStudent(params.student);
            todoList.setReadOnly(true);
        }

        if (!rec && sectionCode !== 'all') {
            Ext.Msg.alert('Error', 'Course Section not found.');
            return;
        }

        if (sectionCode === 'all') {
            sectionCode = 0;
            sectionSelectorCombo.setValue(0);
        } else {
            sectionSelectorCombo.setValue(rec);
        }

        taskTree.setCourseSection(sectionCode);
        todoList.setCourseSection(sectionCode);
    }
});
