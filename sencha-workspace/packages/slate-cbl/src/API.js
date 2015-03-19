/*jslint browser: true ,undef: true *//*global Ext*/
Ext.define('Slate.cbl.API', {
    extend: 'Emergence.util.AbstractAPI',
    singleton: true,

    recordKeyFn: function(recordData) {
        return recordData.ID;
    },

    getSkills: function(competencyId, callback, scope) {
        var me = this;

        me.request({
            url: '/cbl/skills',
            method: 'GET',
            params: {
                competency: competencyId
            },
            success: function(response) {
                me.fireEvent('skillsload', response, competencyId);
                Ext.callback(callback, scope, [response]);
            }
        });
    },
    
    getRecentProgress: function(studentId, contentAreaCode, callback, scope) {
        var me = this,
            params = {
                limit: 10,
                student: studentId
            };

        me.request({
            url: '/cbl/content-areas/' + contentAreaCode + '/recent-progress',
            method: 'GET',
            params: params,
            success: function(response) {
                me.fireEvent('recentprogressload', response.data.data, studentId, contentAreaCode);
                Ext.callback(callback, scope, [response.data.data]);
            }
        });
    }
});