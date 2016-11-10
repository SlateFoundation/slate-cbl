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
                    // TODO make this configurable
                    xtype: 'container',
                    layout: 'hbox',
                    itemId: 'tools',
                    items: [
                        {
                            xtype: 'button',
                            ui: 'light',
                            text: 'Filter',
                            menu: {
                                plain: true,
                                showSeparator: false,
                                defaults: {
                                    xtype: 'menucheckitem'
                                },
                                items: [
                                    { xtype: 'component', cls: 'slate-menu-header', html: 'Status' },
                                    { text: 'Past Due Tasks' },
                                    { text: 'Revision Tasks' },
                                    { text: 'On-Time Tasks' },
                                    { xtype: 'component', cls: 'slate-menu-header', html: 'Timeline' },
                                    { text: 'Past Due' },
                                    { text: 'Due Today' },
                                    { text: 'Due This Week' },
                                    { text: 'Due Next Week' },
                                    { text: 'Due in Future' },
                                    { xtype: 'menuseparator' },
                                    {
                                        xtype: 'container',
                                        padding: 8,
                                        layout: {
                                            type: 'hbox',
                                            pack: 'center'
                                        },
                                        items: [
                                            {
                                                xtype: 'button',
                                                text: 'View All'
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        }
    ]
});
