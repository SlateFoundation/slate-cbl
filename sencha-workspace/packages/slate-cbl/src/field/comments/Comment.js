Ext.define('Slate.cbl.field.comments.Comment', {
    extend: 'Ext.Component',
    xtype: 'slate-cbl-comments-comment',


    // comment configuration
    config: {
    },


    // component configuration
    componentCls: 'slate-cbl-comments-comment',
    tpl: [
        '<tpl for="Creator">',
            '<div class="author">',
                '<a href="{[Slate.API.buildUrl("/people/"+values.ID)]}" target="_blank">',
                    '<img height="56" width="56" alt="{FirstName:htmlEncode} {LastName:htmlEncode}" src="{[Slate.API.buildUrl("/people/"+values.ID+"/thumbnail/112x112/cropped")]}" class="avatar">',
                '</a>',
            '</div>',
        '</tpl>',

        '<div class="message">',
            '<header>',
                '<tpl for="Creator">',
                    '<a href="{[Slate.API.buildUrl("/people/"+values.ID)]}" target="_blank">',
                        '<span class="name">{FirstName} {LastName}</span>',
                    '</a>',
                '</tpl>',
            '</header>',
            '<div class="message-body">{Message:htmlEncode}</div>',
            '<footer>',
                '<time>{Created:date("D, M j, Y \\\\&\\\\m\\\\i\\\\d\\\\d\\\\o\\\\t\\\\; g:i a")}</time>',
            '</footer>',
        '</div>'
    ]
});