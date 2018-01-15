Ext.define('SlateTasksTeacher.store.CourseSections', {
    extend: 'Slate.store.CourseSections',
    requires: [
        'Slate.proxy.Records'
    ],

    remoteSort: true,
    sorters: [{
        property: 'CurrentTerm',
        direction: 'ASC'
    }],

    proxy: {
        type: 'slate-records',
        url: '/sections',
        include: 'Term',

        extraParams: {
            'enrolled_user': 'current',
            'term' : '*',
        }
    }
});
