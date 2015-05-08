/*jslint browser: true ,undef: true *//*global Ext*/
Ext.define('Slate.cbl.API', {
    extend: 'Emergence.util.AbstractAPI',
    singleton: true,
    requires: [
        'Ext.data.Session'
    ],


    // TODO: merge upstream to Jarvus.util.AbstractAPI
    getSession: function() {
        return this.session || (this.session = new Ext.data.Session());
    },

    // TODO: merge upstream to Emergence.util.AbstractAPI
    recordKeyFn: function(recordData) {
        return recordData.ID;
    },
    
    getRecentProgress: function(studentId, contentAreaCode, callback, scope) {
        var me = this;

        me.request({
            url: '/cbl/content-areas/' + contentAreaCode + '/recent-progress',
            method: 'GET',
            params: {
                limit: 10,
                student: studentId
            },
            success: function(response) {
                me.fireEvent('recentprogressload', response.data.data, studentId, contentAreaCode);
                Ext.callback(callback, scope, [response.data.data]);
            }
        });
    },

    getDemonstrationsByStudentSkill: function(studentId, skillId, callback, scope) {
        this.request({
            method: 'GET',
            url: '/cbl/skills/' + skillId + '/demonstrations',
            params: {
                student: studentId,
                include: 'Demonstration,Demonstration.Creator'
            },
            success: function(response) {
                Ext.callback(callback, scope, [response.data && response.data.data, response.data]);
            }
        });
    },

    getAllDemonstrationsByStudentsCompetency: function(studentIds, competencyId, callback, scope) {
        this.request({
            method: 'GET',
            url: '/cbl/competencies/' + competencyId + '/demonstrations',
            params: {
                students: studentIds.join(',')
            },
            success: function(response) {
                Ext.callback(callback, scope, [response.data && response.data.data]);
            }
        });
    }
});