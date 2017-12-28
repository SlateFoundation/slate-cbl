Ext.define('Slate.cbl.store.Skills', {
    extend: 'Ext.data.Store',
    alias: 'store.slate-cbl-skills',


    model: 'Slate.cbl.model.Skill',
    config: {
        pageSize: 0
    }
});