/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.widget.Popover', {
    extend: 'Ext.Component',
    xtype: 'slate-cbl-popover',


    autoEl: 'aside',
    componentCls: 'popover',
    cls: 'point-left',
    defaultAlign: 'tl-tr',
    floating: true,
    tpl: [
        '<h1 class="popover-title">',
            '<svg class="popover-pointer-img" viewBox="0 0 5 10" aria-hidden="true">',
                '<polygon class="popover-pointer" points="0,5 5,0 5,10" />',
            '</svg>',
            '{title}',
        '</h1>',
        '<div class="popover-body">{body}</div>'
    ]
});