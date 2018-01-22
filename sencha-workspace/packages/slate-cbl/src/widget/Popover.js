/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.widget.Popover', {
    extend: 'Ext.Component',
    xtype: 'slate-cbl-popover',

    config : {
        pointer: 'left'
    },

    autoEl: 'aside',
    componentCls: 'popover',
    cls: 'point-left',
    defaultAlign: 'tl-tr',
    floating: true,
    tpl: [
        '<tpl if="title">',
            '<h1 class="popover-title">',
                '<svg class="popover-pointer-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 10" aria-hidden="true" role="presentation">',
                    '<polygon class="popover-pointer" points="0,5 5,0 5,10" />',
                '</svg>',
            '{title}',
            '</h1>',
        '</tpl>',
        '<div class="popover-body">',
            '{body}',
        '</div>'
    ],

    updatePointer: function(newPointer, oldPointer) {
        this.addCls('point' + newPointer);

        if (oldPointer) {
            this.removeCls('point-' + oldPointer);
        }
    }
});
