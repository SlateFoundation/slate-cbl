Ext.define('Slate.cbl.widget.SimplePanel', {
    extend: 'Ext.Container',
    xtype: 'slate-simplepanel',

    baseCls: 'slate-simplepanel',

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
                    html: 'Simple Panel',
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
