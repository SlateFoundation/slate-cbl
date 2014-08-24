/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.model.Competency', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.API',
        'Slate.cbl.proxy.Records',
        'Ext.data.identifier.Negative'
    ],

    // model config
    idProperty: 'ID',
    identifier: 'negative',

    fields: [
        // server-persisted fields
        { name: 'ID', type: 'int' },
        { name: 'ContentAreaID', type: 'int' },
        { name: 'Code', type: 'string'},
        { name: 'Descriptor', type: 'string'},
        { name: 'Statement', type: 'string'},

        // server-provided metadata
        { name: 'totalDemonstrationsNeeded', persist: false, type: 'integer' },
        { name: 'studentDemonstrations', persist: false, defaultValue: {} },

        // in-browser state
        { name: 'expanded', persist: false, type: 'boolean', defaultValue: false },
        { name: 'skillsRendered', persist: false, type: 'boolean', defaultValue: false },
        { name: 'skills', persist: false }
    ],

    proxy: {
        type: 'slate-cbl-records',
        url: '/cbl/competencies'
    },
    
    withSkills: function(callback, scope) {
        var me = this,
            skills = me.get('skills');
        
        if (skills) {
            Ext.callback(callback, scope, [skills]);
            return;
        }

        Slate.cbl.API.getSkills(me.getId(), function(response) {
            skills = new Ext.util.Collection({
                keyFn: Slate.cbl.API.recordKeyFn
            });
            
            skills.add(response.data.data);
            me.set('skills', skills);
            Ext.callback(callback, scope, [skills]);
        });
    },
    
    getDemonstrationsForStudents: function(studentIds, callback, scope) {
        var me = this;

        Slate.cbl.API.request({
            method: 'GET',
            url: '/cbl/competencies/' + me.get('Code') + '/demonstrations',
            params: {
                students: studentIds.join(',')
            },
            success: function(response) {
                Ext.callback(callback, scope, [response.data && response.data.data]);
            }
        });
    }
});