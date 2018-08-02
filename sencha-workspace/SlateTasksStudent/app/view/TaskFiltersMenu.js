Ext.define('SlateTasksStudent.view.TaskFiltersMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'slate-tasks-student-taskfiltersmenu',

    plain: true,
    showSeparator: false,
    defaults: {
        xtype: 'menucheckitem'
    },

    items: [
        {
            xtype: 'component',
            cls: 'slate-menu-header',
            html: 'Status'
        },
        {
            text: 'Due Tasks',
            filterGroup: 'Status',
            filterFn: function(rec) {
                return rec.get('TaskStatus') !== 'assigned';
            }
        },
        {
            text: 'Revision Tasks',
            filterGroup: 'Status',
            filterFn: function(rec) {
                return rec.get('TaskStatus') !== 're-assigned';
            }
        },
        {
            text: 'Submitted Tasks',
            filterGroup: 'Status',
            filterFn: function(rec) {
                return !(rec.get('TaskStatus') === 'submitted' || rec.get('TaskStatus') === 're-submitted');
            }
        },
        {
            text: 'Completed Tasks',
            filterGroup: 'Status',
            filterFn: function(rec) {
                return rec.get('TaskStatus') !== 'completed';
            }
        },
        {
            xtype: 'component',
            cls: 'slate-menu-header',
            html: 'Timeline'
        },
        {
            text: 'Past Due',
            filterGroup: 'Timeline',
            filterFn: function(rec) {
                var now = new Date(),
                    due = rec.get('DueDate');

                return !due || rec.get('DueDate') >= now;
            }
        },
        {
            text: 'Due Today',
            filterGroup: 'Timeline',
            filterFn: function(rec) {
                var now = new Date(),
                    due = rec.get('DueDate');

                return !due || due.toDateString() !== now.toDateString();
            }
        },
        {
            text: 'Due This Week',
            filterGroup: 'Timeline',
            filterFn: function(rec) {
                var now = new Date(),
                    due = rec.get('DueDate');

                return !due || Ext.Date.getWeekOfYear(rec.get('DueDate')) !== Ext.Date.getWeekOfYear(now);
            }
        },
        {
            text: 'Due Next Week',
            filterGroup: 'Timeline',
            filterFn: function(rec) {
                var now = new Date(),
                    due = rec.get('DueDate');

                return !due || Ext.Date.getWeekOfYear(rec.get('DueDate')) !== Ext.Date.getWeekOfYear(now)+1;
            }
        },
        { xtype: 'menuseparator' },
        {
            xtype: 'container',
            padding: 8,
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'button',
                    itemId: 'view-all',
                    text: 'View All'
                }
            ]
        }
    ]
});
