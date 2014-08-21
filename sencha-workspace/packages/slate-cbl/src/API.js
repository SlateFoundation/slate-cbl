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

    getCompetencies: function(studentIds, contentAreaId, callback, scope) {
        var me = this;

        me.request({
            url: '/cbl/teacher-dashboard/competencies',
            method: 'GET',
            params: {
                students: studentIds.join(','),
                'content-area': contentAreaId
            },
            success: function(response) {
                me.fireEvent('competenciesload', response, studentIds, contentAreaId);
                Ext.callback(callback, scope, [response]);
            }
        });
    },

    getDemonstrations: function(studentIds, competencyId, callback, scope) {
        var me = this;

        me.request({
            url: '/cbl/teacher-dashboard/demonstrations',
            method: 'GET',
            params: {
                students: studentIds.join(','),
                competency: competencyId
            },
            success: function(response) {
                me.fireEvent('demonstrationsload', response, studentIds, competencyId);
                Ext.callback(callback, scope, [response]);
            }
        });
    }
});