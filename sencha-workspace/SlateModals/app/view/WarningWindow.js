Ext.define('SlateModals.view.WarningWindow', {
    extend: 'Ext.window.Window',
    requires: [],

    xtype: 'slate-warningwindow',
    componentCls: 'slate-warning-window',

    center: true,

    config: {
        messageTpl: [
            '<p><strong>The skills you removed from this task have already been rated for:</strong></p>',
            '<ul>',
                '<tpl for="students">',
                    '<li>{.}</li>',
                '</tpl>',
            '</ul>',
            '<p><strong>These students will retain their existing evaluations.</strong></p>'
        ]
    },

    data: {
        students: [
            'Chris Alfano',
            'Jessie Cunningham',
            'John Fazio',
            'Christian Kunkel',
            'Alexandra Wiest',
        ]
    },

    items: [
        {
            itemId: 'messageArea',
            xtype: 'component'
        },
        {
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    xtype: 'button',
                    text: 'Undo Remove'
                },
                {
                    xtype: 'button',
                    text: 'I Understand',
                    ui: 'default'
                }
            ]
        }
    ],

    // afterRender: function() {
    //     var me = this,
    //         messageArea = me.down('#messageArea');

    //     console.log(messageArea);
    //     // messageArea.setTpl(me.messageTpl);
    //     // messageArea.update(me.data);
    // }
});