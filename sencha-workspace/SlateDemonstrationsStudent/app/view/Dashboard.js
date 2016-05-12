Ext.define('SlateDemonstrationsStudent.view.Dashboard', {
    extend: 'Ext.Container',
    xtype: 'slate-demonstrations-student-dashboard',
    requires:[
        // 'SlateDemonstrationsStudent.view.DashboardController',
        'SlateDemonstrationsStudent.view.CompetencyCard',

        'Slate.cbl.Util',

        'Slate.cbl.widget.Popover',

        'Slate.cbl.store.Competencies',
        'Slate.cbl.store.Completions',
        'Slate.cbl.store.DemonstrationSkills',

        'Slate.cbl.data.Skills'
    ],

    controller: 'slate-demonstrations-student-dashboardcontroller',

    config: {
        studentId: null,

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
    defaultType: 'slate-demonstrations-student-competencycard',
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
    }
});