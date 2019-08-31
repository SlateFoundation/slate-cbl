Ext.define('Slate.cbl.admin.store.Skills', {
    extend: 'Ext.data.Store',

    model: 'Slate.cbl.admin.model.Skill',
    remoteSort: true,
    pageSize: 50,
});