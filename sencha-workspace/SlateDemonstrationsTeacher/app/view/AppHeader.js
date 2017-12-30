Ext.define('SlateDemonstrationsTeacher.view.AppHeader', {
    extend: 'Slate.ui.app.Header',
    requires: [
        'SlateDemonstrationsTeacher.store.ContentAreas',
        'SlateDemonstrationsTeacher.view.AppHeaderController',
        'SlateDemonstrationsTeacher.view.StudentGroupSelector',

        'Ext.toolbar.Fill',
        'Ext.form.field.ComboBox'
    ],

    xtype: 'slate-demonstrations-teacher-appheader',

    controller: 'slate-demonstrations-teacher-appheader',
    title: 'Classroom Progress',

    items: [{
        xtype: 'slate-demonstrations-teacher-studentgroupselector',
        itemId: 'studentsSelect'
    }, {
        xtype: 'combo',
        itemId: 'contentAreaSelect',
        store: 'ContentAreas',

        fieldLabel: 'Content Area',
        displayField: 'Code',
        valueField: 'ID',
        forceSelection: true,
        editable: false
    }, {
        xtype: 'tbfill'
    }, {
        cls: 'primary',
        iconCls: 'x-fa fa-plus',
        action: 'submitevidence'
    }]
});