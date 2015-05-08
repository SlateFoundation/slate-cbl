/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.store.Competencies', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.cbl.API'
    ],

    model: 'Slate.cbl.model.Competency',
    pageSize: 0,

    constructor: function(config) {
        config = config || {};
        config.session = Slate.cbl.API.getSession();

        this.callParent([config]);

        this.loadedContentAreas = {};
    },
    
    getAllByContentArea: function(contentArea, callback, scope) {
        var me = this,
            loadedContentAreas = this.loadedContentAreas;

        contentArea = contentArea.isModel ? contentArea.getId() : parseInt(contentArea, 10);

        if (contentArea in loadedContentAreas) {
            return Ext.callback(callback, scope, loadedContentAreas[contentArea]);
        }

        me.load({
            addRecords: true,
            params: {
                'content-area': contentArea
            },
            callback: function() {
                Ext.callback(callback, scope, [loadedContentAreas[contentArea] = me.query('ContentAreaID', contentArea)]);
            }
        });
    }

    // TODO: write to global ContantAreas store instead?
//    onProxyLoad: function(operation) {
//        var me = this,
//            rawData = me.getProxy().getReader().rawData,
//            contentAreas = me.contentAreas;
//
//        if (!contentAreas) {
//            contentAreas = me.contentAreas = new Ext.util.Collection({
//                keyFn: Slate.cbl.API.recordKeyFn
//            });
//        } else {
//            contentAreas.removeAll();
//        }
//
//        if (rawData.related && rawData.related.ContentArea) {
//            contentAreas.add(rawData.related.ContentArea);
//        }
//
//        me.callParent(arguments);
//    }
});