Ext.define('SlateTasksStudent.view.TaskTree', {
    extend: 'Slate.cbl.widget.SimplePanel',
    xtype: 'slate-tasktree',
    requires:[
    ],

    config: {
        statusStrings: {
            due: 'Due',
            late: 'Past Due',
            revision: 'Revision Due'
        }
    },

    title: 'Current Tasks',
    showTools: true,

    componentCls: 'slate-tasktree',

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
                                '<div class="slate-tasktree-status">{[ this.getDueStatusString(values.DueDate) ]}</div>',
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
                                                '<div class="slate-tasktree-status">{[ this.getDueStatusString(values.DueDate) ]}</div>',
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
            getDueStatusString: function(due, taskStatus) {
                var now = new Date();

                if (due > now) {
                    if (taskStatus === 'revision') {
                        return 'Revision Due';
                    } else {
                        return 'Due';
                    }
                } else {
                    return 'Past Due';
                }
            },
            getDueStatusCls: function(due, taskStatus) {
                var now = new Date();

                console.log(taskStatus);

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

    onTreeClick: function(ev, t) {
        var target = Ext.get(t),
            parentEl,recordId;

        if (target.is('.slate-tasktree-nub.is-clickable')) {
            target.up('.slate-tasktree-item').toggleCls('is-expanded');
        } else {
            parentEl = target.up('.slate-tasktree-item');
            recordId = parentEl.dom.getAttribute('recordId');
            this.fireEvent('itemclick',recordId);
        }
    }
});
