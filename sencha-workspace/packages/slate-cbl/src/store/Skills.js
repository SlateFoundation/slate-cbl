Ext.define('Slate.cbl.store.Skills', {
    extend: 'Ext.data.Store',
    alias: 'store.slate-cbl-skills',
    requires: [
        /* global Slate */
        'Slate.sorter.Code'
    ],


    model: 'Slate.cbl.model.Skill',
    config: {
        competency: null,

        pageSize: 0,
        remoteSort: false,
        sorters: true
    },


    // model lifecycle
    constructor: function() {
        this.callParent(arguments);
        this.dirty = true;
    },


    // config handlers
    updateCompetency: function(competency) {
        this.getProxy().setExtraParam('competency', competency || null);
        this.dirty = true;
    },

    applySorters: function(sorters) {
        if (sorters === true) {
            sorters = new Slate.sorter.Code();
        }

        return this.callParent([sorters]);
    },


    // member methods
    loadIfDirty: function() {
        if (!this.dirty) {
            return;
        }

        this.dirty = false;
        this.load();
    },

    unload: function() {
        this.loadCount = 0;
        this.removeAll();
    },

    getAllByCompetency: function(competency, callback, scope) {
        competency = competency.isModel ? competency.getId() : parseInt(competency, 10);

        return Ext.callback(callback, scope, [this.queryBy(function(skill) {
            return skill.get('CompetencyID') == competency;
        })]);
    },

    getByCode: function(code) {
        var index = code ? this.findExact('Code', code) : -1;

        return index == -1 ? null : this.getAt(index);
    }
});