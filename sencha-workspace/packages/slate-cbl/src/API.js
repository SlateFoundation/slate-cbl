/*jslint browser: true ,undef: true *//*global Ext*/
Ext.define('Slate.cbl.API', {
    singleton: true,
    requires: [
        'Ext.data.Session',
        'Slate.API'
    ],


    // TODO: merge upstream to Jarvus.util.AbstractAPI
    getSession: function() {
        return this.session || (this.session = new Ext.data.Session());
    },

    // TODO: move to a model + store
    getRecentProgress: function(studentId, contentAreaCode, callback, scope) {
        var API = Slate.API;

        API.request({
            url: '/cbl/content-areas/' + contentAreaCode + '/recent-progress',
            method: 'GET',
            params: {
                limit: 10,
                student: studentId
            },
            success: function(response) {
                API.fireEvent('recentprogressload', response.data.data, studentId, contentAreaCode);
                Ext.callback(callback, scope, [response.data.data]);
            }
        });
    }
});