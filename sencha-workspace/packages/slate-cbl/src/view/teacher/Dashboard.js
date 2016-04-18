/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext,Slate*/
/**
 * Renders progress for a given list of students across a given list of competencies
 */
Ext.define('Slate.cbl.view.teacher.Dashboard', {
    extend: 'Ext.Container',
    xtype: 'slate-cbl-teacher-dashboard',
    requires:[
        'Slate.cbl.view.teacher.DashboardController',
        'Slate.cbl.view.teacher.StudentsTaskGrid'
    ],

    controller: 'slate-cbl-teacher-dashboard',

    config: {
        taskGrid: true
    },

    applyTaskGrid: function(taskGrid, oldTaskGrid) {
        return Ext.factory(taskGrid, 'Slate.cbl.view.teacher.StudentsTaskGrid', oldTaskGrid);
    },

    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        me.add(me.getTaskGrid());
    }
});