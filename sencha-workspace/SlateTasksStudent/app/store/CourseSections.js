Ext.define('SlateTasksStudent.store.CourseSections', {
    extend: 'Slate.store.CourseSections',
    requires: [
        'Slate.proxy.Records'
    ],

    proxy: {
        type: 'slate-records',
        url: '/sections',
        include: 'Term',

        extraParams: {
            'enrolled_user': 'current',
            'sort_current': 1
        }
    }
});
