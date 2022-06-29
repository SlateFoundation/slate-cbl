Ext.define('SlateTasksManager.store.Tasks', {
  extend: 'Slate.cbl.store.tasks.Tasks',

  config: {
      pageSize: 20,
      proxy: {
          type: 'slate-cbl-tasks',
          include: [
              'Attachments',
              'Creator',
              'ParentTask',
              'Skills',
              'ClonedTask'
          ],
          extraParams:  {
              'include_archived': 'false'
          },
      }
  }
});