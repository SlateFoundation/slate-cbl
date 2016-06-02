/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.store.ContentAreas', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.Records'
    ],


    model: 'Slate.cbl.model.ContentArea',
    pageSize: 0,

    proxy: {
        type: 'slate-records'
    }

});