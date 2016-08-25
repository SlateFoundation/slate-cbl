Ext.define('SlateTasksStudent.store.StudentTasksTree', {
    extend: 'Ext.data.TreeStore',

    model: 'SlateTasksStudent.model.StudentTaskTreeItem',

    parentIdProperty: 'ParentID',

    config: {
        pageSize: 0
    }
});
