Ext.define('Slate.cbl.store.ContentAreas', {
    extend: 'Ext.data.Store',
    alias: 'store.slate-cbl-contentareas',


    model: 'Slate.cbl.model.ContentArea',
    config: {
        pageSize: 0
    }
});