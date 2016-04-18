Ext.define('SlateTasksTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],


    views: [
        'StudentsGrid@Slate.cbl.view.teacher',
        'GridLegend@Slate.cbl.view.teacher'
    ],

    config: {
        refs: {
            studentsGrid: {
                selector: 'slate-studentsgrid',
                autoCreate: true,

                xtype: 'slate-studentsgrid'
            },
            gridLegend: {
                selector: 'slate-gridlegend',
                autoCreate: true,

                xtype: 'slate-gridlegend'
            }
        },
    },

    onLaunch: function () {
        // render dashboard
        this.getStudentsGrid().render('slateapp-viewport');
        this.getGridLegend().render('slateapp-viewport');
    }
});