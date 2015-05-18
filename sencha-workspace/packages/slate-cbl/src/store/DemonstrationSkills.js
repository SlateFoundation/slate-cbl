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
    },

    mergeRawData: function(data, demonstrationId) {
        var me = this,
            reader = me.getProxy().getReader(),
            Model = me.getModel(),
            existingRecords = demonstrationId && me.query('DemonstrationID', demonstrationId).collect('ID', 'data'),
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