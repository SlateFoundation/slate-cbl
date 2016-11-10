/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Recorder.UI.ActionColumn', {
    extend       : 'Ext.tree.Column',
    alias        : 'widget.recorderactioncolumn',
    dataIndex    : 'action',
    width        : 100,
    sortable     : false,
    menuDisabled : true,
    tdCls        : 'siesta-recorderpanel-typecolumn',
    editor       : 'typeeditor',

    constructor : function () {
        var R       = Siesta.Resource('Siesta.Recorder.UI.RecorderPanel');
        this.text   = R.get('actionColumnHeader');

        this.callParent(arguments);
    },

    renderer : function(value, meta, record) {
        meta.tdCls = ' action-level-' + (record.parentNode.data.root ? '0' : '1');

        return value;
    }
});
