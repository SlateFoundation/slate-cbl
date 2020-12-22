Ext.define('SlateTasksStudent.view.TaskTree', {
    extend: 'Slate.ui.SimplePanel',
    xtype: 'slate-tasks-student-tasktree',
    requires: [
        'SlateTasksStudent.view.TaskFiltersMenu',

        /* global Slate */
        'Slate.cbl.model.tasks.StudentTask'
    ],


    config: {
        store: null
    },


    title: 'Current Tasks',
    cls: 'slate-tasktree',

    tools: [{
        text: 'Filter',
        menu: {
            xtype: 'slate-tasks-student-taskfiltersmenu'
        }
    }],

    listeners: {
        scope: 'this',
        click: {
            fn: 'onTreeClick',
            element: 'el'
        },
        transitionend: {
            fn: 'onTransitionEnd',
            element: 'el',
            buffer: 10
        }
    },

    tpl: [
        '<tpl if="studentTasks.length">',
            '<ul class="slate-tasktree-list">',
                '<tpl for="studentTasks">',
                    '<li class="slate-tasktree-item <tpl if="subTasks.length">has-subtasks</tpl> slate-tasktree-status-{[ this.getDueStatusCls(values.studentTask) ]} <tpl if="expanded">is-expanded</tpl>" data-id="{studentTask.ID}">',

                        '<div class="flex-ct">',
                            '<div class="slate-tasktree-nub <tpl if="subTasks.length">is-clickable</tpl>"></div>', // TODO: ARIA it up
                            '<div class="slate-tasktree-data">',
                                '<tpl if="parent.showSection">',
                                    '<div class="slate-tasktree-category">{studentTask.Task.Section.Title}</div>',
                                '</tpl>',
                                '<div class="slate-tasktree-text">',
                                    '<div class="slate-tasktree-title">{studentTask.TaskTitle}</div>',
                                    '<div class="slate-tasktree-status <tpl if="!this.getStatusDate(values.studentTask)">slate-tasktree-nodate</tpl>">{[ this.getStatusString(values.studentTask.TaskStatus) ]}</div>',
                                    '<div class="slate-tasktree-date">{[ this.getStatusDate(values.studentTask) ]}</div>',
                                '</div>',
                            '</div>',
                        '</div>',

                        '<tpl if="subTasks.length">',
                            '<ul class="slate-tasktree-sublist">',

                                '<tpl for="subTasks">',
                                    '<li class="slate-tasktree-item slate-tasktree-status-{[ this.getDueStatusCls(values) ]}" data-id="{ID}">',

                                        '<div class="flex-ct">',
                                            '<div class="slate-tasktree-nub"></div>',
                                            '<div class="slate-tasktree-data">',
                                                '<div class="slate-tasktree-text">',
                                                    '<div class="slate-tasktree-title">{TaskTitle}</div>',
                                                    '<div class="slate-tasktree-status <tpl if="!this.getStatusDate(values)">slate-tasktree-nodate</tpl>">{[ this.getStatusString(values.TaskStatus) ]}</div>',
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
        '<tpl else>',
            '<div class="empty-text">No tasks found</div>',
        '</tpl>',
        {
            getStatusString: function(taskStatus) {
                return Slate.cbl.model.tasks.StudentTask.statusStrings[taskStatus] || '';
            },
            getStatusDate: function(studentTaskData) {
                var taskStatus = studentTaskData.TaskStatus,
                    taskDate;

                if (taskStatus == 'submitted' || taskStatus == 're-submitted') {
                    taskDate = studentTaskData.Submitted;
                } else {
                    taskDate = studentTaskData.EffectiveDueDate;
                }

                return Ext.Date.dateFormat(taskDate, 'M d, Y');
            },
            getDueStatusCls: function(studentTask) {
                return Slate.cbl.model.tasks.StudentTask[studentTask.IsLate ? 'lateStatusClasses' : 'statusClasses'][studentTask.TaskStatus] || '';
            }
        }
    ],


    // config handlers
    applyStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateStore: function(store, oldStore) {
        if (oldStore) {
            oldStore.un({
                beforeload: 'onBeforeStoreLoad',
                load: 'onStoreLoad',
                refresh: 'refresh',
                update: 'refresh',
                scope: this
            });
        }

        if (store) {
            store.on({
                beforeload: 'onBeforeStoreLoad',
                load: 'onStoreLoad',
                refresh: 'refresh',
                update: 'refresh',
                scope: this
            });
        }
    },


    // component lifecycle
    initComponent: function() {
        var me = this;

        me.callParent();

        me.refresh = Ext.Function.createBuffered(me.refresh, 50);

        me.expandedTasks = {};
    },


    // event handlers
    onBeforeStoreLoad: function() {
        this.addCls('is-loading');
        this.setLoading('Loading Tasks&hellip;');
    },

    onStoreLoad: function() {
        this.removeCls('is-loading');
        this.setLoading(false);
    },

    onTreeClick: function(ev, t) {
        var me = this,
            target = Ext.get(t),
            parentEl = target.up('.slate-tasktree-item'),
            taskId;

        if (target.is('.slate-tasktree-nub.is-clickable')) {
            taskId = parentEl.getAttribute('data-id');
            parentEl.toggleCls('is-expanded', me.expandedTasks[taskId] = !me.expandedTasks[taskId]);
        } else if (parentEl) {
            me.fireEvent('itemclick', me, me.getStore().getById(parentEl.getAttribute('data-id')), parentEl);
        }
    },

    onTransitionEnd: function() {
        this.updateLayout();
    },


    // member methods
    refresh: function() {
        var me = this,
            expandedTasks = me.expandedTasks,
            store = me.getStore(),
            items = [],

            parentTasks = store.queryBy(function(studentTask) {
                return !studentTask.get('Task').ParentTaskID;
            }),
            parentTaskIds = parentTasks.collect('TaskID'),
            parentTasksLength = parentTasks.getCount(),
            parentTasksIndex = 0,

            orphanedTasks = store.queryBy(function(studentTask) {
                return parentTaskIds.indexOf(studentTask.get('TaskID')) === -1;
            }),
            orphanedTasksLength = orphanedTasks.getCount(),
            orphanedTasksIndex = 0,
            parentTask, parentTaskId, subTasks;

        for (; orphanedTasksIndex < orphanedTasksLength; orphanedTasksIndex++) {
            items.push({
                studentTask: orphanedTasks.getAt(orphanedTasksIndex).getData()
            });
        }

        // build tree of top-level tasks and subtasks
        for (; parentTasksIndex < parentTasksLength; parentTasksIndex++) {
            parentTask = parentTasks.getAt(parentTasksIndex);
            parentTaskId = parentTask.get('TaskID');

            subTasks = store.queryBy(function(studentTask) { // eslint-disable-line no-loop-func
                return studentTask.get('Task').ParentTaskID == parentTaskId;
            });

            items.push({
                studentTask: parentTask.getData(),
                expanded: Boolean(expandedTasks[parentTask.getId()]),
                subTasks: Ext.Array.pluck(subTasks.getRange(), 'data')
            });
        }

        items = items.sort(function(taskA, taskB) {
            taskADue = taskA.studentTask.EffectiveDueDate;
            taskBDue = taskB.studentTask.EffectiveDueDate;

            if (taskADue === taskBDue) {
                if (taskA.studentTask.Task.Title === taskB.studentTask.Task.Title) {
                    return 0;
                }

                return ('' + taskA.studentTask.Task.Title).localeCompare(taskB.studentTask.Task.Title);
            }

            if (!taskADue || !taskBDue) {
                if (!taskADue) {
                    return 1;
                }

                return -1;
            }

            return taskADue - taskBDue;
        });

        // render markup
        me.setData({
            studentTasks: items,
            showSection: !store.getSection()
        });

        // sync heights for animated expansion
        me.syncSublistHeights();
    },

    syncSublistHeights: function() {
        var me = this,
            sublistEls, sublistElsLength, sublistElIndex = 0, sublistEl, sublistHeight,
            listItemEls, listItemElsLength, listItemElIndex,
            sublistHeights = [], sublistHeightsLength, sublistHeightIndex = 0;

        if (!me.rendered) {
            me.on('render', 'syncSublistHeights', me, { single: true });
            return;
        }

        // READ PHASE: sum heights of items in each sublist
        sublistEls = me.el.query('.slate-tasktree-sublist', false);
        sublistElsLength = sublistEls.length;

        for (; sublistElIndex < sublistElsLength; sublistElIndex++) {
            sublistEl = sublistEls[sublistElIndex];
            sublistHeight = 0;

            listItemEls = sublistEl.query('.slate-tasktree-item', false);
            listItemElsLength = listItemEls.length;
            listItemElIndex = 0;

            for (; listItemElIndex < listItemElsLength; listItemElIndex++) {
                sublistHeight += listItemEls[listItemElIndex].getHeight();
            }

            sublistHeights.push({
                el: sublistEl,
                height: sublistHeight
            });
        }

        // WRITE PHASE: set heights of sublists to item sums
        sublistHeightsLength = sublistHeights.length;

        for (; sublistHeightIndex < sublistHeightsLength; sublistHeightIndex++) {
            sublistHeight = sublistHeights[sublistHeightIndex];
            sublistHeight.el.setHeight(sublistHeight.height);
        }
    }
});
