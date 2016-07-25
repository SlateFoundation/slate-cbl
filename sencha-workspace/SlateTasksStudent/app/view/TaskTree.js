Ext.define('SlateTasksStudent.view.TaskTree', {
    extend: 'Slate.cbl.widget.SimplePanel',
    xtype: 'slate-tasktree',
    requires:[
    ],

    title: 'Current Tasks',
    showTools: true,

    componentCls: 'slate-tasktree',

    items: [
        {
            xtype: 'container',
            componentCls: 'slate-simplepanel-header',
            layout: 'hbox',
            items: [
                {
                    flex: 1,
                    xtype: 'component',
                    cls: 'slate-simplepanel-title',
                    html: '',
                    itemId: 'title'
                },
                {
                    // TODO make this configurable
                    xtype: 'container',
                    layout: 'hbox',
                    itemId: 'tools',
                    items: [
                        {
                            xtype: 'button',
                            ui: 'light',
                            text: 'Filter',
                            itemId: 'filter',
                            menu: {
                                plain: true,
                                showSeparator: false,
                                defaults: {
                                    xtype: 'menucheckitem'
                                },
                                items: [
                                    { xtype: 'component', cls: 'slate-menu-header', html: 'Status' },
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
                                    { xtype: 'component', cls: 'slate-menu-header', html: 'Timeline' },
                                    {
                                        text: 'Past Due',
                                        filterGroup: 'Timeline',
                                        filterFn: function(rec) {
                                            var now = new Date(),
                                                due = rec.get('DueDate');

                                            return !due || (rec.get('DueDate') >= now);
                                        }
                                    },
                                    {
                                        text: 'Due Today',
                                        filterGroup: 'Timeline',
                                        filterFn: function(rec) {
                                            var now = new Date(),
                                                due = rec.get('DueDate');

                                            return !due || (due.toDateString() !== now.toDateString());
                                        }
                                    },
                                    {
                                        text: 'Due This Week',
                                        filterGroup: 'Timeline',
                                        filterFn: function(rec) {
                                            var now = new Date(),
                                                due = rec.get('DueDate');

                                            return !due || (Ext.Date.getWeekOfYear(rec.get('DueDate')) !== Ext.Date.getWeekOfYear(now));
                                        }
                                    },
                                    {
                                        text: 'Due Next Week',
                                        filterGroup: 'Timeline',
                                        filterFn: function(rec) {
                                            var now = new Date(),
                                                due = rec.get('DueDate');

                                            return !due || (Ext.Date.getWeekOfYear(rec.get('DueDate')) !== Ext.Date.getWeekOfYear(now)+1);
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
                            }
                        }
                    ]
                }
            ]
        }
    ],

    tpl: [
        '<ul class="slate-tasktree-list">',

            '<tpl for="tasks">',
                '<li class="slate-tasktree-item <tpl if="subtasks">has-subtasks</tpl> slate-tasktree-status-{[ this.getDueStatusCls(values.DueDate) ]}" recordId="{ID}">',

                    '<div class="flex-ct">',
                        '<div class="slate-tasktree-nub <tpl if="subtasks">is-clickable</tpl>"></div>', // TODO: ARIA it up
                        '<div class="slate-tasktree-data">',
                            '<div class="slate-tasktree-category">{Category}</div>',
                            '<div class="slate-tasktree-text">',
                                '<div class="slate-tasktree-title">{Title}</div>',
                                '<div class="slate-tasktree-status">{[ this.getStatusString(values.TaskStatus) ]}</div>',
                                '<div class="slate-tasktree-date">{DueDate:date("M d, Y")}</div>',
                            '</div>',
                        '</div>',
                    '</div>',

                    '<tpl if="subtasks">',
                        '<ul class="slate-tasktree-sublist">',

                            '<tpl for="subtasks">',
                                '<li class="slate-tasktree-item slate-tasktree-status-{[ this.getDueStatusCls(values.DueDate,values.TaskStatus) ]}" recordId="{ID}">',

                                    '<div class="flex-ct">',
                                        '<div class="slate-tasktree-nub"></div>',
                                        '<div class="slate-tasktree-data">',
                                            '<div class="slate-tasktree-text">',
                                                '<div class="slate-tasktree-title">{Title}</div>',
                                                '<div class="slate-tasktree-status">{[ this.getStatusString(values.TaskStatus) ]}</div>',
                                                '<div class="slate-tasktree-date">{DueDate:date("M d, Y")}</div>',
                                            '</div>',
                                        '</div>',
                                    '</div>',

                                '</li>',
                            '</tpl>',

                        '</ul>',
                    '</tpl>',

                '</li>',
            '</tpl>',

        '</ul>',
        {
            getStatusString: function(taskStatus) {
                var statusStrings = {
                    'assigned': 'Due',
                    're-assigned': 'Revision',
                    'submitted': 'Submitted',
                    're-submitted': 'Resubmitted',
                    'completed': 'Completed'
                };

                return statusStrings[taskStatus] || '';
            },
            getDueStatusCls: function(due, taskStatus) {
                var now = new Date();

                if (due > now) {
                    if (taskStatus === 'completed') {
                        return 'completed';
                    } else {
                        return 'due';
                    }
                } else {
                    return 'late';
                }
            }
        }
    ],

    listeners: {
        scope: 'this',
        click: {
            fn: 'onTreeClick',
            element: 'el'
        }
    },

    afterTasksLoad: function() {
        var tree = this,
            sublists = tree.el.select('.slate-tasktree-sublist');

        sublists.each(function(sublist) {
            sublist.set({
                'data-natural-height': sublist.getHeight(),
                style: {
                    height: 0
                }
            });
        });
    },

    onTreeClick: function(ev, t) {
        var target = Ext.get(t),
            treeItem = target.up('.slate-tasktree-item'),
            sublist = treeItem.down('.slate-tasktree-sublist'),
            recordId;

        if (target.is('.slate-tasktree-nub.is-clickable') && treeItem && sublist) {
            var newHeight = treeItem.hasCls('is-expanded') ? 0 : sublist.getAttribute('data-natural-height');
            sublist.setHeight(newHeight);
            treeItem.toggleCls('is-expanded');
        } else {
            if (treeItem) {
                recordId = treeItem.dom.getAttribute('recordId');
                this.fireEvent('itemclick',recordId);
            }
        }
    }
});
