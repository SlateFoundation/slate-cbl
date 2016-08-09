Ext.define('SlateTasksStudent.view.TodoList', {
    extend: 'Slate.cbl.widget.SimplePanel',
    xtype: 'slatetasksstudent-todolist',
    requires:[
    ],

    config: {
    },

    componentCls: 'slate-todolist',

    title: 'To-Do List – Personal',

    listeners: {
        click: {
            element: 'el',
            delegate: '.slate-todolist-item-checkbox',
            fn: 'onCheckboxClick'
        },
        keypress: {
            element: 'el',
            delegate: 'input.slate-todolist-item-title',
            fn: 'onTextFieldKeypress'
        }
    },

    tpl: [
    '<tpl for=".">',
        '<div class="slate-simplepanel-header">To-Do List - {section}</div>',
        '<tpl for="todos">',
            '<tpl exec="values.parent = parent;"></tpl>', // access to parent when 2 deep
            '<section class="slate-todolist-itemgroup">',
                '<header class="slate-todolist-itemgroup-header">',
                    '<h4 class="slate-todolist-itemgroup-title">{Title}</h4>',
                    '<tpl if="buttons">',
                        '<ul class="slate-todolist-itemgroup-actions">',
                        '<tpl for="buttons">',
                            '<li class="slate-todolist-itemgroup-action">',
                                '<button><tpl if="icon"><i class="fa fa-{icon}"></i>&nbsp;</tpl>{text}</button>',
                            '</li>',
                        '</tpl>',
                    '</tpl>',
                '</header>',
                '<ul class="slate-todolist-list">',
                    '<tpl for="items">',
                        '<li class="slate-todolist-item <tpl if="status">slate-todolist-status-{status}</tpl>">',
                            '<input id="todo-item-{ID}" class="slate-todolist-item-checkbox" data-parent-id="{parent.parent.ID}" data-id="{ID}" type="checkbox" <tpl if="Completed">checked</tpl>>',
                            '<div class="slate-todolist-item-text">',
                                '<label for="todo-item-{ID}" class="slate-todolist-item-title">{Description}</label>',
                            '</div>',
                            '<div class="slate-todolist-item-date">{DueDate:date("M j, Y")}</div>',
                        '</li>',
                    '</tpl>',
                    '<tpl if="canAdd">',
                        '<li class="slate-todolist-item slate-todolist-blank-item slate-todolist-blank-item-{parent.ID}">',
                            '<input id="todo-item-new-{parent.ID}" class="slate-todolist-item-checkbox" type="checkbox" disabled>',
                            '<div class="slate-todolist-item-text">',
                                '<input id="todo-item-new-text-{parent.ID}" class="slate-todolist-item-title" placeholder="New task&hellip;" data-parent-id="{parent.ID}">',
                            '</div>',
                            '<div class="slate-todolist-item-date">',
                                '<input id="todo-item-new-date-{parent.ID}" type="date" data-parent-id="{parent.ID}">',
                            '</div>',
                        '</li>',
                    '</tpl>',
                '</ul>',
            '</section>',
        '</tpl>',
    '</tpl>'
    ],

    onCheckboxClick: function(evt, el) {
        this.fireEvent('checkclick', this, el.getAttribute('data-parent-id'), el.getAttribute('data-id'),el.checked);
    },

    onTextFieldKeypress: function(evt, el) {
        if (evt.getKey() == evt.ENTER) {
            this.fireEvent('enterkeypress', this, el.getAttribute('data-parent-id'));
        }
    }

});
