Ext.define('SlateDemonstrationsStudent.controller.RecentProgress', {
    extend: 'Ext.app.Controller',


    // controller configuration
    stores: [
        'RecentProgress@Slate.cbl.store'
    ],


    refs: {
        dashboardCt: 'slate-demonstrations-student-dashboard',
        recentProgressPanel: 'slate-demonstrations-student-recentprogress'
    },


    // entry points
    control: {
        dashboardCt: {
            selectedstudentchange: 'onStudentChange',
            selectedcontentareachange: 'onContentAreaChange'
        }
    },


    // event handlers
    onStudentChange: function(dashboardCt, studentUsername) {
        var recentProgressStore = this.getRecentProgressStore();

        recentProgressStore.setStudent(studentUsername);

        if (recentProgressStore.getContentArea()) {
            recentProgressStore.loadIfDirty();
        }
    },

    onContentAreaChange: function(dashboardCt, contentAreaCode) {
        var recentProgressStore = this.getRecentProgressStore();

        recentProgressStore.setContentArea(contentAreaCode);

        if (recentProgressStore.getStudent()) {
            recentProgressStore.loadIfDirty();
        }
    }
});