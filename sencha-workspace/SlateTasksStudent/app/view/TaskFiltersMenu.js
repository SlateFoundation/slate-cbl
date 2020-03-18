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
            html: 'Sections',
            filterGroup: 'Section'
        },
        {
            text: 'Current Year any Term',
            filterGroup: 'Section',
            value: '*currentyear',
            checked: true
        },
        {
            text: 'Currently Enrolled Sections',
            filterGroup: 'Section',
            value: '*currentlyenrolled',
            checked: true
        },
        {
            xtype: 'component',
            cls: 'slate-menu-header',
            html: 'Status'
        },
        {
            text: 'Due Tasks',
            filterGroup: 'Status',
            value: 'assigned',
            checked: true
        },
        {
            text: 'Revision Tasks',
            filterGroup: 'Status',
            value: 're-assigned',
            checked: true
        },
        {
            text: 'Submitted Tasks',
            filterGroup: 'Status',
            value: [
                'submitted',
                're-submitted'
            ]
        },
        {
            text: 'Completed Tasks',
            filterGroup: 'Status',
            value: 'completed'
        },
        {
            text: 'Archived Tasks',
            filterGroup: 'Archive'
        },
        {
            xtype: 'component',
            cls: 'slate-menu-header',
            html: 'Timeline'
        },
        {
            text: 'Past Due',
            filterGroup: 'Timeline',
            value: '*late'
        },
        {
            text: 'Due (recently/upcoming)',
            filterGroup: 'Timeline',
            value: '*recent'
        },
        {
            text: 'Due Today',
            filterGroup: 'Timeline',
            value: '*today'
        },
        {
            text: 'Due This Week',
            filterGroup: 'Timeline',
            value: '*currentweek'
        },
        {
            text: 'Due Next Week',
            filterGroup: 'Timeline',
            value: '*nextweek'
        },
        {
            text: 'Due (no date)',
            filterGroup: 'Timeline',
            value: '*nodate'
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
