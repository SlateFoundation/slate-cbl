Ext.define('Slate.cbl.widget.SubmissionsField', {
    extend: 'Ext.form.FieldContainer',

    xtype: 'slate-tasks-submissions',

    fieldLabel: 'Submitted',
    tpl: [
        '<tpl for=".">',
            '<div class="slate-task-submissions-ct">',
                '<ul class="slate-task-submissions">',
                    '<tpl for=".">',
                        '<li class="slate-task-submission">',
                            '<div class="slate-task-submission-date">{[Ext.Date.format(new Date(values.Created * 1000), "H:ia M d, Y")]}</div>',
                        '</li>',
                    '</tpl>',
                '</ul>',
            '</div>',
        '</tpl>'
    ]

});