Ext.define('Slate.cbl.widget.SimplePanel', {
    extend: 'Ext.Container',
    xtype: 'slate-simplepanel',

    baseCls: 'slate-simplepanel',

    config: {
        title: '',
        showTools: false
    },

    updateShowTools: function(showTools) {
        var me = this;
        if (me.rendered && Ext.isBoolean(showTools)) {
            me.down('#tools').setVisible(showTools);
        }
    },

    updateTitle: function(title) {
        var me = this;
        if (me.rendered) {
            me.down('#title').update(title);
        }
    },

    afterRender: function() {
        var me = this;
        me.callParent();

        me.down('#title').update(me.getTitle());
        me.down('#tools').setVisible(me.getShowTools());
    },

    items: [
        {
            xtype: 'container',
            componentCls: 'slate-simplepanel-header',
            layout: 'hbox',
            items: [
                {
                    flex: 1,
                    xtype: 'component',
                    cls: 'slate-simplepanel-title',
                    html: '',
                    itemId: 'title'
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    itemId: 'tools',
                    items: [
                        {
                            xtype: 'combo',
                            emptyText: 'Filter'
                        }
                    ]
                }
            ]
        }
    ]
});
