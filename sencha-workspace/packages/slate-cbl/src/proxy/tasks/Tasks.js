Ext.define('Slate.cbl.proxy.tasks.Tasks', {
    extend: 'Slate.proxy.Records',
    alias: 'proxy.slate-cbl-tasks',


    config: {
        url: '/cbl/tasks',
        include: [
            'Creator',
            'ParentTask',
            'Skills',
            'Attachments.File',
            'StudentTasks'
        ],
        timeout: 180000 // extended timeout for handling attachment permission requests
    }
});