Ext.define('Slate.cbl.widget.TaskTitleField', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'slate-tasks-titlefield',
    requires: [
        'Slate.cbl.model.tasks.Task'
    ],


    fieldLabel: 'Title',
    name: 'Title',
    valueField: 'Title',
    displayField: 'Title',
    queryParam: 'q',
    minChars: 3,
    autoSelect: false,
    selectOnTab: false,
    listConfig: {
        cls: 'slate-boundlist'
    },
    store: {
        model: 'Slate.cbl.model.tasks.Task',
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
    tpl: [
        '<tpl for=".">',
            '<li class="x-boundlist-item">',
                '<div class="slate-boundlist-primary"><span class="slate-boundlist-datum slate-boundlist-title">{Title}</span></div>',
                '<div class="slate-boundlist-secondary">',
                    'Created',
                    '<span class="slate-boundlist-datum slate-boundlist-date">{Created:date("M j Y")}</span>',
                    '<tpl for="Creator">',
                        '<span class="slate-boundlist-datum slate-boundlist-creator">{FirstName} {LastName}</span>',
                    '</tpl>',
                '</div>',
            '</li>',
        '</tpl>'
    ]
});