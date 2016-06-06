Ext.define('SlateTasksManager.view.TaskDetails', {
    extend: 'Ext.Panel',
    xtype: 'slate-tasks-manager-details',
    requires:[
    ],

    config: {
    },

    title: 'Task Details',

    componentCls: 'slate-tasks-manager-details',

    bodyBorder: 1,
    bodyPadding: 16,

    header: {
        padding: '11 16'
    },

    html: [
        '<h4>Google Docs:</h4>',
        '<ul class="slate-tasks-manager-details-doclist">',
            '<li><span class="title">Document Name</span></li>',
            '<li><span class="title">Document Name</span></li>',
        '</ul>',

        '<hr>',

        '<h4>Instructions:</h4>',
        '<p>These are the instructions a teacher wrote about a task. The quick brown fox jumps over the lazy dog. Grumpy wizards make a toxic brew for the jovial queen.</p>'
    ]
});