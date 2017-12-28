Ext.define('Slate.cbl.store.Skills', {
    extend: 'Ext.data.Store',
    alias: 'store.slate-cbl-skills',
    requires: [
        /* global Slate */
        'Slate.sorter.Code'
    ],


    model: 'Slate.cbl.model.Skill',
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