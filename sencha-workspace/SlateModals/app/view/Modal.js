Ext.define('SlateModals.view.Modal', {
    extend: 'Ext.Window',
    xtype: 'slate-modal',

    bodyPadding: 16,
    bodyStyle: {
        backgroundColor: '#f5f5f5'
    },
    constrain: true,
    scrollable: true,
    width: 560
})