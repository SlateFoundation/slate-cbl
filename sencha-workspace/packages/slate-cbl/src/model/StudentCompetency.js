Ext.define('Slate.cbl.model.StudentCompetency', {
    extend: 'Ext.data.Model',


    // model config
    fields: [
        {
            name: 'StudentID',
            type: 'int'
        },
        {
            name: 'CompetencyID',
            type: 'int'
        },
        {
            name: 'Level',
            type: 'int'
        },
        {
            name: 'EnteredVia',
            type: 'string'
        },
        {
            name: 'BaselineRating',
            type: 'int',
            allowNull: true
        },


        // virtual fields
        {
            name: 'demonstrationsLogged',
            type: 'int',
            allowNull: true
        },
        {
            name: 'demonstrationsComplete',
            type: 'int',
            allowNull: true
        },
        {
            name: 'demonstrationsAverage',
            type: 'float',
            allowNull: true
        },
        {
            name: 'growth',
            type: 'float',
            allowNull: true
        }
    ],


    // generate compound IDs
    statics: {
        getIdFromData: function (data) {
            return data.StudentID + '-' + data.CompetencyID;
        }
    },

    constructor: function (data) {
        data.id = data.id || this.self.getIdFromData(data);
        this.callParent(arguments);
    }
});