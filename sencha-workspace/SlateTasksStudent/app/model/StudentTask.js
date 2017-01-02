Ext.define('SlateTasksStudent.model.StudentTask', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.Records',
    ],

    // model config

    idProperty: 'ID',


    fields: [
        {
            name: 'ID',
    //        type: 'int'
        },
        {
            name: 'ParentID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'StudentTaskID',
            type: 'int'
        },
        {
            name: 'TaskTitle',
            type: 'string'
        },
        {
            name: 'TaskStatus',
            type: 'string'
        },
        {
            name: 'SectionTitle',
            type: 'string',
            mapping: 'Section.Title',
            persist: false
        },
        {
            name: 'Status',
            mapping: 'TaskStatus',
            type: 'string'
        },
        {
            name: 'DueDate',
            type: 'date',
            allowNull: true
        },
        {
            name: 'Submitted',
            type: 'date',
            mapping: 'SubmittedTimestamp',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'filtered',
            type: 'boolean',
            persist: false,
            defaultValue: false
        }
    ],

    proxy: {
        type: 'slate-records',
        url: '/cbl/student-tasks-new'
    }

});
