/**
 * Renders progress for a given list of students across a given list of competencies
 */
Ext.define('SlateDemonstrationsTeacher.view.Dashboard', {
    extend: 'Ext.Container',
    xtype: 'slate-demonstrations-teacher-dashboard',
    requires:[
        'SlateDemonstrationsTeacher.view.DashboardController',
        'SlateDemonstrationsTeacher.view.StudentsProgressGrid'
    ],

    controller: 'slate-demonstrations-teacher-dashboard',

    config: {
        progressGrid: true
    },

    applyProgressGrid: function(progressGrid, oldProgressGrid) {
        return Ext.factory(progressGrid, 'SlateDemonstrationsTeacher.view.StudentsProgressGrid', oldProgressGrid);
    },

    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        me.add(me.getProgressGrid());
    }
});