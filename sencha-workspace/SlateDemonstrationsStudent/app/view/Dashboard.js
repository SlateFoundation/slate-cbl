Ext.define('SlateDemonstrationsStudent.view.Dashboard', {
    extend: 'Ext.Container',
    xtype: 'slate-demonstrations-student-dashboard',
    requires:[
        'Slate.cbl.widget.Popover',
        'Slate.cbl.store.Competencies',
        'Slate.cbl.store.Completions',
        'Slate.cbl.store.DemonstrationSkills',

        'SlateDemonstrationsStudent.view.CompetencyCard'
    ],

    config: {
        studentId: null,
        contentAreaId: null,

        popover: {
            pointer: 'none'
        },

        competenciesStatus: 'unloaded',

        competenciesStore: {
            xclass: 'Slate.cbl.store.Competencies'
        },

        skillsStore: 'cbl-skills',

        completionsStore: {
            xclass: 'Slate.cbl.store.Completions'
        },

        demonstrationSkillsStore: {
            xclass: 'Slate.cbl.store.DemonstrationSkills'
        }
    },

    autoEl: {
        tag: 'ul',
        cls: 'cbl-competency-panels'
    },
    defaults: {
        xtype: 'slate-demonstrations-student-competencycard',
        autoEl: 'li'
    },
    layout: 'container',


    // config handlers
    applyPopover: function(newPopover, oldPopover) {
        return Ext.factory(newPopover, 'Slate.cbl.widget.Popover', oldPopover);
    },

    updateCompetenciesStatus: function(newStatus, oldStatus) {
        if (oldStatus) {
            this.removeCls('competencies-' + oldStatus);
        }

        if (newStatus) {
            this.addCls('competencies-' + newStatus);
        }
    },

    updateContentAreaId: function(contentAreaId) {
        this.getCompetenciesStore().getAllByContentArea(contentAreaId, this.loadCompletions, this);
    },

    updateStudentId: function() {
        this.loadCompletions();
    },

    applyCompetenciesStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    applySkillsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    applyCompletionsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    applyDemonstrationSkillsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    loadCompletions: function() {
        var me = this,
            competenciesStore = me.getCompetenciesStore(),
            studentId = me.getStudentId(),
            contentAreaId = me.getContentAreaId();

        if (!studentId || !contentAreaId) {
            return;
        }

        me.setCompetenciesStatus('loading');
        me.mask('Loading&hellip;');

        competenciesStore.filter({
            property: 'ContentAreaID',
            value: contentAreaId
        });

        me.removeAll(true);
        me.getCompletionsStore().loadByStudentsAndCompetencies(studentId, competenciesStore.collect('ID'), {
            callback: function(completions) {
                me.add(Ext.Array.map(completions || [], function(completion) {
                    return {
                        competency: competenciesStore.getById(completion.get('CompetencyID')),
                        completion: completion,
                        autoEl: 'li'
                    };
                }));

                me.setCompetenciesStatus('loaded');
                me.unmask();
            }
        });
    }
});