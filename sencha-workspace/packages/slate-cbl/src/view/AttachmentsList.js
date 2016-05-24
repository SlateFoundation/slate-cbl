Ext.define('Slate.cbl.view.AttachmentsList', {
    extend: 'Ext.view.View',
    xtype: 'slate-attachmentslist',

    autoEl: 'ul',
    componentCls: 'slate-attachmentslist',

    itemSelector: '.slate-attachmentslist-item',
    tpl: [
        '<tpl for=".">',
            '<li class="slate-attachmentslist-item <tpl if="kind">slate-attachment-{kind}</tpl>">',
                '<span class="slate-attachment-title"><a href="{url}" target=_blank>{title}</a></span>',
                // TODO hide/show based on whether it's editable
                '<button class="plain"><i class="fa fa-gear"></i></button>',
                '<button class="plain"><i class="fa fa-times-circle"></i></button>',
            '</li>',
        '</tpl>'
    ]
});