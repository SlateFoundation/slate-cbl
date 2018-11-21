Ext.define('Slate.cbl.widget.Popover', {
    extend: 'Ext.Component',
    xtype: 'slate-cbl-popover',

    config: {
        pointer: 'left'
    },

    autoEl: 'aside',
    componentCls: 'cbl-popover',
    cls: 'point-left',
    defaultAlign: 'tl-tr',
    alignOffset: [10, 0],
    floating: true,
    tpl: [
        '<tpl if="title">',
            '<h1 class="cbl-popover-title">',
                '<svg class="cbl-popover-pointer-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 10" aria-hidden="true" role="presentation">',
                    '<polygon class="cbl-popover-pointer" points="0,5 5,0 5,10" />',
                '</svg>',
            '{title}',
            '</h1>',
        '</tpl>',
        '<div class="cbl-popover-body">',
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
