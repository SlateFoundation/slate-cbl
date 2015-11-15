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
            competencies: Ext.isArray(competencies) ? competencies.join(',') : competencies
        });

        if (Ext.isArray(students)) {
            options.url = '/cbl/teacher-dashboard/demonstration-skills';
            options.params.students = students.join(',');
        } else {
            options.url = '/cbl/student-dashboard/demonstration-skills';
            options.params.student = students;
        }

        options.addRecords = true;

        return this.load(options);
    },

    /**
     * Loads an array of raw DemonstrationSkill data into the store, updating records that already exist. If demonstration
     * is provided, existing skills not in the new list will be removed and embedded demonstration data may be omitted.
     * 
     * @param {Object[]} data Array of DemonstrationSkill raw data
     * @param {Slate.cbl.model.Demonstration} [demonstration] If provided, the data array is assumed to contain all skills for this demonstration
     */
    mergeRawData: function(data, demonstration) {
        var me = this,
            reader = me.getProxy().getReader(),
            Model = me.getModel(),
            existingRecords = demonstration && me.query('DemonstrationID', demonstration.getId()).collect('ID', 'data'),
            demonstrationData = demonstration && demonstration.getData(),
            i, len,
            datum, id, record,
            newRecords = [];


        me.beginUpdate();


        // update existing records and build array of new records
        for (i = 0, len = data.length; i < len; i++) {
            datum = data[i];
            id = Model.getIdFromData(datum);
            record = id && me.getById(id);

            datum = reader.extractModelData(datum);

            if (!datum.Demonstration && demonstrationData) {
                datum.Demonstration = demonstrationData;
            }

            if (id) {
                Ext.Array.remove(existingRecords, id);
            }

            if (record) {
                record.set(datum, {
                    dirty: false
                });
            } else {
                newRecords.push(datum);
            }
        }


        // add new records all together
        me.add(newRecords);


        // remove missing skills from same demonstration
        for (i = 0, len = existingRecords.length; i < len; i++) {
            existingRecords[i] = me.getById(existingRecords[i]);
        }
        me.remove(existingRecords);


        me.endUpdate();
    }
});