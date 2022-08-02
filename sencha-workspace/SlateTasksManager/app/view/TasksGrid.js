Ext.define('SlateTasksManager.view.TasksGrid', {
  extend: 'Ext.grid.GridPanel',
  xtype: 'slate-tasks-manager-grid',
  requires: [
     'Ext.grid.filters.Filters'
  ],

  title: 'Task Library',
  header: false,

  plugins: 'gridfilters',

  dockedItems: [
      {
          xtype: 'toolbar',
          dock: 'bottom',
          items: [{
              xtype: 'pagingtoolbar',
              store: 'Tasks',
              flex: 1
          },{
              xtype: 'container',
              itemId: 'results-count-container',
              tpl: '{results} total',
              flex: 1
          },{
              xtype: 'container',
              width: 120,
              items: [{
                  xtype: 'button',
                  text: 'clear filters',
                  action: 'clear-filters',
                  hidden: true
              }]
          },{
              xtype: 'button',
              action: 'settings',
              iconCls: 'x-fa fa-gear',
              width: 32,
              scale: 'medium',
              iconAlign: 'center',
              arrowVisible: false,
              arrowAlign: 'top',
              menu: {
                  items: [{
                      xtype: 'menucheckitem',
                      text: 'include archived',
                      name: 'include-archived',
                      value: false,
                  }]
              }
          }]
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
              },
              filter: {
                  type: 'string',
                  operator: null,
                  itemDefaults: {
                      emptyText: 'Search for...'
                  }
              }
          },
          {
              text: 'Created by',
              dataIndex: 'Creator',
              flex: 1,
              xtype: 'templatecolumn',
              tpl: [
                  '<tpl for="Creator">{FirstName} {LastName}</tpl>'
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
              text: 'Created',
              dataIndex: 'Created',
              width: 120,
              xtype: 'datecolumn',
              format: 'm-d-Y',
              // Todo: Getting "Filter operators are not currently supported on the sparkpoints proxy" error even when operator set to null
              // filter: {
              //     type: 'date',
              //     operator: null,
              //     submitFormat: 'Y-m-d'
              // }
          }
      ]
  },

  store: 'Tasks'
});