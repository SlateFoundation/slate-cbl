/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.store.SkillDemonstrations', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.cbl.API'
    ],

    model: 'Slate.cbl.model.SkillDemonstration',
    pageSize: 0,

    constructor: function(config) {
        console.log('constructing', this.$className, config);
        config = config || {};
        config.session = Slate.cbl.API.getSession();

        this.callParent([config]);
    },

    proxy: {
        type: 'api',
        connection: 'Slate.cbl.API',
        url: '/cbl/teacher-dashboard/skill-demonstrations'
    },
    
    /**
     * Loads all current-level demonstrations for given lists of students and competencies and **add** them to this store.
     * Because demonstartions have a unique ID, any subsequent overlapping loads will not duplicate records
     */
    load: function(students, competencies, options) {
        options = options || {};
 
        options.params = Ext.apply(options.params || {}, {
            students: Ext.isArray(students) ? students.join(',') : students,
            competencies: Ext.isArray(competencies) ? competencies.join(',') : competencies
        });

        options.addRecords = true;

        this.callParent([options]);
    }
});