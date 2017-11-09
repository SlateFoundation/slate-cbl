Ext.define('SlateTasksStudent.view.TodoList', {
    extend: 'Ext.Component',
    xtype: 'slatetasksstudent-todolist',


    config: {
        courseSection: null,
        student: null,
        readOnly: false
    },

    componentCls: 'slate-todolist',

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
        '    <div class="slate-simplepanel slate-todolist-section" data-section="{sectionId}" data-student="{studentId}">',
        '        <div class="slate-simplepanel-header">',
        '            <div class="slate-simplepanel-title">To-Do List <small>{section}</small></div>',
        '        </div>',

        '        <div class="slate-todolist-section-content" <tpl if="collapsed">style="display:none"</tpl>>',
        '        <tpl if="todos.length == 0">',
        '            <div class="empty-text">No todos found</div>',
        '        <tpl else>',
        '            <tpl for="todos">',
        '                <section class="slate-todolist-itemgroup" data-group="{id}">',
        '                    <header class="slate-todolist-itemgroup-header">',
        '                        <h4 class="slate-todolist-itemgroup-title">{title}</h4>',
        '                        <tpl if="id == \'completed\'">',
        '                            <ul class="slate-todolist-itemgroup-actions">',
        '                                <li class="slate-todolist-itemgroup-action" data-action="clear">',
        '                                    <button>',
        '                                        <i class="fa fa-times"></i>&nbsp;Clear ALl',
        '                                    </button>',
        '                                </li>',
        '                                <li class="slate-todolist-itemgroup-action" data-action="hide" <tpl if="parent.completedHidden">style="display:none"</tpl>>',
        '                                    <button >',
        '                                        <i class="fa fa-caret-up"></i>&nbsp;Hide',
        '                                    </button>',
        '                                </li>',
        '                                <li class="slate-todolist-itemgroup-action" data-action="show" <tpl if="!parent.completedHidden">style="display:none"</tpl>>',
        '                                    <button>',
        '                                        <i class="fa fa-caret-down"></i>&nbsp;Show',
        '                                    </button>',
        '                                </li>',
        '                            </ul>',
        '                        </tpl>',
        '                    </header>',
        '                    <ul class="slate-todolist-list" <tpl if="parent.completedHidden && id == \'completed\'">style="display:none"</tpl>>',
        '                        <tpl for="items">',
        '                            <li class="slate-todolist-item slate-todolist-status-{[ this.getStatusCls(values.DueDate) ]}" data-todo="{ID}">',
        '                                <input class="slate-todolist-item-checkbox" type="checkbox" <tpl if="Completed">checked</tpl> <tpl if="parent.readOnly">disabled</tpl>>',
        '                                <div class="slate-todolist-item-text">',
        '                                    <label for="todo-item" class="slate-todolist-item-title">{Description}</label>',
        '                                </div>',
        '                                <div class="slate-todolist-item-date">{DueDate:date("M j, Y")}</div>',
        '                            </li>',
        '                        </tpl>',
        '                        <tpl if="!parent.readOnly">',
        '                            <li class="slate-todolist-item slate-todolist-blank-item">',
        '                                <input class="slate-todolist-item-checkbox" type="checkbox" disabled>',
        '                                <div class="slate-todolist-item-text">',
        '                                    <input name="Description" class="slate-todolist-new-item-text" placeholder="New to-do&hellip;">',
        '                                </div>',
        '                                <div class="slate-todolist-item-date">',
        '                                    <input name="DueDate" class="slate-todolist-new-item-date" type="date">',
        '                                </div>',
        '                            </li>',
        '                        </tpl>',
        '                    </ul>',
        '                </section>',
        '            </tpl>',
        '        </tpl>',
        '        </div>',
        '    </div>',
        '</tpl>',
        {
            getStatusCls: function(due) {
                var dueEndOfDay = new Date(due.getTime()),
                    now = new Date(),
                    statusCls = 'due';

                dueEndOfDay.setHours(23, 59, 59, 999); // TODO: calculate in model

                if (dueEndOfDay < now) {
                    statusCls = 'late';
                }
                return statusCls;
            }
        }
    ],


    // lifecycle methods
    initComponent: function() {
        this.collapsedSections = {};
        this.completedHiddenSections = {};

        this.callParent(arguments);
    },


    // config handlers
    updateCourseSection: function(val) {
        var me = this;

        me.fireEvent('coursesectionchange', me, val);
    },


    // event handlers
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
        } else if (ev.getTarget('.slate-simplepanel-header')) {
            me.onSectionTitleClick(sectionId, sectionEl);
        } else if (ev.getTarget('.slate-todolist-itemgroup-action[data-action=clear]')) {
            me.fireEvent('clearclick', me, sectionId);
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


    // internal methods
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
