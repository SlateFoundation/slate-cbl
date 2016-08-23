Ext.define('SlateTasksStudent.view.TaskTree', {
    extend: 'Slate.cbl.widget.SimplePanel',
    xtype: 'slatetasksstudent-tasktree',

    config: {
        courseSection: null
    },

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
                    items: [{
                        xtype: 'button',
                        ui: 'light',
                        text: 'Filter',
                        itemId: 'filter',
                        menu: {
                            xtype: 'slatetasksstudent-taskfilters'
                        }
                    }]
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
                            '<div class="slate-tasktree-category">{SectionTitle}</div>',
                            '<div class="slate-tasktree-text">',
                                '<div class="slate-tasktree-title">{Title}</div>',
                                '<div class="slate-tasktree-status">{[ this.getStatusString(values.TaskStatus) ]}</div>',
                                '<div class="slate-tasktree-date">{[ this.getStatusDate(values) ]}</div>',
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
                                                '<div class="slate-tasktree-date">{[ this.getStatusDate(values) ]}</div>',
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
            getStatusDate: function(taskData) {
                var taskStatus = taskData.TaskStatus,
                    taskDate;

                if (taskStatus === 'submitted' || taskStatus === 're-submitted') {
                    taskDate = taskData.Submitted;
                } else {
                    taskDate = taskData.DueDate;
                }

                return Ext.Date.dateFormat(taskDate, 'M d, Y');
            },
            getDueStatusCls: function(due, taskStatus) {
                var now = new Date(),
                    statusCls = 'due';

                if (due < now) {
                    statusCls = 'late';
                } else if (taskStatus === 'completed') {
                    return 'completed';
                } else {
                    return 'due';
                }

                return statusCls;
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

    // config handlers
    updateCourseSection: function(val) {
        var me = this;

        me.fireEvent('coursesectionchange', me, val);
    },

    // event handlers
    onTreeClick: function(ev, t) {
        var me = this,
            target = Ext.get(t),
            treeItem = target.up('.slate-tasktree-item'),
            sublist = treeItem && treeItem.down('.slate-tasktree-sublist');

        if (target.is('.slate-tasktree-nub.is-clickable') && sublist) {
            sublist.setHeight(treeItem.hasCls('is-expanded') ? 0 : sublist.getAttribute('data-natural-height') + 'px');
            treeItem.toggleCls('is-expanded');
            Ext.defer(me.updateLayout, 275, me);
        } else if (target.is('.slate-tasktree-nub')) {
            ev.stopEvent();
        } else if (treeItem) {
            me.fireEvent('itemclick', me, parseInt(treeItem.getAttribute('recordId'), 10));
        }
    },

    afterTasksLoad: function() {
        var me = this,
            sublists;

        if (!me.rendered) {
            me.on('render', 'afterTasksLoad', me, { single: true });
            return;
        }

        sublists = me.el.select('.slate-tasktree-sublist');

        sublists.each(function(sublist) {
            sublist.set({
                'data-natural-height': sublist.getHeight()
            });
        });

        sublists.setHeight(0);

        me.updateLayout();
    }
});
