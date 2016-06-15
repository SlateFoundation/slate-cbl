/**
 * Renders progress for a given list of students across a given list of competencies
 */
Ext.define('SlateTasksTeacher.view.Dashboard', {
    extend: 'Ext.Container',
    xtype: 'slate-tasks-teacher-dashboard',
    requires:[
        'SlateTasksTeacher.view.StudentsGrid',
        'SlateTasksTeacher.view.GridLegend'
    ],

    config: {
        taskGrid: true,
        gridLegend: true
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