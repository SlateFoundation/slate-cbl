Ext.define('SlateDemonstrationsStudent.view.Dashboard', {
    extend: 'Ext.Container',
    xtype: 'slate-demonstrations-student-demonstration-dashboard',
    requires:[
        'Slate.cbl.Util',

        'Slate.cbl.widget.Popover',
        
        'SlateDemonstrationsStudent.controller.Dashboard',
        
        'SlateDemonstrationsStudent.view.CompetencyCard',
        'SlateDemonstrationsStudent.view.RecentProgress',

        'Slate.cbl.store.Competencies',
        'Slate.cbl.store.Completions',
        'Slate.cbl.store.DemonstrationSkills',

        'Slate.cbl.data.Skills'
    ],

    config: {
        studentId: null,

        popover: {
            pointer: 'none'
        },
        
        competencyCard: true,
        recentProgress: true,
        
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

    // autoEl: {
    //     tag: 'ul',
    //     cls: 'cbl-competency-panels'
    // },
    // defaultType: 'slate-demonstrations-student-competencycard',
    // layout: 'container',


    // config handlers
    applyPopover: function(newPopover, oldPopover) {
        return Ext.factory(newPopover, 'Slate.cbl.widget.Popover', oldPopover);
    },
    
    applyCompetencyCard: function(newCard, oldCard) {
        return Ext.factory(newCard, 'SlateDemonstrationsStudent.view.CompetencyCard', oldCard);  
    },
    
    applyRecentProgress: function(newRecentProgress, oldRecentProgress) {
        return Ext.factory(newRecentProgress, 'SlateDemonstrationsStudent.view.RecentProgress', oldRecentProgress);  
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
    },
    
    initComponent: function() {
        var me = this;
        
        me.callParent(arguments);
        
        me.add(me.getRecentProgress());
        me.add(me.getCompetencyCard());
    }
});