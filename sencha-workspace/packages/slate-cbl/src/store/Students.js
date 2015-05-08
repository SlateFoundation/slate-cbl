/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.store.Students', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.cbl.API'
    ],

    model: 'Slate.cbl.model.Student',
    pageSize: 0,
    sorters: [{
        property: 'FullName',
        direction: 'ASC'
    }],

    constructor: function(config) {
        config = config || {};
        config.session = Slate.cbl.API.getSession();
        this.callParent([config]);
    }
});