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
    }
});