Ext.define('SlateTasksStudent.view.TaskTree', {
    extend: 'Slate.cbl.widget.SimplePanel',
    xtype: 'slatetasksstudent-tasktree',
    requires: [
        'SlateTasksStudent.view.TaskFiltersMenu'
    ],


    config: {
        courseSection: null,
        student: null,
        readOnly: false,

        statusClasses: {

            assigned: 'due',
            're-assigned': 'revision',

            submitted: 'due needsrated',
            're-submitted': 'revision needsrated',

            late: {
                submitted: 'late needsrated',
                're-submitted': 'late needsrated',

                assigned: 'late',
                're-assigned': 'late'
            },

            completed: 'completed'
        },
    },

    title: 'Current Tasks',

    cls: 'slate-tasktree',

    tools: [{
        text: 'Filter',
        menu: {
            xtype: 'slatetasksstudent-taskfiltersmenu'
        }
    }],

    tpl: [
        '<ul class="slate-tasktree-list">',
            '{% var statusClasses = values.statusClasses || new Object() %}',
            '<tpl for="tasks">',
                '<li class="slate-tasktree-item <tpl if="subtasks">has-subtasks</tpl> slate-tasktree-status-{[ this.getDueStatusCls(values, statusClasses) ]}" recordId="{ID}">',

                    '<div class="flex-ct">',
                        '<div class="slate-tasktree-nub <tpl if="subtasks">is-clickable</tpl>"></div>', // TODO: ARIA it up
                        '<div class="slate-tasktree-data">',
                            '<div class="slate-tasktree-category">{SectionTitle}</div>',
                            '<div class="slate-tasktree-text">',
                                '<div class="slate-tasktree-title">{Title}</div>',
                                '<div class="slate-tasktree-status <tpl if="!this.getStatusDate(values)">slate-tasktree-nodate</tpl>">{[ this.getStatusString(values.TaskStatus) ]}</div>',
                                '<div class="slate-tasktree-date">{[ this.getStatusDate(values) ]}</div>',
                            '</div>',
                        '</div>',
                    '</div>',

                    '<tpl if="subtasks">',
                        '<ul class="slate-tasktree-sublist">',

                            '<tpl for="subtasks">',
                                '<li class="slate-tasktree-item slate-tasktree-status-{[ this.getDueStatusCls(values, statusClasses) ]}" recordId="{ID}">',

                                    '<div class="flex-ct">',
                                        '<div class="slate-tasktree-nub"></div>',
                                        '<div class="slate-tasktree-data">',
                                            '<div class="slate-tasktree-text">',
                                                '<div class="slate-tasktree-title">{Title}</div>',
                                                '<div class="slate-tasktree-status">{[ this.getStatusString(values.TaskStatus) ]}</div>',
                                                '<div class="slate-tasktree-date<tpl if="!values.DueDate">-null</tpl>">{[ this.getStatusDate(values) ]}</div>',
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
            getDueStatusCls: function(data, statusClasses) {
                var activeStatuses = [
                        'assigned',
                        're-assigned',
                        'submitted',
                        're-submitted'
                    ],
                    dueDate = data.DueDate,
                    status = data.TaskStatus,
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

    applyData: function(data) {
        data.statusClasses = this.getStatusClasses();
        return data;
    },

    updateData: function(data) {
        this.update(data);
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
