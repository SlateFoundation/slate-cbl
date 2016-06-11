Ext.define('Slate.cbl.view.modals.ModalForm', {
    extend: 'Ext.form.Panel',
    xtype: 'slate-modalform',

    componentCls: 'slate-modalform',

    defaultType: 'combo',
    defaults: {
        anchor: '100%',
        autoFitErrors: false,
        combineErrors: true,
        labelAlign: 'right',
        labelPad: 16,
        labelWidth: 144,
        msgTarget: 'side'
    },
});