Ext.define('SlateTasksManager.view.TasksManager', {
  extend: 'Ext.Container',
  xtype: 'slate-tasks-manager',
  requires: [
      'SlateTasksManager.view.TasksGrid',
      'SlateTasksManager.view.AppHeader',
      'SlateTasksManager.view.TaskDetails'
  ],

  height: '100%',

  layout: 'border',

  items: [
      {
          xtype: 'slate-tasks-manager-appheader',
          region: 'north'
      },
      {
          xtype: 'slate-tasks-manager-grid',
          region: 'center',
          layout: 'fit'
      },
      {
          xtype: 'slate-tasks-manager-details',
          region: 'east',
          width: 240,
          split: true
      },
  ]

});
