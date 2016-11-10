/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Recorder.UI.ActionIconColumn', {
    extend       : 'Ext.grid.Column',
    alias        : 'widget.recorderactioniconcolumn',
    dataIndex    : 'action',
    width        : 28,
    sortable     : false,
    menuDisabled : true,
    align        : 'center',
    tdCls        : 'siesta-recorderpanel-action-icon-column',

    constructor : function () {
        this.scope  = this;

        this.callParent(arguments);
    },

    renderer : function (value, meta, record) {
        if (value && record.get('leaf')) {
            var cls = this.getCssByActionType(value);

            return '<span class="action-icon fa ' + cls + '"></span>';
        }
    },

    getCssByActionType : function (type) {
        if (type.match('^wait')) return 'fa-clock-o';
        if (type.match('^move')) return 'fa-arrows';
        if (type === 'type' || type === 'setValue') return 'fa-keyboard-o';
        if (type === 'screenshot') return 'fa-camera';
        if (type === 'fn') return 'fa-code';

        return 'fa-mouse-pointer';
    }
});
