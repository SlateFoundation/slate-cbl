Ext.define('SlateTasksStudent.view.AppHeader', {
    extend: 'Slate.cbl.view.app.Header',
    xtype: 'slate-tasks-student-appheader',
    requires: [
        // 'Ext.toolbar.Fill',

        'Slate.cbl.widget.StudentSelector',
        'Slate.cbl.widget.SectionSelector'
    ],


    config: {
        title: 'Student Task Dashboard',

        items: [
            {
                xtype: 'slate-cbl-studentselector',
                hidden: true,
                store: 'Students',
                emptyText: 'Me'
            },
            {
                xtype: 'slate-cbl-sectionselector',
                disabled: true,
                store: 'Sections',
                queryMode: 'local',
                emptyText: 'All'
            }

            // TODO: Unide recent activity toggle once the RecentActivity.js
            // view is populated with real data.
            // {
            //     xtype: 'tbfill'
            // },
            // {
            //     xtype: 'button',
            //     iconCls: 'x-fa fa-clock-o',
            //     enableToggle: true,
            //     action: 'show-recent'
            // }
        ]
    }
});