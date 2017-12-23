/**
 * Disable remote sorting/filtering for manual data loading by controller
 */
Ext.define('SlateTasksTeacher.store.Tasks', {
    extend: 'Slate.cbl.store.tasks.Tasks',


    config: {
        remoteSort: false,
        remoteFilter: false,
        sorters: [{
            property: 'Created',
            direction: 'DESC'
        }]
    }
});
