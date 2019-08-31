Ext.define('Slate.cbl.store.ContentAreas', {
    extend: 'Ext.data.Store',
    alias: 'store.slate-cbl-contentareas',


    model: 'Slate.cbl.model.ContentArea',
    config: {
        pageSize: 0
    },


    // member methods
    getByCode: function(code) {
        var index = code ? this.findExact('Code', code) : -1;

        return index == -1 ? null : this.getAt(index);
    }
});