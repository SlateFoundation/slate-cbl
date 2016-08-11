Ext.define('SlateTasksStudent.view.TodoList', {
    //extend: 'Slate.cbl.widget.SimplePanel',
    extend: 'Ext.Container',
    xtype: 'slatetasksstudent-todolist',
    requires:[
    ],

    config: {
        sectionVisibility: {}
    },

    baseCls: 'slate-simplepanel',
    componentCls: 'slate-todolist',

    listeners: {
        click: {
            element: 'el',
            fn: 'onElClick',
            delegate: [
                '.slate-todolist-item-checkbox',
                'div.slate-simplepanel-header',
                'button.slate-todolist-button-clear',
                'button.slate-todolist-button-hide'
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
        '<div class="slate-simplepanel-header" data-id="{ID}">To-Do List - {section}</div>',
        '<div id="slate-todolist-section-content-{ID}">',
        '<tpl for="todos">' ,
            '<tpl exec="values.parent = parent;"></tpl>', // access to parent when 2 deep
            '<section class="slate-todolist-itemgroup">',
                '<header class="slate-todolist-itemgroup-header">',
                    '<h4 class="slate-todolist-itemgroup-title">{Title}</h4>',
                    '<tpl if="buttons">',
                        '<ul class="slate-todolist-itemgroup-actions">',
                        '<tpl for="buttons">',
                            '<li class="slate-todolist-itemgroup-action">',
                                '<button class="slate-todolist-button-{action}" data-parent-id="{parent.parent.ID}">',
                                    '<tpl if="icon"><i class="fa fa-{icon}"></i>&nbsp;</tpl>{text}',
                                '</button>',
                            '</li>',
                        '</tpl>',
                    '</tpl>',
                '</header>',
                '<ul id="slate-todolist-itemgroup-{parent.ID}-{#}" class="slate-todolist-list" data-parent-id="{parent.ID}">',
                    '<tpl for="items">',
                        '<li class="slate-todolist-item slate-todolist-status-{[ this.getStatusCls(values.DueDate) ]}">',
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
                                '<input id="todo-item-new-text-{parent.ID}" class="slate-todolist-new-item-text" placeholder="New to-do&hellip;" data-parent-id="{parent.ID}">',
                            '</div>',
                            '<div class="slate-todolist-item-date">',
                                '<input id="todo-item-new-date-{parent.ID}" class="slate-todolist-new-item-date" type="date" data-parent-id="{parent.ID}">',
                            '</div>',
                        '</li>',
                    '</tpl>',
                '</ul>',
            '</section>',
        '</tpl>',
        '</div>',
    '</tpl>',
    {
        getStatusCls: function(due) {
            var now = new Date();

            if (due > now) {
                return 'due';
            } else {
                return 'late';
            }
        }
    }],

    onElClick: function(ev, el) {
        var me = this;

        if (ev.getTarget('.slate-todolist-item-checkbox')) {
            me.fireEvent('checkclick', this, el.getAttribute('data-parent-id'), el.getAttribute('data-id'),el.checked);
        }
        else if (ev.getTarget('div.slate-simplepanel-header')) {
            me.onSectionTitleClick(el);
        }
        else if (ev.getTarget('button.slate-todolist-button-clear')) {
            me.fireEvent('clearcompleted', this, el.getAttribute('data-parent-id'));
        }
        else if (ev.getTarget('button.slate-todolist-button-hide')) {
            me.onHideButtonClick(el);
        }
    },

    onSectionTitleClick: function(el) {
        var me = this,
            sectionId = el.getAttribute('data-id'),
            section = me.getEl().getById('slate-todolist-section-content-'+sectionId);

        if (section) {
            if (section.isVisible()) {
                section.setVisibilityMode(Ext.dom.Element.OFFSETS).slideOut('t', {
                    duration: 200
                });
                me.recordVisibilityState(section.getAttribute('id'), false);
            } else {
                section.show();
                section.setVisibilityMode(Ext.dom.Element.OFFSETS).slideIn('t', {
                    duration: 200
                });
                me.recordVisibilityState(section.getAttribute('id'), true);
            }
        }
    },

    onHideButtonClick: function(el) {
        var me = this,
            sectionId = el.getAttribute('data-parent-id'),
            itemGroupId = sectionId + '-2',
            itemGroup = me.getEl().getById('slate-todolist-itemgroup-'+itemGroupId);

        if (itemGroup) {
            if (itemGroup.isVisible()) {
                itemGroup.setVisibilityMode(Ext.dom.Element.OFFSETS).slideOut('t', {
                    duration: 200
                });
                me.recordVisibilityState(itemGroup.getAttribute('id'), false);
            } else {
                itemGroup.show();
                itemGroup.setVisibilityMode(Ext.dom.Element.OFFSETS).slideIn('t', {
                    duration: 200
                });
                me.recordVisibilityState(itemGroup.getAttribute('id'), true);
            }
        }
        me.syncItemGroupToggleButtons();
    },

    syncItemGroupToggleButtons: function() {
        var itemGroups = Ext.dom.Query.select('ul.slate-todolist-list'),
            element;

        Ext.Array.each(itemGroups, function(item) {
            element = Ext.get(item);
            //console.log(element.getId()+': ' + element.isVisible());
        });

    },

    onTextFieldKeypress: function(evt, el) {
        if (evt.getKey() == evt.ENTER) {
            this.fireEvent('enterkeypress', this, el.getAttribute('data-parent-id'));
        }
    },

    onDateChange: function(evt, el) {
        this.fireEvent('datechange', this, el.getAttribute('data-parent-id'));
    },

    recordVisibilityState: function(sectionID, visible) {
        var sectionVisibility = this.getSectionVisibility();

        sectionVisibility[sectionID] = visible;
    },

    restoreVisibilityState: function() {
        var me = this,
            sectionVisibility = this.getSectionVisibility(),
            sectionId, section;

        for (sectionId in sectionVisibility) {
            if (sectionVisibility.hasOwnProperty(sectionId)) {
                section = me.getEl().getById(sectionId);
                if (section) {
                    section.setVisibilityMode(Ext.dom.Element.OFFSETS).setVisible(sectionVisibility[sectionId]);
                }
            }
        }
    }
});
