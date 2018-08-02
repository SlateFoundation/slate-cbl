Ext.define('SlateDemonstrationsTeacher.store.Students', {
    extend: 'Ext.data.Store',


    model: 'Slate.model.person.Person',
    config: {
        pageSize: 0,
        remoteSort: false,
        sorters: [{
            property: 'SortName',
            direction: 'ASC'
        }],
        proxy: {
            type: 'slate-people',
            summary: true
        }
    },
});