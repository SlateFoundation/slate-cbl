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
        itemId: 'title',

        xtype: 'component',
        cls: 'slate-appheader-title',
        html: 'Teacher Task Manager'
    }, {
        itemId: 'sectionSelect',

        xtype: 'slate-section-selector',
        store: 'Sections',
        valueField: 'Code',
        queryMode: 'local',
        emptyText: 'Select'
    }, {
        itemId: 'cohortSelect',

        xtype: 'slate-cohort-selector',
        disabled: true,
        store: 'SectionCohorts',
        queryMode: 'local',
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
    }]
});