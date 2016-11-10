Ext.define('Slate.cbl.view.modals.WarningWindow', {
    extend: 'Ext.Window',
    requires: [],

    xtype: 'slate-warningwindow',
    componentCls: 'slate-warning-window',

    constrain: true,
    header: false,
    modal: true,
    resizable: false,
    width: 400,

    config: {
        messageTpl: [
            '<p><strong>The skills you removed from this task have already been rated for:</strong></p>',
            '<ul>',
                '<tpl for="students">',
                    '<li>{.}</li>',
                '</tpl>',
            '</ul>',
            '<p><strong>These students will retain their existing evaluations.</strong></p>'
        ],

        messageData: {
            students: [
                'Chris Alfano',
                'Jessie Cunningham',
                'John Fazio',
                'Christian Kunkel',
                'Alexandra Wiest'
            ]
        }
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
                    text: 'Undo Remove',
                    ui: 'normal',
                    handler: function(btn, ev) {
                        btn.up('slate-warningwindow').close();
                    }
                },
                {
                    xtype: 'component',
                    flex: 1
                },
                {
                    xtype: 'button',
                    text: 'I Understand',
                    ui: 'default'
                }
            ]
        }
    ],

    beforeRender: function() {
        this.callParent();

        var me = this,
            messageArea = me.down('#messageArea');

        messageArea.tpl = me.getMessageTpl();
        messageArea.data = me.getMessageData();
    }
});