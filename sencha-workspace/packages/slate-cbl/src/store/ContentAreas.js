/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.store.ContentAreas', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.cbl.API'
    ],

    model: 'Slate.cbl.model.ContentArea',
    pageSize: 0,

    constructor: function(config) {
        config = config || {};
        config.session = Slate.cbl.API.getSession();
        this.callParent([config]);
    }
});