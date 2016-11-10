/**
 * Renders progress for a given list of students across a given list of competencies
 */
Ext.define('SlateTasksTeacher.view.Dashboard', {
    extend: 'Ext.Container',
    xtype: 'slate-tasks-teacher-dashboard',
    requires:[
        'SlateTasksTeacher.view.AppHeader',
        'SlateTasksTeacher.view.StudentsGrid',
        'SlateTasksTeacher.view.GridLegend'
    ],

    config: {
        taskGrid: true,
        gridLegend: true,
        courseSection: null
    },

    items: [{
        xtype: 'slate-tasks-teacher-appheader'
    }],

    applyTaskGrid: function(taskGrid, oldTaskGrid) {
        return Ext.factory(taskGrid, 'SlateTasksTeacher.view.StudentsGrid', oldTaskGrid);
    },

    applyGridLegend: function(gridLegend, oldGridLegend) {
        return Ext.factory(gridLegend, 'SlateTasksTeacher.view.GridLegend', oldGridLegend);
    },

    updateCourseSection: function(courseSection) {
        this.fireEvent('coursesectionselect', this, courseSection);
    },

    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        me.add(me.getTaskGrid());
        me.add(me.getGridLegend());
    }
});