/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.store.Skills', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.cbl.API'
    ],

    model: 'Slate.cbl.model.Skill',
    config: {
        pageSize: 0,
        asynchronousLoad: false
    },

    constructor: function(config) {
        console.log('constructing', this.$className, config);
        config = config || {};
        config.session = Slate.cbl.API.getSession();

        this.callParent([config]);

        this.loadedCompetencies = {};
    },

    getAllByCompetency: function(competency, callback, scope) {
        var me = this,
            loadedCompetencies = this.loadedCompetencies;

        competency = competency.isModel ? competency.getId() : parseInt(competency, 10);

        if (competency in loadedCompetencies) {
            //return Ext.callback(callback, scope, [loadedCompetencies[competency]]);
        }

        me.load({
            addRecords: false,
            params: {
                competency: competency
            },
            callback: function() {
                var skills = me.query('CompetencyID', competency);

                //loadedCompetencies[competency] = [];
                Ext.callback(callback, scope, [skills]);
            }
        });
    }
});