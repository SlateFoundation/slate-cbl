Ext.define('SlateDemonstrationsStudent.view.AppHeader', {
    extend: 'Slate.cbl.view.app.Header',
    requires: [
        'SlateDemonstrationsStudent.store.ContentAreas',
        'SlateDemonstrationsStudent.store.Students',
        'SlateDemonstrationsStudent.view.AppHeaderController',

        'Ext.form.field.ComboBox'
    ],

    xtype: 'slate-demonstrations-student-appheader',

    controller: 'slate-demonstrations-student-appheader',

    items: [{
        xtype: 'combo',
        itemId: 'studentCombo',
        displayField: 'FullName',
        valueField: 'ID',
        fieldLabel: 'Student',

        store: 'Students',
        queryMode: 'remote',
        queryParam: 'q',
        forceSelection: true,
        beforeQuery: function(queryPlan) {
            queryPlan.query += ' class:Slate\\People\\Student';
            return queryPlan;
        }
    }, {
        xtype: 'combo',
        itemId: 'contentAreaCombo',
        displayField: 'Title',
        valueField: 'ID',
        fieldLabel: 'Rubric',

        store: {
            type: 'chained',
            source: 'ContentAreas'
        },
        queryMode: 'local',
        editable: false,
        forceSelection: true
    }]
});