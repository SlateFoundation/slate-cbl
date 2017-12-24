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
                xtype: 'slate-section-selector',
                store: 'Sections',
                queryMode: 'local',
                emptyText: 'Select',
                allowBlank: false
            }, {
                xtype: 'slate-cohort-selector',
                disabled: true,
                store: 'SectionCohorts',
                queryMode: 'local',
                emptyText: 'All Students'
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