/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.store.Completions', {
    extend: 'Ext.data.Store',

    model: 'Slate.cbl.model.Completion',
    pageSize: 0,

    proxy: {
        type: 'api',
        connection: 'Slate.cbl.API',
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
            competencies: Ext.isArray(competencies) ? competencies.join(',') : competencies
        });

        if (Ext.isArray(students)) {
            options.url = '/cbl/teacher-dashboard/completions';
            options.params.students = students.join(',');
        } else {
            options.url = '/cbl/student-dashboard/completions';
            options.params.student = students;
        }

        return this.load(options);
    }
});