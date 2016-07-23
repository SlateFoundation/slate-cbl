Ext.define('SlateTasksTeacher.view.DashboardToolbar', {
    extend: 'Ext.Toolbar',

    requires: [
        'Ext.form.field.ComboBox',
        'SlateTasksTeacher.model.CourseSection'    ],

    xtype: 'slate-tasks-teacher-dashboardtoolbar',

    items: [{
        // flex: 3,

        xtype: 'combo',
        itemId: 'sectionSelect',
        cls: 'slate-course-selector',

        fieldLabel: 'Course Section',

        store: {
            model: 'SlateTasksTeacher.model.CourseSection'
        },

        displayField: 'Title',
        valueField: 'ID',

        forceSelection: true,
        editable: false
    },
    '->',
    {
        text: 'Create',
        action: 'create'
    },{
        text: 'Edit',
        action: 'edit',
        disabled: true
    },{
        text: 'Delete',
        action: 'delete'
    }]
});