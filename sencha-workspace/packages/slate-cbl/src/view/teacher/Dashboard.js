/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext,Slate*/
/**
 * Renders progress for a given list of students across a given list of competencies
 */
Ext.define('Slate.cbl.view.teacher.Dashboard', {
    extend: 'Ext.Container',
    xtype: 'slate-cbl-teacher-dashboard',
    requires:[
        'Slate.cbl.view.teacher.DashboardController',
        'Slate.cbl.view.teacher.StudentsProgressGrid'
    ],

    controller: 'slate-cbl-teacher-dashboard',

    config: {
        progressGrid: true
    },

    applyProgressGrid: function(progressGrid, oldProgressGrid) {
        return Ext.factory(progressGrid, 'Slate.cbl.view.teacher.StudentsProgressGrid', oldProgressGrid);
    },

    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        me.add(me.getProgressGrid());
    }
});