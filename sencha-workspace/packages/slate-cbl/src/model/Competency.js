/*jslint browser: true, undef: true *//*global Ext,Slate*/
/**
 * TODO:
 * - Use Slate.model.Person from future slate-core package
 */
Ext.define('Slate.cbl.model.Competency', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.API'
    ],

    idProperty: 'ID',
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
    }
});