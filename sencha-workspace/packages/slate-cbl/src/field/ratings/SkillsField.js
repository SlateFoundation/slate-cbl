/**
 * Implements a custom field for looking up skills and inputting ratings
 *
 * Modeled after a combination of FieldContainer and field.Base
 */
Ext.define('Slate.cbl.field.ratings.SkillsField', {
    extend: 'Slate.cbl.field.ratings.AbstractSkillsField',
    xtype: 'slate-cbl-ratings-skillsfield',
    requires: [
        'Ext.button.Button',
        'Ext.util.DelayedTask',

        'Slate.cbl.store.Skills',
        'Slate.cbl.store.Competencies',
        'Slate.cbl.store.StudentCompetencies',
        'Slate.cbl.field.ratings.SkillsCompetency',
        'Slate.cbl.field.ratings.Slider',
        'Slate.cbl.field.SkillsSelector',

        'Jarvus.override.data.RequireLoadedStores',

        /* global Slate */
        'Slate.sorter.Code',
        'Slate.ui.override.AddSorted'
    ],


    config: {
        selectedStudent: null,

        skillsSelector: true,
        addSkillsButton: true,
        footer: true,

        skillsStore: {
            type: 'slate-cbl-skills',
            proxy: {
                type: 'slate-cbl-skills',
                summary: true,
                relatedTable: ['Competency']
            }
        },

        competenciesStore: {
            type: 'slate-cbl-competencies'
        },

        studentCompetenciesStore: {
            type: 'slate-cbl-studentcompetencies'
        }
    },


    // container/component configuration
    componentCls: 'slate-cbl-skillratingsfield',
    layout: 'anchor',
    defaults: {
        xtype: 'slate-cbl-ratings-skillscompetency',
        anchor: '100%'
    },


    // config handlers
    updateSelectedStudent: function(selectedStudent, oldSelectedStudent) {
        var me = this,
            studentCompetenciesStore = me.getStudentCompetenciesStore(),
            studentCompetenciesLoadQueue = me.studentCompetenciesLoadQueue,
            competencyIds, queueLength, queueIndex = 0;

        me.studentCompetenciesLoadTask.cancel();
        studentCompetenciesLoadQueue.length = 0;

        if (oldSelectedStudent) {
            studentCompetenciesStore.unload();
        }

        if (selectedStudent) {
            studentCompetenciesStore.setStudent(selectedStudent);

            competencyIds = Ext.Object.getKeys(me.competencyContainers);
            queueLength = competencyIds.length;

            for (; queueIndex < queueLength; queueIndex++) {
                studentCompetenciesLoadQueue.push(parseInt(competencyIds[queueIndex], 10));
            }

            me.studentCompetenciesLoadTask.delay(50);
        }
    },

    applySkillsSelector: function(skillsSelector, oldSkillsSelector) {
        if (!skillsSelector || typeof skillsSelector == 'boolean') {
            skillsSelector = {
                hidden: !skillsSelector
            };
        }

        if (typeof skillsSelector == 'object' && !skillsSelector.isComponent) {
            skillsSelector = Ext.apply({
                valueField: 'ID',
                fieldLabel: null,
                flex: 1,
                showPermanentTags: false,
                excludeForm: true // exclude from any parent forms
            }, skillsSelector);
        }

        return Ext.factory(skillsSelector, 'Slate.cbl.field.SkillsSelector', oldSkillsSelector);
    },

    updateSkillsSelector: function(skillsSelector) {
        skillsSelector.on('change', 'onSkillsSelectorChange', this);
    },

    applyAddSkillsButton: function(addSkillsButton, oldAddSkillsButton) {
        if (!addSkillsButton || typeof addSkillsButton == 'boolean') {
            addSkillsButton = {
                hidden: !addSkillsButton
            };
        }

        if (typeof addSkillsButton == 'object' && !addSkillsButton.isComponent) {
            addSkillsButton = Ext.apply({
                text: 'Add Skills',
                margin: '0 0 0 10'
            }, addSkillsButton);
        }

        return Ext.factory(addSkillsButton, 'Ext.button.Button', oldAddSkillsButton);
    },

    updateAddSkillsButton: function(addSkillsButton) {
        addSkillsButton.on('click', 'onAddSkillsClick', this);
    },

    applyFooter: function(footer, oldFooter) {
        if (!footer || typeof footer == 'boolean') {
            footer = {
                hidden: !footer
            };
        }

        if (typeof footer == 'object' && !footer.isComponent) {
            footer = Ext.apply({
                layout: {
                    type: 'hbox',
                    align: 'center'
                },
                items: [
                    this.getSkillsSelector(),
                    this.getAddSkillsButton()
                ]
            }, footer);
        }

        return Ext.factory(footer, 'Ext.container.Container', oldFooter);
    },

    applySkillsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateSkillsStore: function(store, oldStore) {
        if (oldStore) {
            oldStore.un('load', 'onSkillsStoreLoad', this);
        }

        if (store) {
            store.on('load', 'onSkillsStoreLoad', this);
        }
    },

    applyCompetenciesStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    applyStudentCompetenciesStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },


    // container lifecycle
    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        me.studentCompetenciesLoadQueue = [];
        me.studentCompetenciesLoaded = [];
        me.studentCompetenciesLoadTask = new Ext.util.DelayedTask(me.loadStudentCompetencies, me);
    },

    initItems: function() {
        var me = this,
            footer = me.getFooter();

        me.callParent();

        // configure sorter for contained items
        me.items.setSorters([
            {
                sorterFn: function(a, b) {
                    if (a === footer) {
                        return 1;
                    }

                    if (b === footer) {
                        return -1;
                    }

                    return 0;
                }
            },
            new Slate.sorter.Code({
                codeFn: function(item) {
                    return item.selectedCompetency;
                }
            })
        ]);

        // add footer to end of items
        me.add(footer);

        // initialize map of competency containers and skill rating fields
        me.competencyContainers = {};
        me.skillRatingFields = {};
    },


    // event handlers
    onSkillsStoreLoad: function(skillsStore) {
        var competenciesCollection = skillsStore.getProxy().relatedCollections.Competency,
            competenciesStore = this.getCompetenciesStore();

        if (!competenciesStore.isLoaded() && competenciesCollection) {
            competenciesStore.loadRawData(competenciesCollection.getRange());
        }
    },

    onSkillsSelectorChange: function(skillsSelector, value) {
        this.getAddSkillsButton().setDisabled(Ext.Array.difference(value, skillsSelector.getPermanentValues()).length == 0);
    },

    onAddSkillsClick: function() {
        var me = this,
            skillsSelector = me.getSkillsSelector();

        me.addSkills(skillsSelector.getValue());

        skillsSelector.clearValue();
        me.getAddSkillsButton().disable();
    },

    onRatingChange: function(ratingSlider, rating) {
        this.setSkillValue(ratingSlider.getSkill().getId(), rating, ratingSlider.getLevel());
    },

    onRatingRemove: function(ratingField) {
        this.removeSkills([ratingField.getSkill().getId()]);
    },


    // public API
    loadValue: function() {
        var me = this;

        Ext.suspendLayouts();

        me.clearSkills();
        me.addSkills(me.getValue());

        Ext.resumeLayouts(true);
    },

    clearSkills: function() {
        var me = this,
            competencyContainers = me.competencyContainers,
            competencyId;

        me.studentCompetenciesLoadTask.cancel();
        me.studentCompetenciesLoadQueue.length = 0;

        Ext.suspendLayouts();

        for (competencyId in competencyContainers) {
            if (!competencyContainers.hasOwnProperty(competencyId)) {
                continue;
            }

            me.remove(competencyContainers[competencyId], true);
            delete competencyContainers[competencyId];
        }

        Ext.resumeLayouts(true);

        me.skillRatingFields = {};
    },

    addSkills(skills) {
        var me = this,
            competencyContainers = me.competencyContainers,
            skillRatingFields = me.skillRatingFields,
            competenciesStore = me.getCompetenciesStore(),
            skillsStore = me.getSkillsStore(),
            studentCompetenciesStore = me.getStudentCompetenciesStore(),
            studentCompetenciesLoadQueue = me.studentCompetenciesLoadQueue,
            studentCompetenciesLoaded = me.studentCompetenciesLoaded,
            skillsSelector = me.getSkillsSelector();

        Ext.StoreMgr.requireLoaded([competenciesStore, skillsStore], function() {
            var skillsLength = skills.length,
                skillIndex = 0, demonstrationSkill,
                skillId, skill,
                competency, competencyId, competencyContainer,
                studentCompetency,
                skillIds = [];

            Ext.suspendLayouts();

            // group skills by competency
            for (; skillIndex < skillsLength; skillIndex++) {
                demonstrationSkill = skills[skillIndex];

                if (typeof demonstrationSkill == 'number') {
                    demonstrationSkill = {
                        SkillID: demonstrationSkill,
                        Removable: true
                    };
                }

                skillId = demonstrationSkill.SkillID;

                // skip skill if a field already exists for it
                if (skillId in skillRatingFields) {
                    continue;
                }

                // load skill/competency from local stores
                skill = skillsStore.getById(skillId);

                if (!skill) {
                    Ext.Logger.warn('Could not lookup skill by ID '+skillId);
                    continue;
                }

                competencyId = skill.get('CompetencyID');
                competency = competenciesStore.getById(competencyId);

                // get or create container for competency
                if (competencyId in competencyContainers) {
                    competencyContainer = competencyContainers[competencyId];
                } else {
                    competencyContainer = competencyContainers[competencyId] = me.addSorted({
                        loadedCompetency: competency
                    });
                }

                // fetch level or queue for loading
                studentCompetency = studentCompetenciesStore.getByCompetencyId(competencyId);

                if (
                    !studentCompetency
                    && studentCompetenciesLoadQueue.indexOf(competencyId) == -1
                    && studentCompetenciesLoaded.indexOf(competencyId) == -1
                ) {
                    studentCompetenciesLoadQueue.push(competencyId);
                }

                me.studentCompetenciesLoadTask.delay(50);

                // create skill field
                skillRatingFields[skillId] = competencyContainer.addSorted({
                    skill: skill,
                    level: studentCompetency ? studentCompetency.get('Level') : null,
                    removable: demonstrationSkill.Removable,
                    listeners: {
                        scope: me,
                        changecomplete: 'onRatingChange',
                        removeclick: 'onRatingRemove'
                    }
                });

                // add to list for permanent values
                skillIds.push(skillId);
            }

            // add skills to permanent values
            skillsSelector.setPermanentValues(Ext.Array.union(skillsSelector.getPermanentValues() || [], skillIds));

            Ext.resumeLayouts(true);
        });
    },

    removeSkills: function(skills) {
        var me = this,
            skillsSelector = me.getSkillsSelector(),
            skillRatingFields = me.skillRatingFields,
            competencyContainers = me.competencyContainers,
            skillsLength = skills.length,
            skillIndex = 0, skillId, skillRatingField, competencyId, competencyContainer;

        Ext.suspendLayouts();

        // remove rating fields
        for (; skillIndex < skillsLength; skillIndex++) {
            skillId = skills[skillIndex];

            // remove value
            me.removeSkillValue(skillId);

            // get existing skill field
            skillRatingField = skillRatingFields[skillId];
            if (!skillRatingField) {
                continue;
            }

            // get containing competency
            competencyContainer = skillRatingField.ownerCt;
            competencyId = Ext.Object.getKey(competencyContainers, competencyContainer);

            // remove skill field
            competencyContainer.remove(skillRatingField, true);
            delete skillRatingFields[skillId];

            // remove containing competency if now empty
            if (competencyContainer.items.getCount() == 0) {
                me.remove(competencyContainer, true);
                delete competencyContainer[competencyId];
            }
        }

        // remove from permanent values
        skillsSelector.setPermanentValues(Ext.Array.difference(skillsSelector.getPermanentValues() || [], skills));

        Ext.resumeLayouts(true);
    },

    loadStudentCompetencies: function() {
        var me = this,
            studentCompetenciesStore = me.getStudentCompetenciesStore(),
            studentCompetenciesLoadQueue = me.studentCompetenciesLoadQueue,
            competencyContainers = me.competencyContainers;

        if (!studentCompetenciesStore.getStudent() || !studentCompetenciesLoadQueue.length) {
            return;
        }

        me.studentCompetenciesLoaded = Ext.Array.union(me.studentCompetenciesLoaded, studentCompetenciesLoadQueue);

        studentCompetenciesStore.load({
            addRecords: true,
            params: {
                competencies: studentCompetenciesLoadQueue.join(',')
            },
            callback: function(studentCompetencies, operation, success) {
                if (!success) {
                    Ext.Logger.error('Failed to load student competencies');
                    return;
                }

                // eslint-disable-next-line vars-on-top
                var studentCompetenciesLength = studentCompetencies.length,
                    studentCompetencyIndex = 0, studentCompetency, level,
                    ratingFields, ratingFieldsLength, ratingFieldIndex, ratingField;

                for (; studentCompetencyIndex < studentCompetenciesLength; studentCompetencyIndex++) {
                    studentCompetency = studentCompetencies[studentCompetencyIndex];
                    level = studentCompetency.get('Level');

                    ratingFields = competencyContainers[studentCompetency.get('CompetencyID')].items;
                    ratingFieldsLength = ratingFields.getCount();
                    ratingFieldIndex = 0;

                    for (; ratingFieldIndex < ratingFieldsLength; ratingFieldIndex++) {
                        ratingField = ratingFields.getAt(ratingFieldIndex);

                        if (!ratingField.getLevel()) {
                            ratingField.setLevel(level);
                        }
                    }
                }
            }
        });

        // clear queue immediately after request is executed
        studentCompetenciesLoadQueue.length = 0;
    }
});