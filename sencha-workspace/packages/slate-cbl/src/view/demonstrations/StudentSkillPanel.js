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
        'Slate.cbl.model.Competency',
        'Slate.cbl.field.CompetencySelector',
        'Slate.cbl.field.SkillSelector',
        'Slate.cbl.view.demonstrations.SkillStatement',
        'Slate.cbl.view.demonstrations.SkillList'
    ],


    config: {
        showEditLinks: false,

        selectedStudent: null,
        selectedSkill: null,
        selectedDemonstration: null,

        loadedSkill: null,
        loadedCompetency: null,

        defaults: {
            labelAlign: 'right',
            labelWidth: 100
        },

        competencySelector: {
            matchFieldWidth: true,
            lazyAutoLoad: false,
            allowBlank: false,
            loadSummaries: false
        },
        skillSelector: {
            matchFieldWidth: true,
            lazyAutoLoad: false,
            allowBlank: false,
            loadSummaries: false,
            emptyText: 'Select'
        },
        skillStatement: true,
        demonstrationSkillsList: true,

        title: 'Skill History'
    },


    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },


    // config handlers
    updateShowEditLinks: function(showEditLinks) {
        this.getDemonstrationSkillsList().setShowEditLinks(showEditLinks);
    },

    applySelectedStudent: function(selectedStudent) {
        return selectedStudent && selectedStudent.isModel ? selectedStudent.getId() : selectedStudent;
    },

    updateSelectedStudent: function(selectedStudent, oldSelectedStudent) {
        var me = this;

        me.getDemonstrationSkillsList().getStore().setStudent(selectedStudent || '*current');
        me.loadSkillsIfReady();

        me.fireEvent('selectedstudentchange', me, selectedStudent, oldSelectedStudent);
    },

    applySelectedSkill: function(selectedSkill) {
        if (!selectedSkill) {
            return null;
        }

        return selectedSkill.isModel ? selectedSkill.get('Code') : selectedSkill;
    },

    updateSelectedSkill: function(selectedSkill, oldSelectedSkill) {
        var me = this;

        me.getDemonstrationSkillsList().getStore().setSkill(selectedSkill);
        me.loadSkillsIfReady();

        if (!selectedSkill) {
            me.setLoadedSkill(null);
            me.getSkillSelector().clearValue();
            me.getDemonstrationSkillsList().getStore().unload();
        }

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

            skill = Slate.cbl.model.Skill.create(skill);
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

    applyLoadedCompetency: function(competency, oldCompetency) {
        if (!competency) {
            return null;
        }

        if (!competency.isModel) {
            if (oldCompetency && competency.ID == oldCompetency.getId()) {
                oldCompetency.set(competency, { dirty: false });
                return oldCompetency;
            }

            competency = Slate.cbl.model.Competency.create(competency);
        }

        return competency;
    },

    updateLoadedCompetency: function(competency, oldCompetency) {
        var me = this,
            competencySelector = me.getCompetencySelector(),
            competenciesStore = competencySelector.getStore(),
            loadedSkill = me.getLoadedSkill(),
            skillSelector, skillsStore;

        if (competency) {
            competenciesStore.setContentArea(competency.get('ContentAreaID'));
            competencySelector.setValue(competency);

            // reload skills store with just selected skill if its not in the current result set
            if (!competencySelector.getSelectedRecord()) {
                competenciesStore.loadRecords([competency]);
            }
        }

        if (!competency || !loadedSkill || loadedSkill.get('CompetencyID') != competency.getId()) {
            skillSelector = me.getSkillSelector();
            me.setSelectedSkill(null);
            skillSelector.getStore().unload();

            if (competency) {
                skillsStore = skillSelector.getStore();
                skillsStore.setCompetency(competency.getId());
                skillsStore.loadIfDirty();
                skillSelector.expand();
            }
        }

        me.fireEvent('loadedcompetencychange', me, competency, oldCompetency);
    },

    applyCompetencySelector: function(competencySelector, oldCompetencySelector) {
        if (typeof competencySelector === 'boolean') {
            competencySelector = {
                hidden: !competencySelector
            };
        }

        return Ext.factory(competencySelector, 'Slate.cbl.field.CompetencySelector', oldCompetencySelector);
    },

    updateCompetencySelector: function(competencySelector, oldCompetencySelector) {
        if (oldCompetencySelector) {
            oldCompetencySelector.un({
                scope: this,
                beforequery: 'onCompetencySelectorBeforeQuery',
                select: 'onCompetencySelectorSelect'
            });
        }

        if (competencySelector) {
            competencySelector.on({
                scope: this,
                beforequery: 'onCompetencySelectorBeforeQuery',
                select: 'onCompetencySelectorSelect'
            });
        }
    },

    applySkillSelector: function(skillSelector, oldSkillSelector) {
        if (typeof skillSelector === 'boolean') {
            skillSelector = {
                hidden: !skillSelector
            };
        }

        return Ext.factory(skillSelector, 'Slate.cbl.field.SkillSelector', oldSkillSelector);
    },

    updateSkillSelector: function(skillSelector, oldSkillSelector) {
        if (oldSkillSelector) {
            oldSkillSelector.un({
                scope: this,
                beforequery: 'onSkillSelectorBeforeQuery',
                select: 'onSkillSelectorSelect'
            });
        }

        if (skillSelector) {
            skillSelector.on({
                scope: this,
                beforequery: 'onSkillSelectorBeforeQuery',
                select: 'onSkillSelectorSelect'
            });
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
        var me = this;

        if (oldDemonstrationSkillsList) {
            oldDemonstrationSkillsList.getStore().un('load', 'onDemonstrationSkillsStoreLoad', me);
            oldDemonstrationSkillsList.un({
                scope: me,
                editclick: 'onDemonstrationSkillEditClick',
                deleteclick: 'onDemonstrationSkillDeleteClick'
            });
        }

        if (demonstrationSkillsList) {
            demonstrationSkillsList.getStore().on('load', 'onDemonstrationSkillsStoreLoad', me);
            demonstrationSkillsList.on({
                scope: me,
                editclick: 'onDemonstrationSkillEditClick',
                deleteclick: 'onDemonstrationSkillDeleteClick'
            });
        }
    },


    // event handlers
    onDemonstrationSkillsStoreLoad: function(store, records, success) {
        if (!success) {
            return;
        }

        // eslint-disable-next-line vars-on-top
        var skillData = store.getProxy().getReader().rawData.Skill;

        this.setLoadedSkill(skillData || null);
        this.setLoadedCompetency(skillData && skillData.Competency || null);
    },

    onDemonstrationSkillEditClick: function(demonstrationSkillsList, demonstrationId, demonstrationSkill, ev) {
        this.fireEvent('editclick', this, demonstrationId, demonstrationSkill, ev);
    },

    onDemonstrationSkillDeleteClick: function(demonstrationSkillsList, demonstrationId, demonstrationSkill, ev) {
        this.fireEvent('deleteclick', this, demonstrationId, demonstrationSkill, ev);
    },

    onCompetencySelectorBeforeQuery: function(queryPlan) {
        // trigger full store load if params have changed since last load
        queryPlan.combo.getStore().loadIfDirty();
    },

    onCompetencySelectorSelect: function(competencySelector, competency) {
        this.setLoadedCompetency(competency);
    },

    onSkillSelectorBeforeQuery: function(queryPlan) {
        // trigger full store load if params have changed since last load
        queryPlan.combo.getStore().loadIfDirty();
    },

    onSkillSelectorSelect: function(skillSelector, skill) {
        this.setLoadedSkill(skill);
    },


    // component lifecycle
    initItems: function() {
        var me = this;

        me.callParent();

        me.add([
            me.getCompetencySelector(),
            me.getSkillSelector(),
            me.getSkillStatement(),
            me.getDemonstrationSkillsList()
        ]);
    },


    // local methods
    loadSkillsIfReady: function(forceRefresh) {
        var store = this.getDemonstrationSkillsList().getStore();

        if (store.getStudent() !== null && store.getSkill()) {
            store[forceRefresh ? 'load' : 'loadIfDirty']();
        }
    }
});