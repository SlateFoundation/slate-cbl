/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.data.Students', {
    extend: 'Slate.cbl.store.Students',
    singleton: true,

    storeId: 'cbl-students',
    model: 'Slate.cbl.model.Student'
});