Ext.define('SlateTasksTeacher.view.AppHeader', {
    extend: 'Slate.cbl.view.AppHeader',
    requires: [
        'SlateTasksTeacher.store.CourseSections',
        'Ext.toolbar.Fill'
    ],
    xtype: 'slate-tasks-teacher-appheader',

    layout: {
        type: 'vbox',
        align: 'left'
    },

    items: [{
        xtype: 'component',
        cls: 'slate-appheader-title',
        itemId: 'title',
        html: 'Teacher Task Manager'
    },{
        xtype: 'container',
        layout: 'hbox',
        items: [{
            xtype: 'combo',
            itemId: 'sectionSelect',
            cls: 'slate-course-selector',

            fieldLabel: 'Course Section',

            store: 'CourseSections',

            displayField: 'Title',
            valueField: 'ID',

            forceSelection: true,
            editable: false
        },
        {
            xtype: 'tbfill'
        },
        {
            cls: 'primary',
            iconCls: 'x-fa fa-plus',
            action: 'create'
        },{
            iconCls: 'x-fa fa-pencil',
            action: 'edit'
        },{
            iconCls: 'x-fa fa-trash-o',
            action: 'delete'
        }]
    }]

});