Ext.define('SlateTasksManager.view.TasksGrid', {
  extend: 'Ext.grid.GridPanel',
  xtype: 'slate-tasks-manager-grid',
  requires: [
     'Ext.grid.filters.Filters'
  ],

  title: 'Task Library',
  header: false,

  componentCls: 'slate-tasks-manager-grid',

  plugins: 'gridfilters',

  dockedItems: [
      {
          xtype: 'pagingtoolbar',
          dock: 'bottom',
          store: 'Tasks'
      }
  ],

  columns: {
      defaults: {
          align: 'center'
      },
      items: [
          {
              text: 'Title',
              dataIndex: 'Title',
              flex: 3,
              align: 'left',
              filter: {
                  type: 'string',
                  operator: null,
                  itemDefaults: {
                      emptyText: 'Search for...'
                  }
              }
          },
          {
              text: 'Subtask of&hellip;',
              flex: 2,
              dataIndex: 'ParentTask',
              xtype: 'templatecolumn',
              align: 'left',
              tpl: [
                  '<tpl for="ParentTask">{Title}</tpl>'
              ],
              filter: {
                  type: 'string',
                  operator: null,
                  itemDefaults: {
                      emptyText: 'Search for...'
                  }
              }
          },
          {
              text: 'Type of Exp.',
              dataIndex: 'ExperienceType',
              width: 120,
              filter: {
                  type: 'string',
                  operator: null,
                  itemDefaults: {
                      emptyText: 'Search for...'
                  }
              }
          },
          {
              text: 'Skills',
              dataIndex: 'Skills',
              flex: 1,
              renderer: function (val) {
                  const skills = Array.isArray(val) ? val.join(', ') : '';

                  return '<span data-qtip= "'+skills+'">' + skills + '</span>';
              }
          },
          {
              text: 'Created by',
              dataIndex: 'Creator',
              flex: 1,
              xtype: 'templatecolumn',
              tpl: [
                  '<tpl for="Creator">{FirstName} {LastName}</tpl>'
              ]
          },
          {
              text: 'Created',
              dataIndex: 'Created',
              width: 120,
              xtype: 'datecolumn',
              format: 'm-d-Y',
              filterField: {
                  xtype: 'datefield',
                  submitFormat: 'Y-m-d'
              }
          }
      ]
  },

  store: 'Tasks'
});