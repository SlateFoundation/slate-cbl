Ext.define('Slate.cbl.proxy.TodoGroups', {
    extend: 'Slate.proxy.API',
    alias: 'proxy.slate-cbl-todogroups',


    config: {
        url: '/cbl/todos/*groups',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});