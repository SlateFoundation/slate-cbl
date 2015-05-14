/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.store.DemonstrationSkills', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.cbl.API'
    ],

    model: 'Slate.cbl.model.DemonstrationSkill',
    pageSize: 0,


    /**
     * Loads all current-level demonstrations for given lists of students and competencies and **add** them to this store.
     * Because demonstartions have a unique ID, any subsequent overlapping loads will not duplicate records
     */
    loadByStudentsAndCompetencies: function(students, competencies, options) {
        options = options || {};
 
        options.params = Ext.apply(options.params || {}, {
            students: Ext.isArray(students) ? students.join(',') : students,
            competencies: Ext.isArray(competencies) ? competencies.join(',') : competencies
        });
        
        if (!options.url) {
            options.url = '/cbl/teacher-dashboard/demonstration-skills';
        }

        options.addRecords = true;

        return this.load(options);
    }
});