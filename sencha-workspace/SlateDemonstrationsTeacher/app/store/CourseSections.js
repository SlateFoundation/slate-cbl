Ext.define('SlateDemonstrationsTeacher.store.CourseSections', {
    extend: 'Slate.store.CourseSections',
    requires: [
        'Slate.proxy.Records'
    ],

    storeId: 'CourseSections',

    remoteSort: true,
    sorters: [{
        property: 'CurrentTerm',
        direction: 'ASC'
    }],

    proxy: {
        type: 'slate-records',
        url: '/sections',
        // include: 'Term',

        extraParams: {
            'enrolled_user': '*current'
        }
    }
});