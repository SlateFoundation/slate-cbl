Ext.define('SlateTasksTeacher.model.CourseSection', {
    extend: 'Slate.model.CourseSection',
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