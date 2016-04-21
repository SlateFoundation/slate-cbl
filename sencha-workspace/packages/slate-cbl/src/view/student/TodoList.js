Ext.define('Slate.cbl.view.student.TodoList', {
    extend: 'Slate.cbl.widget.SimplePanel',
    xtype: 'slate-todolist',
    requires:[
    ],

    config: {
    },

    componentCls: 'slate-todolist',

    title: 'To-Do List – Personal',

    data: [
        {
            title: 'Active',
            items: [
                {
                    title: 'Apply for scholarship by January 6th: https://scienceleadership.org/scholarship',
                    category: 'Mythbusters',
                    date: 'Jan 6, 2016',
                    status: 'late'
                },
                {
                    title: 'Email Mrs. Johnson about science hw',
                    category: 'Entrepeneurship',
                    date: 'May 31, 2016',
                    status: 'due'
                },
                {
                    title: 'Research internships and apply',
                    category: 'Narrative Writing Workshop',
                    date: 'July 1, 2018'
                }
            ]
        },
        {
            title: 'Completed',
            items: [
                {
                    title: 'Apply for scholarship by January 6th: https://scienceleadership.org/scholarship',
                    category: 'Mythbusters',
                    date: 'Jan 6, 2016',
                    completed: true
                },
                {
                    title: 'Email Mrs. Johnson about science hw',
                    category: 'Entrepeneurship',
                    date: 'May 31, 2016',
                    completed: true
                },
                {
                    title: 'Research internships and apply',
                    category: 'Narrative Writing Workshop',
                    date: 'July 1, 2018',
                    completed: true
                }
            ]
        }
    ],

    tpl: [
        '<tpl for=".">',
            '<section class="slate-todolist-itemgroup">',
                '<header class="slate-todolist-itemgroup-header">',
                    '<h4 class="slate-todolist-itemgroup-title">{title} Items</h4>',
                '</header>',
                '<ul class="slate-todolist-list">',
                    '<tpl for="items">',
                        '<li class="slate-todolist-item <tpl if="status">slate-todolist-status-{status}</tpl>">',
                            // TODO use better ID?
                            '<input id="todo-item-{#}" class="slate-todolist-item-checkbox" type="checkbox" <tpl if="completed">checked</tpl>>',
                            '<div class="slate-todolist-item-text">',
                                '<label for="todo-item-{#}" class="slate-todolist-item-title">{title}</label>',
                                '<div class="slate-todolist-item-category">{category}</div>',
                            '</div>',
                            '<div class="slate-todolist-item-date">{date:date("M j, Y")}</div>',
                        '</li>',
                    '</tpl>',
                '</ul>',
            '</section>',
        '</tpl>'
    ]
});