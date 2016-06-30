Ext.define('SlateTasksManager.view.TaskEditor', {
    extend: 'Slate.cbl.view.modals.CreateTask',
    xtype: 'slatetasksmanager-task-editor',

    config: {
        task: null
    },

    enableAssignments: false
});