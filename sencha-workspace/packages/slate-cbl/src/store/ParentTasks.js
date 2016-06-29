Ext.define('Slate.cbl.store.ParentTasks', {
    extend: 'Ext.data.ChainedStore',
    requires: [
        'Slate.cbl.store.Tasks'
    ],

    source: 'Tasks',

    filters: [
        function(item) {
            return !item.get('ParentTaskID');
        }
    ]

});