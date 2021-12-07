Ext.define('Slate.cbl.field.ContentAreaSelector', {
    extend: 'Slate.cbl.field.ClearableSelector',
    xtype: 'slate-cbl-contentareaselector',
    requires: [
        'Slate.cbl.model.ContentArea'
    ],


    config: {
        fieldLabel: 'Competency Area',
        labelWidth: 130,

        displayField: 'Title',
        valueField: 'Code',
        forceSelection: true,
        editable: false,
        matchFieldWidth: false,
        queryMode: 'local'
    },


    componentCls: 'slate-cbl-contentareaselector',
    store: {
        model: 'Slate.cbl.model.ContentArea',
        pageSize: 0,
        remoteSort: true,
        proxy: {
            type: 'slate-cbl-contentareas',
            summary: true
        }
    }
});
