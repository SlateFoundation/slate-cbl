/**
 * The StudentTasks controller manages the loading, creation, opening, and editing of student-tasks
 *
 * ## Responsibilities
 * -
 */
Ext.define('SlateTasksTeacher.controller.StudentTasks', {
    extend: 'Ext.app.Controller',


    // dependencies
    stores: [
        'StudentTasks'
    ],


    // component factories and selectors
    refs: {
        dashboardCt: 'slate-tasks-teacher-dashboard'
    },


    // entry points
    control: {
        dashboardCt: {
            selectedsectionchange: 'onSelectedSectionChange'
        }
    },


    // event handlers
    onSelectedSectionChange: function(dashboardCt, sectionCode) {
        var me = this,
            studentTasksStore = me.getStudentTasksStore();

        // (re)load StudentTask list
        studentTasksStore.setSection(sectionCode);
        studentTasksStore.loadIfDirty(true);
    }
});