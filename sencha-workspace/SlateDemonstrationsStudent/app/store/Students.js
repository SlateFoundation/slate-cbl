Ext.define('SlateDemonstrationsStudent.store.Students', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.cbl.model.Student'
    ],

    model: 'Slate.cbl.model.Student',

    proxy: {
        type: 'slate-records',
        url: '/cbl/dashboards/demonstrations/student/*students'
    }
});