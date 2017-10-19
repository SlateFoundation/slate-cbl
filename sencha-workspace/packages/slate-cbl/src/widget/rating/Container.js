Ext.define('Slate.cbl.widget.rating.Container', {
    extend: 'Ext.container.Container',
    xtype: 'slate-cbl-ratingcontainer',
    requires: [
        'Slate.cbl.widget.rating.Competency'
    ],


    componentCls: 'slate-cbl-ratingcontainer',
    defaultType: 'slate-cbl-ratingcompetency'
});