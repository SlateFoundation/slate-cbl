Ext.define('SlateTasksStudent.view.TaskFiltersMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'slate-tasks-student-taskfiltersmenu',

    plain: true,
    showSeparator: false,
    defaults: {
        xtype: 'menucheckitem'
    },

    config: {
        currentYearTermIds: [],
        currentlyEnrolledSectionIds: []
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
            filterFn: function(rec, menu) {
                return menu.getCurrentYearTermIds().indexOf(rec.get('Task')['Section']['TermID']) === -1;
            },
            value: '*currentyear',
            checked: true
        },
        {
            text: 'Currently Enrolled Sections',
            filterGroup: 'Section',
            filterFn: function(rec, menu) {
                console.log(
                    rec.get('Task')['SectionID'],
                    rec.get('Task')['Section']['Title']
                );
                return menu.getCurrentlyEnrolledSectionIds().indexOf(rec.get('Task')['SectionID']) === -1;
            },
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
            filterFn: function(rec) {
                return rec.get('TaskStatus') !== 'assigned';
            },
            value: 'assigned',
            checked: true
        },
        {
            text: 'Revision Tasks',
            filterGroup: 'Status',
            filterFn: function(rec) {
                return rec.get('TaskStatus') !== 're-assigned';
            },
            value: 're-assigned',
            checked: true
        },
        {
            text: 'Submitted Tasks',
            filterGroup: 'Status',
            filterFn: function(rec) {
                return !(rec.get('TaskStatus') === 'submitted' || rec.get('TaskStatus') === 're-submitted');
            },
            value: [
                'submitted',
                're-submitted'
            ]
        },
        {
            text: 'Completed Tasks',
            filterGroup: 'Status',
            filterFn: function(rec) {
                return rec.get('TaskStatus') !== 'completed';
            },
            value: 'completed'
        },
        {
            text: 'Un-archived Tasks',
            filterGroup: 'Status',
            filterFn: function(rec) {
                return !(rec.get('TaskStatus') === 'archived' || rec.get('Task')['Status'] === 'archived');
            },
            value: 'unarchived'
        },
        {
            xtype: 'component',
            cls: 'slate-menu-header',
            html: 'Timeline'
        },
        {
            text: 'Past Due',
            filterGroup: 'Timeline',
            filterFn: function(studentTask) {
                return !studentTask.get('IsLate');
            },
            value: '*late'
        },
        {
            text: 'Due (recently/upcoming)',
            filterGroup: 'Timeline',
            filterFn: function(rec) {
                var dueDate = rec.get('EffectiveDueDate'),
                    now = new Date(),
                    twoWeeks = 1209600000;

                if (dueDate && Math.abs(dueDate.getTime() - now.getTime()) < twoWeeks) {
                    return false;
                }

                return true;
            },
            value: '*recent'
        },
        {
            text: 'Due Today',
            filterGroup: 'Timeline',
            filterFn: function(rec) {
                var dueDate = rec.get('EffectiveDueDate');

                return !dueDate || dueDate.toDateString() !== (new Date()).toDateString();
            },
            value: '*today'
        },
        {
            text: 'Due This Week',
            filterGroup: 'Timeline',
            filterFn: function(rec) {
                var dueDate = rec.get('EffectiveDueDate');

                return !dueDate || Ext.Date.getWeekOfYear(dueDate) !== Ext.Date.getWeekOfYear(new Date());
            },
            value: '*currentweek'
        },
        {
            text: 'Due Next Week',
            filterGroup: 'Timeline',
            filterFn: function(rec) {
                var dueDate = rec.get('EffectiveDueDate');

                return !dueDate || Ext.Date.getWeekOfYear(dueDate) !== Ext.Date.getWeekOfYear(new Date())+1;
            },
            value: '*nextweek'
        },
        {
            text: 'Due (no date)',
            filterGroup: 'Timeline',
            filterFn: function(rec) {
                var dueDate = rec.get('EffectiveDueDate');

                return !!dueDate;
            },
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
