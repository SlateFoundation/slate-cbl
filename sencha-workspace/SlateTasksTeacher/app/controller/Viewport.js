Ext.define('SlateTasksTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],


    views: [
        'StudentsGrid@Slate.cbl.view.teacher'
    ],

    config: {
        refs: {
            studentsGrid: {
                selector: 'slate-studentsgrid',
                autoCreate: true,

                xtype: 'slate-studentsgrid'
            }
        },
    },

    onLaunch: function () {
        // render dashboard
        this.getStudentsGrid().render('slateapp-viewport');
    }
});