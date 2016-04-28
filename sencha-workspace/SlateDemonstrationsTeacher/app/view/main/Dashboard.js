/**
 * Renders progress for a given list of students across a given list of competencies
 */
Ext.define('SlateDemonstrationsTeacher.view.main.Dashboard', {
    extend: 'Ext.Container',
    xtype: 'slate-cbl-teacher-dashboard',
    requires:[
        'SlateDemonstrationsTeacher.view.main.DashboardController',
        'SlateDemonstrationsTeacher.view.main.StudentsProgressGrid'
    ],

    controller: 'slate-cbl-teacher-dashboard',

    config: {
        progressGrid: true
    },

    applyProgressGrid: function(progressGrid, oldProgressGrid) {
        return Ext.factory(progressGrid, 'SlateDemonstrationsTeacher.view.main.StudentsProgressGrid', oldProgressGrid);
    },

    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        me.add(me.getProgressGrid());
    }
});