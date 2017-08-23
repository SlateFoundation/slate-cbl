Ext.define('SlateDemonstrationsStudent.store.ContentAreas', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.cbl.model.ContentArea'
    ],

    model: 'Slate.cbl.model.ContentArea',
    proxy: {
        type: 'slate-records',
        url: '/cbl/dashboards/demonstrations/student/*content-areas'
    },
    autoLoad: true
});