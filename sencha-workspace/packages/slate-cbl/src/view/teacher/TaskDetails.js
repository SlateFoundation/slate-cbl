Ext.define('Slate.cbl.view.teacher.TaskDetails', {
    extend: 'Ext.Panel',
    xtype: 'slate-taskdetails',
    requires:[
    ],

    config: {
    },

    title: 'Task Details',

    componentCls: 'slate-taskdetails',

    bodyPadding: 16,

    header: {
        padding: '11 16'
    },

    html: [
        '<h4>Google Docs:</h4>',
        '<ul class="slate-taskdetails-doclist">',
            '<li><span class="title">Document Name</span></li>',
            '<li><span class="title">Document Name</span></li>',
        '</ul>',

        '<hr>',

        '<h4>Instructions:</h4>',
        '<p>These are the instructions a teacher wrote about a task. The quick brown fox jumps over the lazy dog. Grumpy wizards make a toxic brew for the jovial queen.</p>'
    ]
});