Ext.define('Slate.cbl.widget.ContentAreaSelector', {
    extend: 'Slate.cbl.widget.ClearableSelector',
    xtype: 'slate-cbl-contentareaselector',


    config: {
        componentCls: 'slate-cbl-contentareaselector',

        fieldLabel: 'Rubric',
        labelWidth: 60,

        displayField: 'Title',
        valueField: 'Code',
        forceSelection: true,
        editable: false,
        matchFieldWidth: false
    }
});