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

    componentCls: 'slate-tasktree',

    data: {
        tasks: [
            {
                id: 0,
                category: 'Mythbusters',
                title: 'Gravity Lab Report',
                status: 'late',
                date: 'Jan 5'
            },
            {
                id: 1,
                category: 'Narrative Writing Workshop',
                title: 'My Autobiography',
                status: 'revision',
                date: 'Jan 15'
            },
            {
                id: 2,
                category: 'Entrepeneurship',
                title: 'Business Plan',
                status: 'due',
                date: 'Jan 22',
                subtasks: [
                    {
                        id: 3,
                        title: 'Peer Review',
                        status: 'due',
                        date: 'Jan 15'
                    },
                    {
                        id: 4,
                        title: 'Middle East Timeline',
                        status: 'revision',
                        date: 'Jan 15'
                    },
                    {
                        id: 5,
                        title: 'Summary of New York Times article, with a really long task title that will have to wrap',
                        status: 'due',
                        date: 'Feb 2'
                    }
                ]
            },
            {
                id: 6,
                category: 'Entrepeneurship',
                title: 'Business Plan',
                status: 'due',
                date: 'Jan 22',
                subtasks: [
                    {
                        id: 7,
                        title: 'Peer Review',
                        status: 'due',
                        date: 'Jan 15'
                    },
                    {
                        id: 8,
                        title: 'Middle East Timeline',
                        status: 'revision',
                        date: 'Jan 15'
                    },
                    {
                        id: 9,
                        title: 'Summary of New York Times article, with a really long task title that will have to wrap',
                        status: 'due',
                        date: 'Feb 2'
                    }
                ]
            }
        ]
    },

    tpl: [
        '<ul class="slate-tasktree-list">',

            '<tpl for="tasks">',
                '<li class="slate-tasktree-item <tpl if="subtasks">has-subtasks</tpl> slate-tasktree-status-{status}">',

                    '<div class="flex-ct">',
                        '<div class="slate-tasktree-nub <tpl if="subtasks">is-clickable</tpl>"></div>', // TODO: ARIA it up
                        '<div class="slate-tasktree-data">',
                            '<div class="slate-tasktree-category">{category}</div>',
                            '<div class="slate-tasktree-text">',
                                '<div class="slate-tasktree-title">{title}</div>',
                                '<div class="slate-tasktree-status">{[ this.getStatusString(values.status) ]}</div>',
                                '<div class="slate-tasktree-date">{date}</div>',
                            '</div>',
                        '</div>',
                    '</div>',
                    
                    '<tpl if="subtasks">',
                        '<ul class="slate-tasktree-sublist">',

                            '<tpl for="subtasks">',
                                '<li class="slate-tasktree-item <tpl if="subtasks">has-subtasks</tpl> slate-tasktree-status-{status}">',                

                                    '<div class="flex-ct">',
                                        '<div class="slate-tasktree-nub"></div>',
                                        '<div class="slate-tasktree-data">',
                                            '<div class="slate-tasktree-text">',
                                                '<div class="slate-tasktree-title">{title}</div>',
                                                '<div class="slate-tasktree-status">{[ this.getStatusString(values.status) ]}</div>',
                                                '<div class="slate-tasktree-date">{date}</div>',
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
            getStatusString: function(key) {
                var statusStrings = {
                    due: 'Due',
                    late: 'Past Due',
                    revision: 'Revision Due'
                };
    
                return statusStrings[key] || '';
            }
        }
    ],

    listeners: {
        scope: 'this',
        click: {
            fn: 'onTreeClick',
            element: 'el',
            delegate: '.slate-tasktree-nub.is-clickable'
        }
    },

    onTreeClick: function(ev, t) {
        var target = Ext.get(t);

        if (target.is('.slate-tasktree-nub.is-clickable')) {
            var tree = this.el,
                treeItem = target.up('.slate-tasktree-item');

            treeItem.toggleCls('is-expanded');
        }
    }
});