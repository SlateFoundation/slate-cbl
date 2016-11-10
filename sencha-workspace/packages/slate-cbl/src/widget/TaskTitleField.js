Ext.define('Slate.cbl.widget.TaskTitleField', {
    extend: 'Ext.form.field.ComboBox',
    requires: [
        'Slate.cbl.model.Task'
    ],

    xtype: 'slate-tasks-titlefield',

    fieldLabel: 'Title',
    name: 'Title',
    valueField: 'Title',
    queryParam: 'q',
    listConfig: {
        cls: 'slate-boundlist'
    },
    store: {
        model: 'Slate.cbl.model.Task',
        autoLoad: true
    },
    tpl: [
        '<tpl for=".">',
            '<li class="x-boundlist-item">',
                '<div class="slate-boundlist-primary"><span class="slate-boundlist-datum slate-boundlist-title">{Title}</span></div>',
                '<div class="slate-boundlist-secondary">',
                    '<span class="slate-boundlist-datum slate-boundlist-creator">{CreatorFullName}</span>',
                    '<span class="slate-boundlist-datum slate-boundlist-date">{Created:date("M j Y")}</span>',
                '</div>',
            '</li>',
        '</tpl>'
    ],
    displayTpl: [
        '<tpl for=".">{Title}</tpl>'
    ],
    selectOnTab: false
});