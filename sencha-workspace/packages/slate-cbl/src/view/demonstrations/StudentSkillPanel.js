/**
 * Provides for a panel displaying a student's progress in a given skill
 *
 * TODO:
 * - [ ] Document configs
 * - [ ] Switch back to Panel parent or rename
 */
Ext.define('Slate.cbl.view.demonstrations.StudentSkillPanel', {
    extend: 'Ext.container.Container',
    xtype: 'slate-cbl-demonstrations-studentskillpanel',
    requires: [
        'Ext.util.Format',

        /* global Slate */
        'Slate.cbl.model.Skill',
        'Slate.cbl.widget.SkillSelector',
        'Slate.cbl.view.demonstrations.SkillStatement',
        'Slate.cbl.view.demonstrations.SkillList'
    ],


    config: {
        selectedStudent: null,
        selectedSkill: null,
        selectedDemonstration: null,
        loadedSkill: null,

        skillSelector: true,
        skillStatement: true,
        demonstrationSkillsList: true,

        title: 'Standard Overview'
    },


    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },


    // config handlers
    updateSelectedStudent: function(selectedStudent, oldSelectedStudent) {
        var me = this;

        me.getDemonstrationSkillsList().getStore().setStudent(selectedStudent);
        me.loadSkillsIfReady();

        me.fireEvent('selectedstudentchange', me, selectedStudent, oldSelectedStudent);
    },

    updateSelectedSkill: function(selectedSkill, oldSelectedSkill) {
        var me = this;

        // me.getSkillSelector().setValue(selectedSkill);
        me.getDemonstrationSkillsList().getStore().setSkill(selectedSkill);
        me.loadSkillsIfReady();

        me.fireEvent('selectedskillchange', me, selectedSkill, oldSelectedSkill);
    },

    updateSelectedDemonstration: function(selectedDemonstration, oldSelectedDemonstration) {
        var me = this;

        me.getDemonstrationSkillsList().setHighlightedDemonstration(selectedDemonstration);

        me.fireEvent('selecteddemonstrationchange', me, selectedDemonstration, oldSelectedDemonstration);
    },

    applyLoadedSkill: function(skill, oldSkill) {
        if (!skill) {
            return null;
        }

        if (!skill.isModel) {
            if (oldSkill && skill.ID == oldSkill.getId()) {
                oldSkill.set(skill, { dirty: false });
                return oldSkill;
            }

            skill = Slate.cbl.model.ContentArea.create(skill);
        }

        return skill;
    },

    updateLoadedSkill: function(skill, oldSkill) {
        var me = this,
            skillSelector = me.getSkillSelector(),
            skillsStore = skillSelector.getStore();

        if (skill) {
            me.setSelectedSkill(skill.get('Code'));

            me.setSkillStatement(skill.get('Statement'));

            skillsStore.setCompetency(skill.get('CompetencyID'));
            skillSelector.setValue(skill);

            // reload skills store with just selected skill if its not in the current result set
            if (!skillSelector.getSelectedRecord()) {
                skillsStore.loadRecords([skill]);
            }
        }

        me.fireEvent('loadedskillchange', me, skill, oldSkill);
    },

    applySkillSelector: function(skillSelector, oldSkillSelector) {
        if (typeof skillSelector === 'boolean') {
            skillSelector = {
                hidden: !skillSelector
            };
        }

        return Ext.factory(skillSelector, 'Slate.cbl.widget.SkillSelector', oldSkillSelector);
    },

    updateSkillSelector: function(skillSelector, oldSkillSelector) {
        if (oldSkillSelector) {
            oldSkillSelector.un('beforequery', 'onSkillSelectorBeforeQuery', this);
        }

        if (skillSelector) {
            skillSelector.setMatchFieldWidth(true);
            skillSelector.lazyAutoLoad = false;
            skillSelector.on('beforequery', 'onSkillSelectorBeforeQuery', this);
        }
    },

    applySkillStatement: function(skillStatement, oldSkillStatement) {
        if (!skillStatement) {
            skillStatement = {
                hidden: true
            };
        } else if (typeof skillStatement === 'string') {
            skillStatement = {
                html: Ext.util.Format.htmlEncode(skillStatement)
            };
        }

        return Ext.factory(skillStatement, 'Slate.cbl.view.demonstrations.SkillStatement', oldSkillStatement);
    },

    applyDemonstrationSkillsList: function(demonstrationSkillsList, oldDemonstrationSkillsList) {
        if (typeof demonstrationSkillsList === 'boolean') {
            demonstrationSkillsList = {
                hidden: !demonstrationSkillsList
            };
        }

        return Ext.factory(demonstrationSkillsList, 'Slate.cbl.view.demonstrations.SkillList', oldDemonstrationSkillsList);
    },

    updateDemonstrationSkillsList: function(demonstrationSkillsList, oldDemonstrationSkillsList) {
        if (oldDemonstrationSkillsList) {
            oldDemonstrationSkillsList.getStore().un('load', 'onDemonstrationSkillsStoreLoad', this);
        }

        if (demonstrationSkillsList) {
            demonstrationSkillsList.getStore().on('load', 'onDemonstrationSkillsStoreLoad', this);
        }
    },


    // event handlers
    onDemonstrationSkillsStoreLoad: function(store, records, success) {
        if (!success) {
            return;
        }

        // eslint-disable-next-line vars-on-top
        this.setLoadedSkill(store.getProxy().getReader().rawData.Skill || null);
    },

    onSkillSelectorBeforeQuery: function(queryPlan) {
        // trigger full store load if params have changed since last load
        queryPlan.combo.getStore().loadIfDirty();
    },


    // component lifecycle
    initItems: function() {
        var me = this;

        me.callParent();

        me.add([
            me.getSkillSelector(),
            me.getSkillStatement(),
            me.getDemonstrationSkillsList()
        ]);
    },


    // local methods
    loadSkillsIfReady: function() {
        var store = this.getDemonstrationSkillsList().getStore();

        if (store.getStudent() && store.getSkill()) {
            store.loadIfDirty();
        }
    }
});