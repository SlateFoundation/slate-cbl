Ext.define('Slate.cbl.field.TaskSelector', {
    extend: 'Slate.cbl.field.ClearableSelector',
    xtype: 'slate-cbl-taskselector',
    requires: [
        'Slate.cbl.store.tasks.Tasks'
    ],


    config: {
        fieldLabel: 'Task',
        labelWidth: 50,

        displayField: 'Title',
        valueField: 'ID',
        queryParam: 'q',
        minChars: 3,
        autoSelect: false,
        selectOnTab: false
    },


    store: {
        type: 'slate-cbl-tasks',
        proxy: {
            type: 'slate-cbl-tasks',
            summary: true,
            include: ['Creator']
        },
        remoteSort: true,
        sorters: [{
            property: 'Created',
            direction: 'DESC'
        }]
    },

    listConfig: {
        cls: 'slate-boundlist'
    },

    tpl: [
        '<tpl for=".">',
            '<li class="x-boundlist-item">',
                '<div class="slate-boundlist-primary"><span class="slate-boundlist-datum slate-boundlist-title">{Title}</span></div>',
                '<div class="slate-boundlist-secondary">',
                    'Created <span class="slate-boundlist-datum slate-boundlist-date">{Created:date("M j Y")}</span>',
                    '<tpl for="Creator">',
                        '<span class="slate-boundlist-datum slate-boundlist-creator">{FirstName} {LastName}</span>',
                    '</tpl>',
                '</div>',
            '</li>',
        '</tpl>'
    ]
});