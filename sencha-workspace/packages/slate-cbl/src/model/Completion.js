/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.model.Completion', {
    extend: 'Ext.data.Model',

    // model config
    fields: [
        { name: 'StudentID', type: 'int' },
        { name: 'CompetencyID', type: 'int' },
        { name: 'currentLevel', type: 'int', allowNull: true },
        { name: 'demonstrationsLogged', type: 'int' },
        { name: 'demonstrationsComplete', type: 'int' },
        { name: 'demonstrationsAverage', type: 'float', allowNull: true },
        { name: 'baselineRating', type: 'float', allowNull: true },
        { name: 'growth', type: 'float', allowNull: true }
    ],

    // generate compound IDs
    statics: {
        getIdFromData: function(data) {
            return data.StudentID + '-' + data.CompetencyID;
        }
    },

    constructor: function(data) {
        data.id = data.id || this.self.getIdFromData(data);
        this.callParent(arguments);
    }
});