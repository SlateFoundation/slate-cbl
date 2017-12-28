Ext.define('Slate.cbl.store.Competencies', {
    extend: 'Ext.data.Store',
    alias: 'store.slate-cbl-competencies',
    requires: [
        /* global Slate */
        'Slate.sorter.Code'
    ],


    model: 'Slate.cbl.model.Competency',
    config: {
        pageSize: 0,
        remoteSort: false,
        sorters: true
    },


    applySorters: function(sorters) {
        if (sorters === true) {
            sorters = new Slate.sorter.Code();
        }

        return this.callParent([sorters]);
    }
});