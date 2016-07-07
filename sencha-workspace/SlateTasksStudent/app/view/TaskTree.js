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

//TODO: remove this test data when no longer needed for reference
/*
    data: {
        tasks: [
            {
                ID: 0,
                Category: 'Mythbusters',
                Title: 'Gravity Lab Report',
                Status: 'late',
                DueDate: 'Jan 5'
            },
            {
                ID: 1,
                Category: 'Narrative Writing Workshop',
                Title: 'My Autobiography',
                Status: 'revision',
                DueDate: 'Jan 15'
            },
            {
                Id: 2,
                Category: 'Entrepeneurship',
                Title: 'Business Plan',
                Status: 'due',
                DueDate: 'Jan 22',
                subtasks: [
                    {
                        ID: 3,
                        Title: 'Peer Review',
                        Status: 'due',
                        DueDate: 'Jan 15'
                    },
                    {
                        ID: 4,
                        Title: 'Middle East Timeline',
                        Status: 'revision',
                        DueDate: 'Jan 15'
                    },
                    {
                        ID: 5,
                        Title: 'Summary of New York Times article, with a really long task title that will have to wrap',
                        Status: 'due',
                        DueDate: 'Feb 2'
                    }
                ]
            },
            {
                ID: 6,
                Category: 'Entrepeneurship',
                Title: 'Business Plan',
                Status: 'due',
                DueDate: 'Jan 22',
                subtasks: [
                    {
                        ID: 7,
                        Title: 'Peer Review',
                        Status: 'due',
                        DueDate: 'Jan 15'
                    },
                    {
                        ID: 8,
                        Title: 'Middle East Timeline',
                        Status: 'revision',
                        DueDate: 'Jan 15'
                    },
                    {
                        ID: 9,
                        Title: 'Summary of New York Times article, with a really long task title that will have to wrap',
                        Status: 'due',
                        DueDate: 'Feb 2'
                    }
                ]
            }
        ]
    },
*/

    tpl: [
        '<ul class="slate-tasktree-list">',

            '<tpl for="tasks">',
                '<li class="slate-tasktree-item <tpl if="subtasks">has-subtasks</tpl> slate-tasktree-status-{Status}">',

                    '<div class="flex-ct">',
                        '<div class="slate-tasktree-nub <tpl if="subtasks">is-clickable</tpl>"></div>', // TODO: ARIA it up
                        '<div class="slate-tasktree-data">',
                            '<div class="slate-tasktree-category">{Category}</div>',
                            '<div class="slate-tasktree-text">',
                                '<div class="slate-tasktree-title">{Title}</div>',
                                '<div class="slate-tasktree-status">{[ this.getStatusString(values.Status) ]}</div>',
                                '<div class="slate-tasktree-date">{DueDate:date("M d, Y")}</div>',
                            '</div>',
                        '</div>',
                    '</div>',

                    '<tpl if="subtasks">',
                        '<ul class="slate-tasktree-sublist">',

                            '<tpl for="subtasks">',
                                '<li class="slate-tasktree-item <tpl if="subtasks">has-subtasks</tpl> slate-tasktree-status-{Status}">',

                                    '<div class="flex-ct">',
                                        '<div class="slate-tasktree-nub"></div>',
                                        '<div class="slate-tasktree-data">',
                                            '<div class="slate-tasktree-text">',
                                                '<div class="slate-tasktree-title">{Title}</div>',
                                                '<div class="slate-tasktree-status">{[ this.getStatusString(values.Status) ]}</div>',
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
