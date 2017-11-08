/**
 * The application's top level container, to be manually rendered to a
 * specific pre-painted container in the design
 */
Ext.define('SlateTasksStudent.view.Dashboard', {
    extend: 'Ext.container.Container',
    xtype: 'slatetasksstudent-dashboard',
    requires: [
        'Ext.layout.container.Column',

        'SlateTasksStudent.view.AppHeader',
        'SlateTasksStudent.view.TaskTree',
        'SlateTasksStudent.view.TodoList',
        // 'Slate.cbl.view.student.TaskHistory'
    ],


    items: [
        {
            xtype: 'slatetasksstudent-appheader',
            style: {
                border: 'none',
                padding: '1em 7.5%'
            }
        },
        {
            // like .site > .inner
            xtype: 'container',
            style: {
                padding: '2em 7.5%'
            },
            items: [
                {
                    xtype: 'container',
                    layout: 'column',
                    defaults: {
                        columnWidth: 0.5
                    },
                    items: [
                        {
                            xtype: 'slatetasksstudent-tasktree',
                            minHeight: 200, // need a minimum height for load mask
                            margin: '0 32 0 0'
                        }, {
                            xtype: 'slatetasksstudent-todolist'
                        }
                    ]
                // @todo Unhide task history once it can be populated with live data
                // },
                // {
                //     xtype: 'slate-taskhistory',
                //     margin: '32 0 0'
                }
            ]
        }
    ]
});
