/**
 * TODO:
 * - move rendering responsibilities to the view?
 */
Ext.define('SlateTasksTeacher.controller.Dashboard', {
    extend: 'Ext.app.Controller',


    // entry points
    control: {
        courseSelector: {
            select: 'onCourseSectionSelect'
        },
        dashboardCt: {
            coursesectionselect: 'onDashboardSectionChange'
        }
    },

    routes: {
        'section/:sectionId': {
            sectionId: '([a-zA-Z0-9])+',
            action: 'viewCourseSection'
        }
    },


    // controller configuration
    views: [
        'Dashboard'
    ],
    stores: [
        'CourseSections',
        'Students',
        'StudentTasks@Slate.cbl.store',
        'Tasks'
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
        courseSelector: 'slate-tasks-teacher-appheader combo'
    },

    // controller templates method overrides
    onLaunch: function () {
        this.getDashboardCt().render('slateapp-viewport');
    },

    onCourseSectionSelect: function(combo, record) {
        var me = this;
        me.getDashboardCt().setCourseSection(record);
    },

    onDashboardSectionChange: function(record) {
        this.redirectTo('section/'+record.get('Code'));
    },

    // event handlers
    viewCourseSection: function(sectionCode) {
        var me = this,
            courseSelector = me.getCourseSelector(),
            courseSectionsStore = courseSelector.getStore(),
            studentsStore = me.getStudentsStore(),
            tasksStore = me.getTasksStore(),
            studentTasksStore = me.getStudentTasksStore(),
            courseSection = courseSectionsStore.findRecord('Code', sectionCode);

        //select section
        if (!courseSection && courseSectionsStore.isLoaded()) {
            console.log('Course Section not found.');
            return;
        } else if (!courseSectionsStore.isLoaded()) {
            return courseSectionsStore.load(function() {
                me.viewCourseSection(sectionCode);
            });
        }
        if (!(me.getDashboardCt().getCourseSection()) || me.getDashboardCt().getCourseSection().getId() != sectionCode) {
            me.getDashboardCt().setCourseSection(courseSection);
        }
        courseSelector.setValue(sectionCode);

        //update store urls
        studentsStore.setCourseSection(sectionCode).load();
        tasksStore.setCourseSection(sectionCode).load();
        studentTasksStore.setCourseSection(sectionCode).load();
    },

    onStudentsStoreLoad: function() {
        console.log('onstudentstoreload', arguments);
    }
});