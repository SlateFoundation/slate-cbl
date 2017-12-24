Ext.define('SlateDemonstrationsStudent.view.AppHeader', {
    extend: 'Slate.ui.app.Header',
    xtype: 'slate-demonstrations-student-appheader',
    requires: [
        'Slate.cbl.widget.StudentSelector',
        'Slate.cbl.widget.ContentAreaSelector',
    ],


    config: {
        title: 'Student Demonstrations Dashboard',

        items: [
            {
                xtype: 'slate-cbl-studentselector',
                hidden: true,
                emptyText: 'Me'
            },
            {
                xtype: 'slate-cbl-contentareaselector',
                emptyText: 'Select',
                store: 'ContentAreas',
                queryMode: 'local'
            }
        ]
    }
});