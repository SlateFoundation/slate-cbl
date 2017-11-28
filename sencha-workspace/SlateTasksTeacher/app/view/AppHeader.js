Ext.define('SlateTasksTeacher.view.AppHeader', {
    extend: 'Slate.cbl.view.AppHeader',
    requires: [
        'Slate.cbl.widget.SectionSelector',
        'Slate.cbl.widget.CohortSelector',
        'Ext.toolbar.Fill',
        'Ext.form.field.ComboBox'
    ],
    xtype: 'slate-tasks-teacher-appheader',

    items: [{
        xtype: 'component',
        cls: 'slate-appheader-title',
        itemId: 'title',
        html: 'Teacher Task Manager'
    }, {
        xtype: 'slate-section-selector',
        itemId: 'sectionSelect',

        store: 'CourseSections'
    }, {
        xtype: 'slate-cohort-selector',
        itemId: 'cohortSelect',
        disabled: true,

        store: 'SectionCohorts',
        emptyText: 'All Students',
        triggers: {
            clear: {
                cls: 'x-form-clear-trigger',
                weight: -2,
                hidden: true,
                handler: function(combo) {
                    combo.clearValue();
                    combo.fireEvent('clear', combo);
                }
            }
        },
        listeners: {
            change: function(combo, value) {
                this.getTrigger('clear').setHidden(!value);
            }
        }
    }, {
        xtype: 'tbfill'
    }, {
        cls: 'primary',
        iconCls: 'x-fa fa-plus',
        action: 'create'
    }, {
        iconCls: 'x-fa fa-pencil',
        action: 'edit',
        hidden: true // todo: remove?
    }, {
        iconCls: 'x-fa fa-trash-o',
        action: 'delete',
        hidden: true // todo: remove?
    }]
});