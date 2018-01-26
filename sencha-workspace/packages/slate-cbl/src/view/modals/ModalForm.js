/**
 * TODO: figure out if we want to use this error template and implement it
 */
Ext.define('Slate.cbl.view.modals.ModalForm', {
    extend: 'Ext.form.Panel',
    xtype: 'slate-modalform',

    componentCls: 'slate-modalform',

    defaultType: 'combo',
    defaults: {
        anchor: '100%',
        beforeSubTpl: [
            '<div class="slate-field-warning">',
                '<div class="slate-field-warning-popover">',
                    '<strong>Some students will not be affected because of reasons:</strong>',
                    '<ul>',
                        '<li>Foo Bar Baz</li>',
                        '<li>Wibble Wobble Wubble</li>',
                        '<li>Jane Doe</li>',
                    '</ul>',
                '</div>',
            '</div>'
        ],
        combineErrors: true,
        labelAlign: 'right',
        labelPad: 16,
        labelWidth: 144,
        msgTarget: 'under'
    }
});