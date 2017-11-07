Ext.define('SlateTasksStudent.view.TodoList', {
    extend: 'Ext.Component',
    xtype: 'slatetasksstudent-todolist',


    config: {
        courseSection: null,
        student: null,
        readOnly: false,
        sectionVisibility: {}
    },

    cls: 'slate-todolist',

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

    updateCourseSection: function(val) {
        var me = this;

        me.fireEvent('coursesectionchange', me, val);
    },

    tpl: [
        '<tpl for=".">',
            '<div style="margin-bottom: 20px;">',
                '<div class="slate-simplepanel-header" data-id="{ID}">',
                    '<div class="slate-simplepanel-title">To-Do List <small>{section}</small></div>',
                '</div>',
                // TODO: replace inline styles with a class
                '<div class="slate-todolist-section-content" data-id="{ID}" ',
                     'style="border-radius: 0 0 0.25em 0.25em; box-shadow: 0 0.125em 0.25em rgba(0, 0, 0, 0.166); overflow: hidden;">',
                '<tpl for="todos">',
                    '<tpl exec="values.parent = parent;"></tpl>', // access to parent when 2 deep
                    '<section class="slate-todolist-itemgroup">',
                        '<header class="slate-todolist-itemgroup-header">',
                            '<h4 class="slate-todolist-itemgroup-title">{Title}</h4>',
                            '<tpl if="buttons">',
                                '<ul class="slate-todolist-itemgroup-actions">',
                                '<tpl for="buttons">',
                                    '<li class="slate-todolist-itemgroup-action">',
                                        '<button class="slate-todolist-button-{action}" data-parent-id="{parent.parent.sectionId}">',
                                            '<tpl if="icon"><i class="fa fa-{icon}"></i>&nbsp;</tpl>{text}',
                                        '</button>',
                                    '</li>',
                                '</tpl>',
                            '</tpl>',
                        '</header>',
                        '<ul class="slate-todolist-list" data-id="{parent.sectionId}-{#}" data-parent-id="{parent.ID}">',
                            '<tpl exec="values.readOnly = parent.readOnly;"></tpl>', // access to readonly in items loop
                            '<tpl for="items">',
                                '<li class="slate-todolist-item slate-todolist-status-{[ this.getStatusCls(values.DueDate) ]}">',
                                    '<input class="slate-todolist-item-checkbox" data-parent-id="{parent.parent.ID}" data-id="{ID}" type="checkbox" <tpl if="Completed">checked</tpl> <tpl if="parent.readOnly">disabled</tpl>>',
                                    '<div class="slate-todolist-item-text">',
                                        '<label for="todo-item" class="slate-todolist-item-title">{Description}</label>',
                                    '</div>',
                                    '<div class="slate-todolist-item-date">{DueDate:date("M j, Y")}</div>',
                                '</li>',
                            '</tpl>',
                            '<tpl if="!parent.readOnly">',
                                '<li class="slate-todolist-item slate-todolist-blank-item slate-todolist-blank-item-{parent.ID}">',
                                    '<input class="slate-todolist-item-checkbox" type="checkbox" disabled>',
                                    '<div class="slate-todolist-item-text">',
                                        '<input class="slate-todolist-new-item-text" placeholder="New to-do&hellip;" data-parent-id="{parent.ID}">',
                                    '</div>',
                                    '<div class="slate-todolist-item-date">',
                                        '<input class="slate-todolist-new-item-date" type="date" data-parent-id="{parent.ID}">',
                                    '</div>',
                                '</li>',
                            '</tpl>',
                        '</ul>',
                    '</section>',
                '</tpl>',
                '</div>',
            '</div>',
        '</tpl>',
        {
            getStatusCls: function(due) {
                var dueEndOfDay = new Date(due.getTime()),
                    now = new Date(),
                    statusCls = 'due';

                dueEndOfDay.setHours(23, 59, 59, 999);

                if (dueEndOfDay < now) {
                    statusCls = 'late';
                }
                return statusCls;
            }
        }
    ],

    onElClick: function(ev, el) {
        var me = this,
            dataId = parseInt(el.getAttribute('data-id'), 10),
            dataParentId = parseInt(el.getAttribute('data-parent-id'), 10);

        if (ev.getTarget('.slate-todolist-item-checkbox')) {
            me.fireEvent('checkclick', me, dataParentId, dataId, el.checked);
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
        me.syncItemGroupToggleButtons();
    },

    syncItemGroupToggleButtons: function() {

    /*
        var itemGroups = Ext.dom.Query.select('ul.slate-todolist-list'),
            element;

        Ext.Array.each(itemGroups, function(item) {
            element = Ext.get(item);
        });
    */

    },

    onTextFieldKeypress: function(evt, el) {
        if (evt.getKey() === evt.ENTER) {
            this.fireEvent('enterkeypress', this, parseInt(el.getAttribute('data-parent-id'), 10));
        }
    },

    onDateChange: function(evt, el) {
        this.fireEvent('datechange', this, parseInt(el.getAttribute('data-parent-id'), 10));
    },

    recordVisibilityState: function(sectionID, visible) {
        var sectionVisibility = this.getSectionVisibility();

        sectionVisibility[sectionID] = visible;
    },

    restoreVisibilityState: function() {
        var me = this,
            sectionVisibility = me.getSectionVisibility(),
            sectionSelector, section;

        for (sectionSelector in sectionVisibility) {
            if (sectionVisibility.hasOwnProperty(sectionSelector)) {
                section = me.getEl().down(sectionSelector);
                if (section) {
                    section.setVisibilityMode(Ext.dom.Element.DISPLAY).setVisible(sectionVisibility[sectionSelector]);
                }
            }
        }
    }
});
