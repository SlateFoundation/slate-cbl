Ext.define('SlateTasksManager.view.TasksManager', {
  extend: 'Ext.Container',
  xtype: 'slate-tasks-manager',
  requires: [
      'SlateTasksManager.view.TasksGrid',
      'SlateTasksManager.view.AppHeader',
      'SlateTasksManager.view.TaskDetails'
  ],

  autoEl: 'main',
  componentCls: 'slate-tasks-manager',

  layout: 'border',

  items: [
      {
          xtype: 'slate-tasks-manager-appheader',
          region: 'north'
      },
      {
          xtype: 'slate-tasks-manager-grid',
          region: 'center'
      },
      {
          xtype: 'slate-tasks-manager-details',
          region: 'east',
          width: 240,
          split: true
      },
  ]

});
