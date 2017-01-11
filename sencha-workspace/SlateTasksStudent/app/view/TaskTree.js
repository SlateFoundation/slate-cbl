Ext.define('SlateTasksStudent.view.TaskTree', {
    extend: 'Slate.cbl.widget.SimplePanel',
    xtype: 'slatetasksstudent-tasktree',

    config: {
        courseSection: null,
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

    /* eslint-disable indent */
    tpl: [
        '<ul class="slate-tasktree-list">',
            '<tpl for=".">',

                '<li class="slate-tasktree-item <tpl if="this.hasSubtasks(values)">has-subtasks</tpl> slate-tasktree-status-{[ this.getDueStatusCls(values) ]}" data-id="{data.ID}">',

                    '<div class="flex-ct">',
                        '<div class="slate-tasktree-nub <tpl if="this.hasSubtasks(values)">is-clickable</tpl>"></div>', // TODO: ARIA it up
                        '<div class="slate-tasktree-data">',
                            '<div class="slate-tasktree-category">{data.CourseSectionTitle}</div>',
                            '<div class="slate-tasktree-text">',
                                '<div class="slate-tasktree-title">{data.TaskTitle}</div>',
                                '<div class="slate-tasktree-status">{[ this.getStatusString(values) ]}</div>',
                                '<div class="slate-tasktree-date">{[ this.getStatusDate(values) ]}</div>',
                            '</div>',
                        '</div>',
                    '</div>',

                    '<tpl if="this.hasSubtasks(values)">',
                        '<ul class="slate-tasktree-sublist">',

                            '<tpl for="childNodes">',
                                '<li class="slate-tasktree-item slate-tasktree-status-{[ this.getDueStatusCls(values) ]}" data-id="{data.ID}">',

                                    '<div class="flex-ct">',
                                        '<div class="slate-tasktree-nub"></div>',
                                        '<div class="slate-tasktree-data">',
                                            '<div class="slate-tasktree-text">',
                                                '<div class="slate-tasktree-title">{data.TaskTitle}</div>',
                                                '<div class="slate-tasktree-status">{[ this.getStatusString(values) ]}</div>',
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

        /* eslint-enable indent */
        {
            hasSubtasks: function(rec) {
                return rec.childNodes && rec.childNodes.length > 0;
            },
            getStatusString: function(values) {
                var taskStatus = values.data.TaskStatus,
                    statusStrings = {
                        'assigned': 'Due',
                        're-assigned': 'Revision',
                        'submitted': 'Submitted',
                        're-submitted': 'Resubmitted',
                        'completed': 'Completed'
                    };

                return statusStrings[taskStatus] || '';
            },
            getStatusDate: function(values) {
                var taskStatus = values.data.TaskStatus,
                    taskDate;

                if (taskStatus === 'submitted' || taskStatus === 're-submitted' || taskStatus === 'completed') {
                    taskDate = values.data.SubmittedDate;
                } else {
                    taskDate = values.data.DueDate;
                }

                return Ext.Date.dateFormat(taskDate, 'M d, Y');
            },
            getDueStatusCls: function(task) {
                var activeStatuses = [
                        'assigned',
                        're-assigned',
                        'submitted',
                        're-submitted'
                    ],
                    statusClasses = this.statusClasses,
                    dueDate = task.data.DueDate,
                    status = task.data.TaskStatus,
                    now, endOfDueDate, isLate;

                if (dueDate) {
                    now = new Date();
                    endOfDueDate = new Date(dueDate);
                    // task is late after midnight of due date
                    endOfDueDate.setHours(23);
                    endOfDueDate.setMinutes(59);
                    endOfDueDate.setSeconds(59);

                    isLate = activeStatuses.indexOf(status) > -1 && endOfDueDate < now;
                }

                if (isLate) {
                    return statusClasses.late[status] || '';
                }
                return statusClasses[status] || '';
            },
            statusClasses: {

                'assigned': 'due',
                're-assigned': 'revision',

                'submitted': 'due needsrated',
                're-submitted': 'revision needsrated',

                'late': {
                    'submitted': 'late needsrated',
                    're-submitted': 'late needsrated',

                    'assigned': 'late',
                    're-assigned': 'late'
                },

                'completed': 'completed'
            }

/*
            getStatusCls: function(values) {
                var due = values.data.DueDate,
                    taskStatus = values.data.TaskStatus,
                    now = new Date(),
                    statusCls = 'due';

                if (taskStatus === 'completed') {
                    statusCls = 'completed';
                } else if (due < now) {
                    statusCls = 'late';
                }

                return statusCls;
            }
*/

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
            parentEl = target.up('.slate-tasktree-item'),
            recordId;

        if (target.is('.slate-tasktree-nub.is-clickable')) {
            parentEl.toggleCls('is-expanded');
            me.resizeSubtasksContainer(parentEl);
            me.resizeParentContainer();
        } else if (parentEl) {
            // console.log(parentEl.dom.getAttribute('data-id'));
            recordId = parseInt(parentEl.dom.getAttribute('data-id'), 10);
            me.fireEvent('itemclick', recordId);
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
