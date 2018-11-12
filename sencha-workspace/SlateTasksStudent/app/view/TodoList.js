Ext.define('SlateTasksStudent.view.TodoList', {
    extend: 'Ext.Component',
    xtype: 'slate-tasks-student-todolist',
    requires: [
        'Slate.ui.SimplePanel' // using its CSS classes
    ],


    config: {
        store: null,
        readOnly: false
    },


    componentCls: 'slate-todolist',
    minHeight: 150,

    listeners: {
        click: {
            element: 'el',
            fn: 'onElClick',
            delegate: [
                '.slate-todolist-item-checkbox',
                '.slate-simplepanel-header',
                '.slate-todolist-itemgroup-action button'
            ].join()
        },
        keypress: {
            element: 'el',
            fn: 'onTextFieldKeypress',
            delegate: 'input.slate-todolist-new-item-text'
        },
        change: {
            element: 'el',
            fn: 'onDateChange',
            delegate: 'input.slate-todolist-new-item-date'
        }
    },

    tpl: [
        '<tpl for=".">',
            '<div class="slate-simplepanel slate-todolist-section <tpl if="readOnly">is-readonly</tpl>" data-section="{sectionId}" data-student="{studentId}">',
                '<div class="slate-simplepanel-header">',
                    '<div class="slate-simplepanel-title">To-Do List <small>{title}</small></div>',
                '</div>',

                '<div class="slate-todolist-section-content" <tpl if="collapsed">style="display:none"</tpl>>',
                '<tpl if="subGroups.length == 0">',
                    '<div class="empty-text">No to-dos found</div>',
                '<tpl else>',
                    '<tpl for="subGroups">',
                        '<section class="slate-todolist-itemgroup" data-group="{id}">',
                            '<header class="slate-todolist-itemgroup-header">',
                                '<h4 class="slate-todolist-itemgroup-title">{title}</h4>',
                                '<tpl if="id == \'completed\'">',
                                    '<ul class="slate-todolist-itemgroup-actions">',
                                        '<tpl if="!readOnly">',
                                            '<li class="slate-todolist-itemgroup-action" data-action="clear">',
                                                '<button>',
                                                    '<i class="fa fa-times"></i>&nbsp;Clear ALl',
                                                '</button>',
                                            '</li>',
                                        '</tpl>',
                                        '<li class="slate-todolist-itemgroup-action" data-action="hide" <tpl if="parent.completedHidden">style="display:none"</tpl>>',
                                            '<button >',
                                                '<i class="fa fa-caret-up"></i>&nbsp;Hide',
                                            '</button>',
                                        '</li>',
                                        '<li class="slate-todolist-itemgroup-action" data-action="show" <tpl if="!parent.completedHidden">style="display:none"</tpl>>',
                                            '<button>',
                                                '<i class="fa fa-caret-down"></i>&nbsp;Show',
                                            '</button>',
                                        '</li>',
                                    '</ul>',
                                '</tpl>',
                            '</header>',
                            '<ul class="slate-todolist-list" <tpl if="parent.completedHidden && id == \'completed\'">style="display:none"</tpl>>',
                                '<tpl for="todos">',
                                    '<li class="slate-todolist-item slate-todolist-status-<tpl if="IsLate">late<tpl else>due</tpl>" data-todo="{ID}">',
                                        '<input class="slate-todolist-item-checkbox" type="checkbox" <tpl if="Completed">checked</tpl> <tpl if="parent.readOnly">disabled</tpl>>',
                                        '<div class="slate-todolist-item-text">',
                                            '<label class="slate-todolist-item-title">{Description:htmlEncode}</label>',
                                        '</div>',
                                        '<div class="slate-todolist-item-date">{DueDate:date("M j, Y")}</div>',
                                    '</li>',
                                '</tpl>',
                                '<tpl if="!parent.readOnly && id == \'active\'">',
                                    '<li class="slate-todolist-item slate-todolist-blank-item">',
                                        '<input class="slate-todolist-item-checkbox" type="checkbox" disabled>',
                                        '<div class="slate-todolist-item-text">',
                                            '<input name="Description" class="slate-todolist-new-item-text" placeholder="New to-do&hellip;">',
                                        '</div>',
                                        '<div class="slate-todolist-item-date">',
                                            '<input name="DueDate" class="slate-todolist-new-item-date" type="date">',
                                        '</div>',
                                    '</li>',
                                '</tpl>',
                            '</ul>',
                        '</section>',
                    '</tpl>',
                '</tpl>',
                '</div>',
            '</div>',
        '</tpl>'
    ],


    // lifecycle methods
    initComponent: function() {
        this.collapsedSections = {};
        this.completedHiddenSections = {};

        this.callParent(arguments);
    },


    // config handlers
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
        this.addCls('is-loading');
        this.setLoading('Loading Todos&hellip;');
    },

    onStoreLoad: function() {
        this.refresh();
        this.removeCls('is-loading');
        this.setLoading(false);
    },

    onElClick: function(ev, el) {
        var me = this,
            sectionEl = ev.getTarget('.slate-todolist-section', null, true),
            sectionId = parseInt(sectionEl.getAttribute('data-section'), 10) || null;

        if (ev.getTarget('.slate-todolist-item-checkbox')) {
            me.fireEvent(
                'checkclick',
                me,
                sectionId,
                parseInt(ev.getTarget('.slate-todolist-item', null, true).getAttribute('data-todo'), 10),
                el.checked
            );
        } else if (ev.getTarget('.slate-todolist-itemgroup-action[data-action=clear]')) {
            me.fireEvent('clearclick', me, sectionId);
        } else if (ev.getTarget('.slate-simplepanel-header')) {
            me.onSectionTitleClick(sectionId, sectionEl);
        } else if (ev.getTarget('.slate-todolist-itemgroup-action[data-action=hide], .slate-todolist-itemgroup-action[data-action=show]')) {
            me.onToggleCompletedClick(sectionId, sectionEl);
        }
    },

    onSectionTitleClick: function(sectionId, sectionEl) {
        var me = this,
            collapsedSections = me.collapsedSections,
            sectionContentEl = sectionEl.down('.slate-todolist-section-content');

        if (collapsedSections[sectionId]) {
            sectionContentEl.slideIn('t', {
                duration: 200
            });

            collapsedSections[sectionId] = false;
        } else {
            sectionContentEl.setVisibilityMode(Ext.dom.Element.DISPLAY);
            sectionContentEl.slideOut('t', {
                duration: 200
            });

            collapsedSections[sectionId] = true;
        }
    },

    onToggleCompletedClick: function(sectionId, sectionEl) {
        var me = this,
            completedHiddenSections = me.completedHiddenSections,
            completedGroupEl = sectionEl.down('.slate-todolist-itemgroup[data-group=completed] .slate-todolist-list'),
            showActionEl = sectionEl.down('.slate-todolist-itemgroup-action[data-action=show]').setVisibilityMode(Ext.dom.Element.DISPLAY),
            hideActionEl = sectionEl.down('.slate-todolist-itemgroup-action[data-action=hide]').setVisibilityMode(Ext.dom.Element.DISPLAY),
            show = completedHiddenSections[sectionId];

        if (show) {
            completedGroupEl.slideIn('t', {
                duration: 200
            });
            showActionEl.hide();
            hideActionEl.show();

            completedHiddenSections[sectionId] = false;
        } else {
            completedGroupEl.setVisibilityMode(Ext.dom.Element.DISPLAY);
            completedGroupEl.slideOut('t', {
                duration: 200
            });
            showActionEl.show();
            hideActionEl.hide();

            completedHiddenSections[sectionId] = true;
        }
    },

    onTextFieldKeypress: function(ev) {
        if (ev.getKey() !== ev.ENTER) {
            return;
        }

        this.submitNewTask(ev.getTarget('.slate-todolist-section', null, true));
    },

    onDateChange: function(ev) {
        this.submitNewTask(ev.getTarget('.slate-todolist-section', null, true));
    },


    // member methods
    refresh: function() {
        var me = this,
            readOnly = me.getReadOnly(),
            collapsedSections = me.collapsedSections,
            completedHiddenSections = me.completedHiddenSections,

            todoGroupsData = [], // template input

            todoGroupsStore = me.getStore(),
            todoGroupsCount = todoGroupsStore.getCount(),
            todoGroupIndex = 0,
            todoGroup, sectionId,
            todos, todosCount, todoIndex, todo,
            completeTodos, activeTodos, todoSubGroups;

        // build array of todo groups
        for (; todoGroupIndex < todoGroupsCount; todoGroupIndex++) {
            todoGroup = todoGroupsStore.getAt(todoGroupIndex);
            sectionId = todoGroup.get('sectionId');
            todos = todoGroup.get('todos');
            todosCount = todos.length;

            // group todos by active and completed
            completeTodos = [];
            activeTodos = [];

            for (todoIndex = 0; todoIndex < todosCount; todoIndex++) {
                todo = todos.getAt(todoIndex);

                if (todo.get('Cleared')) {
                    continue;
                }

                (todo.get('Completed') ? completeTodos : activeTodos).push(todo.getData());
            }

            // generate data for populated groups
            todoSubGroups = [];

            if (activeTodos.length || !readOnly) {
                todoSubGroups.push({
                    id: 'active',
                    title: 'Active Items',
                    readOnly: readOnly,
                    todos: activeTodos
                });
            }

            if (completeTodos.length > 0) {
                todoSubGroups.push({
                    id: 'completed',
                    title: 'Completed Items',
                    readOnly: readOnly,
                    todos: completeTodos
                });
            }

            todoGroupsData.push({
                title: todoGroup.get('title'),
                studentId: todoGroup.get('studentId'),
                sectionId: sectionId,
                readOnly: readOnly,
                collapsed: Boolean(collapsedSections[sectionId]),
                completedHidden: Boolean(completedHiddenSections[sectionId]),
                subGroups: todoSubGroups
            });
        }

        // render markup
        this.setData(todoGroupsData);
    },

    submitNewTask: function(sectionEl) {
        var description = sectionEl.down('input[name=Description]').getValue(),
            dueDate = sectionEl.down('input[name=DueDate]').dom.valueAsDate;

        if (!description || !dueDate) {
            return;
        }

        this.fireEvent('tasksubmit', this, {
            SectionID: parseInt(sectionEl.getAttribute('data-section'), 10) || null,
            StudentID: parseInt(sectionEl.getAttribute('data-student'), 10) || null,
            Description: description,
            DueDate: Ext.Date.utcToLocal(dueDate)
        }, sectionEl);
    }
});