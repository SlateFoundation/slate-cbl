/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.data.ContentAreas', {
    extend: 'Ext.data.Store',
    singleton: true,

    storeId: 'cbl-contentareas',
	model: 'Slate.cbl.model.ContentArea',

    constructor: function(config) {
        config = config || {};
        config.session = Slate.cbl.API.getSession();

        this.callParent([config]);
    }
});