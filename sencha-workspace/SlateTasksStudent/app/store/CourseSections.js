Ext.define('SlateTasksStudent.store.CourseSections', {
    extend: 'Slate.store.CourseSections',
    requires: [
        'Slate.proxy.Records'
    ],

    proxy: {
        type: 'slate-records',
        url: '/sections',

        extraParams: {
            enrolled_user: 'current'
        }
    }
});
