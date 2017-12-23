Ext.define('SlateDemonstrationsTeacher.store.StudentGroups', {
    extend: 'Ext.data.Store',
    requires: [
        'SlateDemonstrationsTeacher.model.StudentGroup'
    ],

    model: 'SlateDemonstrationsTeacher.model.StudentGroup'
});