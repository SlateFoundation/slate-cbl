/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.data.CBLLevels', {
    extend: 'Slate.cbl.store.CBLLevels',
    singleton: true,

    storeId: 'cbl-levels',
    model: 'Slate.cbl.model.CBLLevel'
});