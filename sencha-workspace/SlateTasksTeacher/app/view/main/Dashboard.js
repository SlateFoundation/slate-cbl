/**
 * Renders progress for a given list of students across a given list of competencies
 */
Ext.define('SlateTasksTeacher.view.main.Dashboard', {
    extend: 'Ext.Container',
    xtype: 'slate-cbl-teacher-dashboard',
    requires:[
        'SlateTasksTeacher.view.main.DashboardController',
        'SlateTasksTeacher.view.main.StudentsTaskGrid'
    ],

    controller: 'slate-cbl-teacher-dashboard',

    config: {
        taskGrid: true
    },

    applyTaskGrid: function(taskGrid, oldTaskGrid) {
        return Ext.factory(taskGrid, 'SlateTasksTeacher.view.main.StudentsTaskGrid', oldTaskGrid);
    },

    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        me.add(me.getTaskGrid());
    }
});