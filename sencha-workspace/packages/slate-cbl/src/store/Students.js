/*jslint browser: true, undef: true *//*global Ext*/
/**
 * TODO:
 * - Use Slate.model.Person from future slate-core package
 */
Ext.define('Slate.cbl.store.Students', {
    extend: 'Ext.data.Store',

    model: 'Slate.cbl.model.Student'
});