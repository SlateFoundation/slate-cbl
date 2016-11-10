Ext.define('SlateTasksManager.view.TaskDetails', {
    extend: 'Ext.Panel',
    xtype: 'slate-tasks-manager-details',
    requires:[
    ],

    config: {
        task: null
    },

    title: 'Task Details',

    componentCls: 'slate-tasks-manager-details',

    bodyBorder: 1,
    bodyPadding: 16,

    header: {
        padding: '8 16'
    },

    tpl: [
        '<tpl for=".">',
            '<h4>Attachments</h4>',
            '<ul class="slate-tasks-manager-details-doclist">',
                '<tpl for="Attachments">',
                    '<li><span class="title"><a href="{URL}">{[this.getDisplayValue(values)]}</a></span></li>',
                '</tpl>',
            '</ul>',
            '<hr>',
            '<h4>Instructions:</h4>',
            '<p>{Instructions}</p>',
        '</tpl>',
        {
            getDisplayValue: function(values) {
                return values.Title || values.URL;
            }
        }
    ],

    updateTask: function(task) {
        this.update(task.getData());
    }
});