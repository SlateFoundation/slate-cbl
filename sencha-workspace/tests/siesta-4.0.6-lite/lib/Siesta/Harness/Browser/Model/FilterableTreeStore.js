/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.Model.FilterableTreeStore', {
    extend          : 'Ext.data.TreeStore',

    mixins          : [
        'Sch.data.mixin.FilterableTreeStore'
    ],

    constructor     : function () {
        this.callParent(arguments)
        
        this.initTreeFiltering()
    },

    forEach : function(fn, scope) {
        this.getRootNode().cascadeBy(fn, scope);
    }
})