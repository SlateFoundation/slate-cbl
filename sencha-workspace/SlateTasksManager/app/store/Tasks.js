Ext.define('SlateTasksManager.store.Tasks', {
  extend: 'Slate.cbl.store.tasks.Tasks',

  config: {
      proxy: {
          type: 'slate-cbl-tasks',
          include: [
              'Attachments',
              'Creator',
              'ParentTask',
              'Skills',
              'ClonedTask'
          ]
      }
  }
});