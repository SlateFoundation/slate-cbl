/**
 * Renders progress for a given list of students across a given list of competencies
 */
Ext.define('SlateTasksTeacher.view.Dashboard', {
    extend: 'Ext.Container',
    xtype: 'slate-tasks-teacher-dashboard',
    requires:[
        'SlateTasksTeacher.view.StudentsGrid',
        'SlateTasksTeacher.view.StudentsTaskGrid',
        'SlateTasksTeacher.view.GridLegend',
        'SlateTasksTeacher.view.DashboardToolbar'
    ],


    config: {
        courseSection: null,

        taskGrid: true,
        gridLegend: true
    },

    items: [{
        xtype: 'slate-tasks-teacher-dashboardtoolbar'
    }],

    updateCourseSection: function(courseSection) {
        this.fireEvent('coursesectionselect', courseSection);
    },

    applyTaskGrid: function(taskGrid, oldTaskGrid) {
        return Ext.factory(taskGrid, 'SlateTasksTeacher.view.StudentsGrid', oldTaskGrid);
    },

    applyGridLegend: function(gridLegend, oldGridLegend) {
        return Ext.factory(gridLegend, 'SlateTasksTeacher.view.GridLegend', oldGridLegend);
    },

    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        me.add(me.getTaskGrid());
        me.add(me.getGridLegend());
    }
});