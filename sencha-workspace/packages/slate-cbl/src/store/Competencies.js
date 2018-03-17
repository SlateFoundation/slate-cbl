Ext.define('Slate.cbl.store.Competencies', {
    extend: 'Ext.data.Store',
    alias: 'store.slate-cbl-competencies',
    requires: [
        /* global Slate */
        'Slate.sorter.Code'
    ],


    model: 'Slate.cbl.model.Competency',
    config: {
        contentArea: null,

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
    updateContentArea: function(contentArea) {
        this.getProxy().setExtraParam('content_area', contentArea || null);
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

    getAllByContentArea: function(contentArea, callback, scope) {
        contentArea = contentArea.isModel ? contentArea.getId() : parseInt(contentArea, 10);

        return Ext.callback(callback, scope, [this.queryBy(function(competency) {
            return competency.get('ContentAreaId') == contentArea;
        })]);
    },

    getBySkillId: function(skillId) {
        var me = this,
            skillIdMap = me.skillIdMap,
            competenciesCount, competencyIndex = 0, competency,
            skills, skillsLength, skillIndex;

        if (!skillIdMap) {
            skillIdMap = me.skillIdMap = {};
            competenciesCount = me.getCount();

            for (; competencyIndex < competenciesCount; competencyIndex++) {
                competency = me.getAt(competencyIndex);
                skills = competency.get('skillIds') || [];
                skillsLength = skills.length;
                skillIndex = 0;

                for (; skillIndex < skillsLength; skillIndex++) {
                    skillIdMap[skills[skillIndex]] = competency;
                }
            }
        }

        return skillIdMap[skillId] || null;
    },

    getByCode: function(code) {
        var index = code ? this.findExact('Code', code) : -1;

        return index == -1 ? null : this.getAt(index);
    }
});