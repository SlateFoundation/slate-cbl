/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.store.AllCompetencies', {
    extend: 'Ext.data.Store',
    requires: [
        'Ext.util.Collection'
    ],

    model: 'Slate.cbl.model.Competency',
    pageSize: 0,
    proxy: {
        type: 'slate-cbl-records',
        url: '/cbl/competencies',
        extraParams: {
            relatedTable: 'ContentArea'
        }
    },

    onProxyLoad: function(operation) {
        var me = this,
            rawData = me.getProxy().getReader().rawData,
            contentAreas = me.contentAreas;

        if (!contentAreas) {
            contentAreas = me.contentAreas = new Ext.util.Collection({
                keyFn: Slate.cbl.API.recordKeyFn
            });
        } else {
            contentAreas.removeAll();
        }

        if (rawData.related && rawData.related.ContentArea) {
            contentAreas.add(rawData.related.ContentArea);
        }

        me.callParent(arguments);
    }
});