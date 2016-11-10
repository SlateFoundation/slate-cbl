Ext.define('Slate.cbl.store.Tasks', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.cbl.model.Task'
    ],

    model: 'Slate.cbl.model.Task',
    autoLoad: true,
    remoteFilter: true,
    remoteSort: true
});