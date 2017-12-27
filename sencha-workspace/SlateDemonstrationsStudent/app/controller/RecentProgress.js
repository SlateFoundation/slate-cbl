Ext.define('SlateDemonstrationsStudent.controller.RecentProgress', {
    extend: 'Ext.app.Controller',


    // controller configuration
    stores: [
        'RecentProgress'
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

        recentProgressStore.setStudent(studentUsername || '*current');
        recentProgressStore.loadIfDirty();
    },

    onContentAreaChange: function(dashboardCt, contentAreaCode) {
        var recentProgressStore = this.getRecentProgressStore();

        recentProgressStore.setContentArea(contentAreaCode);
        recentProgressStore.loadIfDirty();
    }
});