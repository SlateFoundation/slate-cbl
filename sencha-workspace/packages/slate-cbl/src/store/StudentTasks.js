Ext.define('Slate.cbl.store.StudentTasks', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.cbl.model.StudentTask'
    ],

    model: 'Slate.cbl.model.StudentTask',
    remoteFilter: true,
    remoteSort: true
});