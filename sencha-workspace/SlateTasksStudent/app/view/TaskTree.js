/* global SlateTasksStudent */
Ext.define('SlateTasksStudent.view.TaskTree', {
    extend: 'Slate.cbl.widget.SimplePanel',
    xtype: 'slatetasksstudent-tasktree',
    requires: [
        'SlateTasksStudent.view.TaskFiltersMenu'
    ],


    statics: {
        statusClasses: {
            'assigned': 'due',
            're-assigned': 'revision',
            'submitted': 'due needsrated',
            're-submitted': 'revision needsrated',
            'completed': 'completed'
        },
        lateStatusClasses: {
            'submitted': 'late needsrated',
            're-submitted': 'late needsrated',

            'assigned': 'late',
            're-assigned': 'late'
        },
        statusStrings: {
            'assigned': 'Due',
            're-assigned': 'Revision',
            'submitted': 'Submitted',
            're-submitted': 'Resubmitted',
            'completed': 'Completed'
        },
        activeStatuses: [
            'assigned',
            're-assigned',
            'submitted',
            're-submitted'
        ]
    },

    config: {
        student: null,
        courseSection: null,
        readOnly: false,
        store: null
    },

    title: 'Current Tasks',
    cls: 'slate-tasktree',

    tools: [{
        text: 'Filter',
        menu: {
            xtype: 'slatetasksstudent-taskfiltersmenu'
        }
    }],

    listeners: {
        scope: 'this',
        click: {
            fn: 'onTreeClick',
            element: 'el'
        }
    },

    tpl: [
        '{% var now = new Date() %}',

        '<ul class="slate-tasktree-list">',

        '    <tpl if="values.length == 0">',
        '        <em>No tasks found</em>',
        '    </tpl>',

        '    <tpl for=".">',
        '        <li class="slate-tasktree-item <tpl if="subTasks.length">has-subtasks</tpl> slate-tasktree-status-{[ this.getDueStatusCls(values.task, now) ]}" recordId="{task.ID}">',

        '            <div class="flex-ct">',
        '                <div class="slate-tasktree-nub <tpl if="subTasks.length">is-clickable</tpl>"></div>', // TODO: ARIA it up
        '                <div class="slate-tasktree-data">',
        '                    <div class="slate-tasktree-category">{task.SectionTitle}</div>',
        '                    <div class="slate-tasktree-text">',
        '                        <div class="slate-tasktree-title">{task.Title}</div>',
        '                        <div class="slate-tasktree-status <tpl if="!this.getStatusDate(values.task)">slate-tasktree-nodate</tpl>">{[ this.getStatusString(values.task.TaskStatus) ]}</div>',
        '                        <div class="slate-tasktree-date">{[ this.getStatusDate(values.task) ]}</div>',
        '                    </div>',
        '                </div>',
        '            </div>',

        '            <tpl if="subTasks.length">',
        '                <ul class="slate-tasktree-sublist">',

        '                    <tpl for="subTasks">',
        '                        <li class="slate-tasktree-item slate-tasktree-status-{[ this.getDueStatusCls(values, now) ]}" recordId="{ID}">',

        '                            <div class="flex-ct">',
        '                                <div class="slate-tasktree-nub"></div>',
        '                                <div class="slate-tasktree-data">',
        '                                    <div class="slate-tasktree-text">',
        '                                        <div class="slate-tasktree-title">{Title}</div>',
        '                                        <div class="slate-tasktree-status">{[ this.getStatusString(values.TaskStatus) ]}</div>',
        '                                        <div class="slate-tasktree-date<tpl if="!values.DueDate">-null</tpl>">{[ this.getStatusDate(values) ]}</div>',
        '                                    </div>',
        '                                </div>',
        '                            </div>',

        '                        </li>',
        '                    </tpl>',

        '                </ul>',
        '            </tpl>',

        '        </li>',
        '    </tpl>',
        '</ul>',
        {
            getStatusString: function(taskStatus) {
                return SlateTasksStudent.view.TaskTree.statusStrings[taskStatus] || '';
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
            getDueStatusCls: function(task, now) {
                var self = SlateTasksStudent.view.TaskTree,
                    dueTime = task.DueTime,
                    status = task.TaskStatus;

                if (dueTime && self.activeStatuses.indexOf(status) > -1 && dueTime < now) {
                    return self.lateStatusClasses[status] || '';
                }

                return self.statusClasses[status] || '';
            }
        }
    ],


    // config handlers
    updateCourseSection: function(section, oldSection) {
        var me = this;

        me.fireEvent('coursesectionchange', me, section, oldSection);
    },

    applyStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateStore: function(store, oldStore) {
        if (oldStore) {
            oldStore.un({
                beforeload: 'onBeforeStoreLoad',
                load: 'onStoreLoad',
                scope: this
            });
        }

        if (store) {
            store.on({
                beforeload: 'onBeforeStoreLoad',
                load: 'onStoreLoad',
                scope: this
            });
        }
    },


    // event handlers
    onBeforeStoreLoad: function() {
        this.mask('Loading Tasks');
    },

    onStoreLoad: function() {
        this.refresh();
        this.unmask();
    },

    onTreeClick: function(ev, t) {
        var me = this,
            target = Ext.get(t),
            parentEl, recordId;

        if (target.is('.slate-tasktree-nub.is-clickable')) {
            parentEl = target.up('.slate-tasktree-item');
            parentEl.toggleCls('is-expanded');
            // me.resizeSubtasksContainer(parentEl);
            // me.resizeParentContainer();
        } else {
            parentEl = target.up('.slate-tasktree-item');
            if (parentEl) {
                recordId = parentEl.dom.getAttribute('recordId');
                me.fireEvent('itemclick', recordId);
            }
        }
    },


    // custom methods
    refresh: function() {
        var me = this,
            store = me.getStore(),
            items = [],

            rootTasks = store.queryBy(function(task) {
                return !task.get('ParentTaskID');
            }),
            rootTasksLength = rootTasks.getCount(),
            rootTasksIndex = 0,
            rootTask, rootTaskId, subTasks;

        for (; rootTasksIndex < rootTasksLength; rootTasksIndex++) {
            rootTask = rootTasks.getAt(rootTasksIndex);
            rootTaskId = rootTask.get('TaskID');

            subTasks = store.queryBy(function(task) { // eslint-disable-line no-loop-func
                return task.get('ParentTaskID') == rootTaskId && !task.get('filtered');
            });

            if (subTasks.getCount() > 0) {
                rootTask.set('filtered', false); // do not filter parent tasks that have unfiltered subtasks
            }

            if (!rootTask.get('filtered')) {
                items.push({
                    task: rootTask.getData(),
                    subTasks: Ext.Array.pluck(subTasks.getRange(), 'data')
                });
            }
        }

        me.setData(items);
    },

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
