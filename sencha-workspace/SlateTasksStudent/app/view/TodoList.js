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
            delegate: '.slate-todolist-item-checkbox,div.slate-simplepanel-header',
            fn: 'onElClick'
        },
        keypress: {
            element: 'el',
            delegate: 'input.slate-todolist-new-item-text',
            fn: 'onTextFieldKeypress'
        },
        change: {
            element: 'el',
            delegate: 'input.slate-todolist-new-item-date',
            fn: 'onDateChange'
        }
    },

    tpl: [
    '<tpl for=".">',
        '<div class="slate-simplepanel-header" data-id="{ID}">To-Do List - {section}</div>',
        '<div id="slate-todolist-section-content-{ID}">',
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
    '</tpl>'
    ],

    onElClick: function(ev, el) {
        var me = this;

        if (ev.getTarget('.slate-todolist-item-checkbox')) {
            me.fireEvent('checkclick', this, el.getAttribute('data-parent-id'), el.getAttribute('data-id'),el.checked);
        }
        else if (ev.getTarget('div.slate-simplepanel-header')) {
            me.onSectionTitleClick(el);
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
                me.recordVisibilityState(sectionId, false);
            } else {
                section.show();
                section.setVisibilityMode(Ext.dom.Element.OFFSETS).slideIn('t', {
                    duration: 200
                });
                me.recordVisibilityState(sectionId, true);
            }
        }
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
                section = me.getEl().getById('slate-todolist-section-content-'+sectionId);
                if (section) {
                    section.setVisibilityMode(Ext.dom.Element.OFFSETS).setVisible(sectionVisibility[sectionId]);
                }
            }
        }
    }
});
