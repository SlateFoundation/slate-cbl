/**
 * The application's top level container, to be manually rendered to a
 * specific pre-painted container in the design
 */
Ext.define('SlateTasksStudent.view.Dashboard', {
    extend: 'Slate.ui.app.Container',
    xtype: 'slate-tasks-student-dashboard',
    requires: [
        'Ext.layout.container.Column',

        'SlateTasksStudent.view.TaskTree',
        'SlateTasksStudent.view.TodoList',

        'Slate.cbl.field.StudentSelector',
        'Slate.cbl.field.SectionSelector'
    ],


    config: {
        student: null,
        section: null,

        header: {
            title: 'My Tasks',

            items: [
                {
                    xtype: 'slate-cbl-studentselector',
                    hidden: true,
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
                // '->',
                // {
                //     xtype: 'button',
                //     iconCls: 'x-fa fa-clock-o',
                //     enableToggle: true,
                //     action: 'show-recent'
                // }
            ]
        }
    },


    // TODO: remove nesting once appcontainer reports correct width
    items: [{
        layout: 'column',
        defaults: {
            columnWidth: 0.5
        },
        items: [
            {
                xtype: 'slate-tasks-student-tasktree',
                margin: '0 32 0 0',
                store: 'Tasks'
            }, {
                xtype: 'slate-tasks-student-todolist',
                store: 'TodoGroups'
            }
        ]
    }],


    // config handlers
    updateStudent: function(student, oldStudent) {
        this.fireEvent('studentchange', this, student, oldStudent);
    },

    updateSection: function(section, oldSection) {
        this.fireEvent('sectionchange', this, section, oldSection);
    }
});