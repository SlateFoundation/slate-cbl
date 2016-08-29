Ext.define('SlateTasksStudent.view.TaskTree', {
    extend: 'Slate.cbl.widget.SimplePanel',
    xtype: 'slatetasksstudent-tasktree',

    config: {
        courseSection: null,
        student: null,
        readOnly: false
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
                '<li class="slate-tasktree-item <tpl if="subtasks">has-subtasks</tpl> slate-tasktree-status-{[ this.getDueStatusCls(values.DueDate, values.TaskStatus) ]}" recordId="{ID}">',

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
                var dueEndOfDay = new Date(due.getTime()),
                    now = new Date(),
                    statusCls = 'due';

                dueEndOfDay.setHours(23, 59, 59, 999);

                if (dueEndOfDay < now) {
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
            parentEl, recordId;

        if (target.is('.slate-tasktree-nub.is-clickable')) {
            parentEl = target.up('.slate-tasktree-item');
            parentEl.toggleCls('is-expanded');
            me.resizeSubtasksContainer(parentEl);
            me.resizeParentContainer();
        } else {
            parentEl = target.up('.slate-tasktree-item');
            if (parentEl) {
                recordId = parentEl.dom.getAttribute('recordId');
                me.fireEvent('itemclick', recordId);
            }
        }
    },


    // custom methods
    /*
     * TODO: This seems hacky to me.  If the height of the subtasks can't be correctly sized in CSS, I'd prefer handling
     * subitem expansion with Ext.Dom visibility methods as is currently implemeted in the Todo list.
     */
    resizeSubtasksContainer: function(parentTaskEl) {
        var subtasks,
            subtasksLength,
            subtasksHeight = 0,
            i = 0;

        if (parentTaskEl.hasCls('is-expanded')) {
            subtasks = parentTaskEl.query('.slate-tasktree-item', false);
            subtasksLength = subtasks.length;

            for (; i<subtasksLength; i++) {
                subtasksHeight += subtasks[i].getHeight() + 1;
            }

            parentTaskEl.down('ul').setHeight(subtasksHeight);

        } else {
            parentTaskEl.down('ul').setHeight(0);
        }
    },

    resizeParentContainer: function() {
        var me = this,
            doc = document.documentElement,
            currentScroll = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

        Ext.Function.defer(function() {
            me.up('container').updateLayout();
            window.scrollTo(0, currentScroll);
        }, 200);
    }
});
