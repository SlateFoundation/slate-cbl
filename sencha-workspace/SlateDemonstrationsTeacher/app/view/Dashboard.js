/**
 * Renders progress for a given list of students across a given list of competencies
 */
Ext.define('SlateDemonstrationsTeacher.view.Dashboard', {
    extend: 'Ext.Container',
    xtype: 'slate-demonstrations-teacher-dashboard',
    requires: [
        'SlateDemonstrationsTeacher.view.StudentsProgressGrid',
        'SlateDemonstrationsTeacher.view.AppHeader'
    ],

    config: {
        progressGrid: true,

        contentArea: null
    },

    items: [{
        xtype: 'slate-demonstrations-teacher-appheader'
    }],

    applyProgressGrid: function(progressGrid, oldProgressGrid) {
        return Ext.factory(progressGrid, 'SlateDemonstrationsTeacher.view.StudentsProgressGrid', oldProgressGrid);
    },

    updateContentArea: function(contentArea) {
        var progressGrid = this.getProgressGrid(),
            contentAreaCode = contentArea && contentArea.isModel && contentArea.get('Code') || null;

        if (progressGrid) {
            progressGrid.setStudentDashboardLink('/cbl/student-dashboard?content-area=' + encodeURIComponent(contentAreaCode));
        }
    },

    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        me.add(me.getProgressGrid());
    }
});