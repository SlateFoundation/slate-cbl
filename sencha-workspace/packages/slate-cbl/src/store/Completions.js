/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.store.Completions', {
    extend: 'Ext.data.Store',

    model: 'Slate.cbl.model.Completion',
    pageSize: 0,

    proxy: {
        type: 'api',
        connection: 'Slate.cbl.API',
        url: '/cbl/teacher-dashboard/completions',
        reader: {
            rootProperty: 'data'
        }
    },
    
    /**
     * Loads all completions for given students and competencies list
     * 
     * @param {Number[]} students
     * @param {Number[]} competencies
     * @param {Object} [options]
     */
    loadByStudentsAndCompetencies: function(students, competencies, options) {
        options = options || {};
 
        options.params = Ext.apply(options.params || {}, {
            students: Ext.isArray(students) ? students.join(',') : students,
            competencies: Ext.isArray(competencies) ? competencies.join(',') : competencies
        });

        return this.load(options);
    }
});