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
                '.slate-todolist-button-clear',
                '.slate-todolist-button-hide'
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
        '    <div class="slate-todolist-section" data-section="{sectionId}" data-student="{studentId}">',
        '        <div class="slate-simplepanel-header">',
        '            <div class="slate-simplepanel-title">To-Do List <small>{section}</small></div>',
        '        </div>',

        '        <div class="slate-todolist-section-content">',
        '        <tpl for="todos">',
        '            <section class="slate-todolist-itemgroup">',
        '                <header class="slate-todolist-itemgroup-header">',
        '                    <h4 class="slate-todolist-itemgroup-title">{Title}</h4>',
        '                    <tpl if="buttons">',
        '                        <ul class="slate-todolist-itemgroup-actions">',
        '                        <tpl for="buttons">',
        '                            <li class="slate-todolist-itemgroup-action">',
        '                                <button class="slate-todolist-button-{action}">',
        '                                    <tpl if="icon"><i class="fa fa-{icon}"></i>&nbsp;</tpl>{text}',
        '                                </button>',
        '                            </li>',
        '                        </tpl>',
        '                    </tpl>',
        '                </header>',
        '                <ul class="slate-todolist-list">',
        '                    <tpl for="items">',
        '                        <li class="slate-todolist-item slate-todolist-status-{[ this.getStatusCls(values.DueDate) ]}" data-todo="{ID}">',
        '                            <input class="slate-todolist-item-checkbox" type="checkbox" <tpl if="Completed">checked</tpl> <tpl if="parent.readOnly">disabled</tpl>>',
        '                            <div class="slate-todolist-item-text">',
        '                                <label for="todo-item" class="slate-todolist-item-title">{Description}</label>',
        '                            </div>',
        '                            <div class="slate-todolist-item-date">{DueDate:date("M j, Y")}</div>',
        '                        </li>',
        '                    </tpl>',
        '                    <tpl if="!parent.readOnly">',
        '                        <li class="slate-todolist-item slate-todolist-blank-item">',
        '                            <input class="slate-todolist-item-checkbox" type="checkbox" disabled>',
        '                            <div class="slate-todolist-item-text">',
        '                                <input name="Description" class="slate-todolist-new-item-text" placeholder="New to-do&hellip;">',
        '                            </div>',
        '                            <div class="slate-todolist-item-date">',
        '                                <input name="DueDate" class="slate-todolist-new-item-date" type="date">',
        '                            </div>',
        '                        </li>',
        '                    </tpl>',
        '                </ul>',
        '            </section>',
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
        this.sectionVisibility = {};

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
            me.onSectionTitleClick(el);
        } else if (ev.getTarget('.slate-todolist-button-clear')) {
            me.fireEvent('clearcompleted', me, dataParentId);
        } else if (ev.getTarget('.slate-todolist-button-hide')) {
            me.onHideButtonClick(el);
        }
    },

    onSectionTitleClick: function(el) {
        var me = this,
            sectionId = el.getAttribute('data-id'),
            sectionSelector = '.slate-todolist-section-content[data-id="'+sectionId+'"]',
            section = me.getEl().down(sectionSelector);

        if (section) {
            if (section.isVisible()) {
                section.setVisibilityMode(Ext.dom.Element.DISPLAY);
                section.slideOut('t', {
                    duration: 200
                });
                me.recordVisibilityState(sectionSelector, false);
            } else {
                section.slideIn('t', {
                    duration: 200
                });
                me.recordVisibilityState(sectionSelector, true);
            }
        }
    },

    onHideButtonClick: function(el) {
        var me = this,
            sectionId = el.getAttribute('data-parent-id'),
            itemGroupId = sectionId + '-2',
            itemGroupSelector = '.slate-todolist-list[data-id="'+itemGroupId+'"]',
            itemGroup = me.getEl().down(itemGroupSelector);

        if (itemGroup) {
            if (itemGroup.isVisible()) {
                itemGroup.setVisibilityMode(Ext.dom.Element.DISPLAY);
                itemGroup.slideOut('t', {
                    duration: 200
                });
                me.recordVisibilityState(itemGroupSelector, false);
            } else {
                itemGroup.slideIn('t', {
                    duration: 200
                });
                me.recordVisibilityState(itemGroupSelector, true);
            }
        }

        // me.syncItemGroupToggleButtons();
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
    // syncItemGroupToggleButtons: function() {
    //     var itemGroups = Ext.dom.Query.select('ul.slate-todolist-list'),
    //         element;

    //     Ext.Array.each(itemGroups, function(item) {
    //         element = Ext.get(item);
    //     });
    // },

    recordVisibilityState: function(sectionID, visible) {
        this.sectionVisibility[sectionID] = visible;
    },

    restoreVisibilityState: function() {
        var me = this,
            sectionVisibility = me.sectionVisibility,
            sectionSelector, section;

        for (sectionSelector in sectionVisibility) {
            if (sectionVisibility.hasOwnProperty(sectionSelector)) {
                section = me.getEl().down(sectionSelector);
                if (section) {
                    section.setVisibilityMode(Ext.dom.Element.DISPLAY).setVisible(sectionVisibility[sectionSelector]);
                }
            }
        }
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
            DueDate: dueDate
        }, sectionEl);
    }
});
