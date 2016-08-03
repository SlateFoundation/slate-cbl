Ext.define('SlateTasksStudent.view.AppHeader', {
    extend: 'Slate.cbl.view.AppHeader',
    requires: [
        'SlateTasksStudent.store.CourseSections',
        'Ext.toolbar.Fill'
    ],
    xtype: 'slatetasksstudent-appheader',

    layout: {
        type: 'vbox',
        align: 'left'
    },

    items: [{
        xtype: 'container',
        layout: 'hbox',
        items: [{
            xtype: 'combo',
            itemId: 'sectionSelect',
            cls: 'slate-course-selector',

            fieldLabel: 'Course Section',

            store: {xclass: 'SlateTasksStudent.store.CourseSections'},

            displayField: 'Title',
            valueField: 'ID',

            forceSelection: true,
            editable: false
        },
        {
            xtype: 'tbfill'
        }]
    }]

});
