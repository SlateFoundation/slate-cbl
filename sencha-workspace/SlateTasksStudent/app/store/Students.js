Ext.define('SlateTasksStudent.store.Students', {
    extend: 'Ext.data.Store',


    model: 'Slate.model.person.Person',

    config: {
        pageSize: 0,
        sorters: [{
            property: 'SortName',
            direction: 'ASC'
        }],
        proxy: {
            type: 'slate-records',
            url: '/people',
            summary: true
        },
    }
});