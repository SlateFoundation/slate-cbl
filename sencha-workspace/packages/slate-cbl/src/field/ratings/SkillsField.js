/**
 * Implements a custom field for looking up skills and inputting ratings
 *
 * Modeled after a combination of FieldContainer and field.Base
 */
Ext.define('Slate.cbl.field.ratings.SkillsField', {
    extend: 'Slate.ui.form.ContainerField',
    xtype: 'slate-cbl-ratings-skillsfield',
    requires: [
        'Slate.cbl.field.ratings.SkillsCompetency',
        'Slate.cbl.field.RatingSlider',
        'Slate.cbl.field.SkillsSelector',

        'Ext.form.FieldContainer',

        /* global Slate */
        'Slate.sorter.Code'
    ],


    config: {
        selectedStudent: null,
        selectedCompetencies: true,

    //     tabPanel: true,
    //     competenciesGrid: true
    },


    // containerfield configuration
    name: 'DemonstrationSkills',
    allowBlank: false,
    blankText: 'At least one rating must be selected',


    // container/component configuration
    componentCls: 'slate-cbl-skillratingsfield',
    layout: 'anchor',
    defaults: {
        xtype: 'slate-cbl-ratings-skillscompetency',
        anchor: '100%'
    },

    initItems: function() {
        var me = this,
            skillsStore = Slate.cbl.store.Skills.create();

        me.callParent();

        // apply sorters for tab items, must be able to process both instances and config objects
        me.items.setSorters([
            new Slate.sorter.Code({
                codeFn: function(item) {
                    return item.selectedCompetency;
                }
            })
        ]);

        skillsStore.load({
            include: 'Competency',
            callback: function(skills) {
                me.add([
                    {
                        selectedCompetency: skills[0].get('Competency').Code,
                        items: [
                            {
                                skill: skills[0],
                                level: 9
                            },
                            {
                                skill: skills[1],
                                level: 10
                            },
                            {
                                skill: skills[2],
                                level: 11
                            },
                        ]
                    },
                    {
                        selectedCompetency: skills[11].get('Competency').Code,
                        items: [
                            {
                                skill: skills[11],
                                level: 11
                            },
                            {
                                skill: skills[12],
                                level: 12
                            },
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        layout: {
                            type: 'hbox',
                            align: 'center'
                        },
                        items: [
                            {
                                xtype: 'slate-cbl-skillsselector',
                                fieldLabel: null,
                                flex: 1
                            },
                            {
                                xtype: 'button',
                                text: 'Add Skills',
                                margin: '0 0 0 10'
                            }
                        ]
                    }
                ]);
            }
        });
    }


    // constructor: function() {
    //     var me = this;

    //     me.syncCards = Ext.Function.createBuffered(me.syncCards, 100, me);
    //     me.syncValueToCards = Ext.Function.createBuffered(me.syncValueToCards, 100, me);

    //     me.callParent(arguments);
    // },


    // // config handlers
    // applySelectedStudent: function(selectedStudent) {
    //     if (!selectedStudent) {
    //         selectedStudent = null;
    //     } else if (selectedStudent.isModel) {
    //         selectedStudent = selectedStudent.get('Username');
    //     }

    //     return selectedStudent;
    // },

    // updateSelectedStudent: function(selectedStudent) {
    //     var tabPanel = this.tabPanel,
    //         items = tabPanel ? tabPanel.query('[setSelectedStudent]') : [],
    //         itemsLength = items.length,
    //         i = 0;

    //     for (; i < itemsLength; i++) {
    //         items[i].setSelectedStudent(selectedStudent);
    //     }
    // },

    // applySelectedCompetencies: function(competencies) {
    //     return competencies ? Ext.Array.clone(competencies) : [];
    // },

    // updateSelectedCompetencies: function(competencies, oldCompetencies) {
    //     var me = this,
    //         length = competencies.length,
    //         i = 0, competencyCode;

    //     Ext.suspendLayouts();

    //     // add any newly selected competencies
    //     for (; i < length; i++) {
    //         competencyCode = competencies[i];

    //         if (!oldCompetencies || oldCompetencies.indexOf(competencyCode) == -1) {
    //             me.addCompetencyCard(competencyCode);
    //         }
    //     }

    //     // remove any no-longer-selected competencies
    //     if (oldCompetencies) {
    //         length = oldCompetencies.length;
    //         i = 0;

    //         for (; i < length; i++) {
    //             competencyCode = oldCompetencies[i];
    //             if (competencies.indexOf(competencyCode) == -1) {
    //                 me.removeCompetencyCard(competencyCode);
    //             }
    //         }
    //     }

    //     me.getTabPanel().setActiveTab(0);

    //     Ext.resumeLayouts(true);
    // },

    // applyTabPanel: function(tabPanel, oldTabPanel) {
    //     if (!tabPanel || typeof tabPanel == 'boolean') {
    //         tabPanel = {
    //             hidden: !tabPanel
    //         };
    //     }

    //     if (typeof tabPanel == 'object' && !tabPanel.isComponent) {
    //         tabPanel = Ext.apply({
    //             cls: 'slate-cbl-competencyratingsfield-competenciestabs',
    //             tabBar: {
    //                 hidden: true
    //             },
    //             defaultType: 'slate-cbl-competencyratings',
    //             defaults: {
    //                 closable: true
    //             }
    //         }, tabPanel);
    //     }

    //     return Ext.factory(tabPanel, 'Ext.tab.Panel', oldTabPanel);
    // },

    // updateTabPanel: function(tabPanel) {
    //     tabPanel.on({
    //         scope: this,
    //         add: 'syncCards',
    //         beforeremove: 'onBeforeCardRemove',
    //         remove: 'syncCards'
    //     });
    // },

    // applyCompetenciesGrid: function(competenciesGrid, oldCompetenciesGrid) {
    //     if (!competenciesGrid || typeof competenciesGrid == 'boolean') {
    //         // TODO: remove from tabpanel when hidden so ratings field can be shown with single sheets
    //         competenciesGrid = {
    //             hidden: !competenciesGrid
    //         };
    //     }

    //     if (typeof competenciesGrid == 'object' && !competenciesGrid.isComponent) {
    //         competenciesGrid = Ext.apply({
    //             title: 'Add competency',
    //             glyph: 0xf0fe + '@FontAwesome',
    //             closable: false,
    //             hideHeaders: true
    //         }, competenciesGrid);
    //     }

    //     return Ext.factory(competenciesGrid, 'Slate.cbl.view.CompetenciesGrid', oldCompetenciesGrid);
    // },

    // updateCompetenciesGrid: function(competenciesGrid) {
    //     competenciesGrid.on('competencyselect', 'onCompetencySelect', this);
    // },


    // // container lifecycle
    // initItems: function() {
    //     var me = this,
    //         tabPanel = me.getTabPanel(),
    //         competenciesGrid = me.getCompetenciesGrid();

    //     me.callParent(arguments);

    //     // apply sorters for tab items, must be able to process both instances and config objects
    //     tabPanel.items.setSorters([
    //         {
    //             sorterFn: function(a, b) {
    //                 a = a.isCompetencyCard;
    //                 b = b.isCompetencyCard;

    //                 if (a == b) {
    //                     return 0;
    //                 }

    //                 return a ? -1 : 1;
    //             }
    //         },
    //         new Slate.sorter.Code({
    //             codeFn: function(item) {
    //                 return item.selectedCompetency;
    //             }
    //         })
    //     ]);

    //     tabPanel.add(competenciesGrid);
    //     me.insert(0, tabPanel);
    // },


    // // containerfield lifecycle
    // initValue: function() {
    //     var me = this,
    //         value = me.value;

    //     me.originalValue = me.normalizeValue(value);
    //     me.value = me.normalizeValue(value);
    // },

    // normalizeValue: function(value) {
    //     var normalValue = [],
    //         length = value ? value.length : 0,
    //         i = 0, demonstrationSkill;

    //     for (; i < length; i++) {
    //         demonstrationSkill = value[i];

    //         normalValue.push({
    //             ID: demonstrationSkill.ID,
    //             SkillID: demonstrationSkill.SkillID,
    //             TargetLevel: demonstrationSkill.TargetLevel,
    //             DemonstratedLevel: demonstrationSkill.DemonstratedLevel,
    //             Override: demonstrationSkill.Override
    //         });
    //     }

    //     return normalValue;
    // },

    // setValue: function(value) {
    //     var me = this;

    //     // clone value to normalized array
    //     value = me.normalizeValue(value);

    //     // normal field behavior
    //     me.value = value;
    //     me.checkChange();

    //     // ensure lastValue and value always reference same instance
    //     me.lastValue = value;

    //     return me;
    // },

    // resetOriginalValue: function() {
    //     var me = this;

    //     // use clone from normalizeValue to isolate from updates
    //     me.originalValue = me.normalizeValue(me.getValue());
    //     me.checkDirty();
    // },

    // isEqual: function(value1, value2) {
    //     var skillId, skill1, skill2;

    //     if (value1 === value2) {
    //         return true;
    //     }

    //     if (!value1 && !value2) {
    //         return true;
    //     }

    //     if (!value1 || !value2) {
    //         return false;
    //     }

    //     if (value1.length !== value2.length) {
    //         return false;
    //     }

    //     value1 = Ext.Array.toValueMap(value1, 'SkillID');
    //     value2 = Ext.Array.toValueMap(value2, 'SkillID');

    //     for (skillId in value1) {
    //         if (!value1.hasOwnProperty(skillId)) {
    //             continue;
    //         }

    //         skill2 = value2[skillId];

    //         if (!skill2) {
    //             return false;
    //         }

    //         skill1 = value1[skillId];

    //         if (skill1.DemonstratedLevel !== skill2.DemonstratedLevel) {
    //             return false;
    //         }

    //         if (skill1.Override !== skill2.Override) {
    //             return false;
    //         }

    //         if (skill1.TargetLevel !== skill2.TargetLevel) {
    //             return false;
    //         }
    //     }

    //     return true;
    // },

    // onChange: function(value) {
    //     var me = this,
    //         length = value ? value.length : 0,
    //         i = 0, skillData,
    //         valueSkillsMap = me.valueSkillsMap = {};

    //     for (; i < length; i++) {
    //         skillData = value[i];
    //         valueSkillsMap[skillData.SkillID] = skillData;
    //     }

    //     me.syncValueToCards();

    //     return me.callParent([value]);
    // },

    // getErrors: function(value) {
    //     var me = this,
    //         errors;

    //     value = value || me.getValue();
    //     errors = me.callParent([value]);

    //     if (!me.allowBlank && value.length == 0) {
    //         errors.push(me.blankText);
    //     }

    //     return errors;
    // },


    // // event handlers
    // onCompetencySelect: function(competenciesGrid, competency) {
    //     this.addCompetencyCard(competency.get('Code'), true);
    //     competenciesGrid.setQueryFilter(null);
    // },

    // onBeforeCardRemove: function(tabPanel, card) {
    //     var me = this,
    //         value = me.value,
    //         valueSkillsMap = me.valueSkillsMap,
    //         fields = card.isCompetencyCard ? card.query('[isRatingField]') : [],
    //         length = fields.length,
    //         i = 0, skill, skillId, skillData;

    //     for (; i < length; i++) {
    //         skill = card.query('field')[i].getSkill();

    //         if (!skill) {
    //             continue;
    //         }

    //         skillId = skill.getId();
    //         skillData = valueSkillsMap[skillId];

    //         delete valueSkillsMap[skillId];

    //         if (skillData) {
    //             Ext.Array.remove(value, skillData);
    //         }
    //     }
    // },

    // onRatingChange: function(competencyCard, rating, level, skill, ratingSlider) {
    //     var me = this,
    //         value = me.value,
    //         valueSkillsMap = me.valueSkillsMap,
    //         skillId = skill.getId(),
    //         skillData = valueSkillsMap[skillId];

    //     if (rating === null) {
    //         delete valueSkillsMap[skillId];

    //         if (skillData) {
    //             Ext.Array.remove(value, skillData);
    //         }
    //     } else {
    //         if (!skillData) {
    //             skillData = valueSkillsMap[skillId] = { SkillID: skillId };
    //             value.push(skillData);
    //         }

    //         skillData.TargetLevel = level;
    //         skillData.DemonstratedLevel = rating;
    //     }

    //     me.fireEvent('ratingchange', me, rating, level, skill, ratingSlider, competencyCard);

    //     me.validate();
    //     me.checkDirty();
    // },


    // // local methods
    // syncCards: function() {
    //     var tabPanel = this.getTabPanel(),
    //         tabPanelItems = tabPanel.items;

    //     tabPanel.getTabBar().setHidden(tabPanelItems.getCount() <= 1);
    //     this.getCompetenciesGrid().setExcludeFilter(tabPanelItems.collect('selectedCompetency'));
    // },

    // syncValueToCards: function() {
    //     var me = this,
    //         tabPanel = me.getTabPanel(),
    //         competenciesStore = me.getCompetenciesGrid().getStore(),
    //         skills = me.value,
    //         skillsLength = skills ? skills.length : 0,
    //         skillIndex = 0, skillData, competency, competencyId, skillId,
    //         skillIds = [],
    //         competencyCardsMap = {},
    //         cards = tabPanel.query('slate-cbl-competencyratings'),
    //         cardsLength = cards.length,
    //         cardIndex = 0,
    //         card;

    //     // defer until competencies store is loaded
    //     if (!competenciesStore.isLoaded()) {
    //         competenciesStore.on('load', me.syncValueToCards, me, { single: true });
    //         return;
    //     }


    //     Ext.suspendLayouts();


    //     // collect competencies
    //     for (; skillIndex < skillsLength; skillIndex++) {
    //         skillData = skills[skillIndex];
    //         skillId = skillData.SkillID;
    //         competency = competenciesStore.getBySkillId(skillId);

    //         if (!competency) {
    //             Ext.Logger.warn('Value loaded with competency not found in competencies store, skipping');
    //             continue;
    //         }

    //         competencyId = competency.getId();

    //         card = competencyCardsMap[competencyId];
    //         if (!card) {
    //             card = competencyCardsMap[competencyId] = me.addCompetencyCard(competency.get('Code'));
    //         }

    //         card.setSkillValue(skillId, skillData.DemonstratedLevel, skillData.TargetLevel);
    //         skillIds.push(skillId);
    //     }


    //     // reset rating fields for skills not in value
    //     for (; cardIndex < cardsLength; cardIndex++) {
    //         cards[cardIndex].resetSkills(skillIds);
    //     }


    //     // activate first card if grid is active
    //     if (tabPanel.getActiveTab() === me.getCompetenciesGrid()) {
    //         tabPanel.setActiveTab(0);
    //     }


    //     Ext.resumeLayouts(true);
    // },

    // getCompetencyCard: function(competencyCode) {
    //     var tabPanelItems = this.getTabPanel().items,
    //         cardIndex = tabPanelItems.findIndex('selectedCompetency', competencyCode);

    //     return cardIndex == -1 ? null : tabPanelItems.getAt(cardIndex);
    // },

    // addCompetencyCard: function(competencyCode, activate) {
    //     var me = this,
    //         selectedCompetencies = me.getSelectedCompetencies(),
    //         tabPanel = me.getTabPanel(),
    //         tabPanelItems = tabPanel.items,
    //         cardConfig, cardIndex, card;

    //     if (selectedCompetencies.indexOf(competencyCode) == -1) {
    //         selectedCompetencies.push(competencyCode);
    //     }

    //     card = me.getCompetencyCard(competencyCode);
    //     if (card) {
    //         return card;
    //     }

    //     cardConfig = {
    //         isCompetencyCard: true,
    //         selectedStudent: me.getSelectedStudent(),
    //         selectedCompetency: competencyCode,
    //         listeners: {
    //             scope: me,
    //             ratingchange: 'onRatingChange'
    //         }
    //     };

    //     cardIndex = tabPanelItems.getSorters() ? tabPanelItems.findInsertionIndex(cardConfig) : 0;
    //     card = tabPanel.insert(cardIndex, cardConfig);

    //     if (activate) {
    //         tabPanel.setActiveItem(card);
    //     }

    //     return card;
    // },

    // removeCompetencyCard: function(competencyCode) {
    //     var tabPanel = this.getTabPanel(),
    //         cardIndex = tabPanel.items.findIndex('selectedCompetency', competencyCode);

    //     Ext.Array.remove(this.getSelectedCompetencies(), competencyCode);

    //     if (cardIndex != -1) {
    //         tabPanel.remove(cardIndex);
    //     }
    // }
});