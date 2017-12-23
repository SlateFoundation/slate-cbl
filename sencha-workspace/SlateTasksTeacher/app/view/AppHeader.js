Ext.define('SlateTasksTeacher.view.AppHeader', {
    extend: 'Slate.cbl.view.app.Header',
    xtype: 'slate-tasks-teacher-appheader',
    requires: [
        'Ext.form.field.ComboBox',
        'Ext.toolbar.Fill',

        'Slate.cbl.widget.SectionSelector',
        'Slate.cbl.widget.CohortSelector',
    ],


    config: {
        title: 'Teacher Task Dashboard',

        items: [
            {
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
                action: 'create',
                hidden: true
            }
        ]
    }
});