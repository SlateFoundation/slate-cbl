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

            '<tpl for=".">',

                '<li class="slate-tasktree-item <tpl if="this.hasSubtasks(values)">has-subtasks</tpl> slate-tasktree-status-{[ this.getStatusCls(values) ]}" data-id="{data.ID}">',

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
                                '<li class="slate-tasktree-item slate-tasktree-status-{[ this.getStatusCls(values) ]}" data-id="{data.ID}">',

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
        {
            hasSubtasks: function(values) {
                return values.childNodes.length > 0;
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

                if (taskStatus === 'submitted' || taskStatus === 're-submitted') {
                    taskDate = values.data.Submitted;
                } else {
                    taskDate = values.data.DueDate;
                }

                return Ext.Date.dateFormat(taskDate, 'M d, Y');
            },
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
        var target = Ext.get(t),
            parentEl, recordId;

        if (target.is('.slate-tasktree-nub.is-clickable')) {
            target.up('.slate-tasktree-item').toggleCls('is-expanded');
        } else {
            parentEl = target.up('.slate-tasktree-item');
            if (parentEl) {
                console.log(parentEl.dom.getAttribute('data-id'));
                recordId = parseInt(parentEl.dom.getAttribute('data-id'), 10);
                this.fireEvent('itemclick', recordId);
            }
        }
    }

});
