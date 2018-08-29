/**
 * Implements a custom field for looking up competencies and inputting ratings
 *
 * Modeled after a combination of FieldContainer and field.Base
 */
Ext.define('Slate.cbl.field.ratings.StudentCompetenciesField', {
    extend: 'Slate.cbl.field.ratings.AbstractSkillsField',
    xtype: 'slate-cbl-ratings-studentcompetenciesfield',
    requires: [
        'Ext.tab.Panel',

        /* global Slate */
        'Slate.sorter.Code',

        'Slate.ui.override.AddSorted',

        'Slate.cbl.view.CompetenciesGrid',
        'Slate.cbl.field.ratings.StudentCompetency'
    ],


    config: {
        selectedStudent: null,
        selectedCompetencies: true,

        tabPanel: true,
        competenciesGrid: true
    },


    // containerfield configuration
    allowBlank: false,


    // container/component configuration
    componentCls: 'slate-cbl-ratings-studentcompetenciesfield',
    layout: 'fit',


    constructor: function() {
        var me = this;

        me.syncCards = Ext.Function.createBuffered(me.syncCards, 100, me);

        me.callParent(arguments);
    },


    // config handlers
    applySelectedStudent: function(selectedStudent) {
        if (!selectedStudent) {
            selectedStudent = null;
        } else if (selectedStudent.isModel) {
            selectedStudent = selectedStudent.get('Username');
        }

        return selectedStudent;
    },

    updateSelectedStudent: function(selectedStudent) {
        var tabPanel = this.tabPanel,
            items = tabPanel ? tabPanel.query('[setSelectedStudent]') : [],
            itemsLength = items.length,
            i = 0;

        for (; i < itemsLength; i++) {
            items[i].setSelectedStudent(selectedStudent);
        }
    },

    applySelectedCompetencies: function(competencies) {
        return competencies ? Ext.Array.clone(competencies) : [];
    },

    updateSelectedCompetencies: function(competencies, oldCompetencies) {
        var me = this,
            length = competencies.length,
            i = 0, competencyCode;

        Ext.suspendLayouts();

        // add any newly selected competencies
        for (; i < length; i++) {
            competencyCode = competencies[i];

            if (!oldCompetencies || oldCompetencies.indexOf(competencyCode) == -1) {
                me.addCompetencyCard(competencyCode);
            }
        }

        // remove any no-longer-selected competencies
        if (oldCompetencies) {
            length = oldCompetencies.length;
            i = 0;

            for (; i < length; i++) {
                competencyCode = oldCompetencies[i];
                if (competencies.indexOf(competencyCode) == -1) {
                    me.removeCompetencyCard(competencyCode);
                }
            }
        }

        me.getTabPanel().setActiveTab(0);

        Ext.resumeLayouts(true);
    },

    applyTabPanel: function(tabPanel, oldTabPanel) {
        if (!tabPanel || typeof tabPanel == 'boolean') {
            tabPanel = {
                hidden: !tabPanel
            };
        }

        if (typeof tabPanel == 'object' && !tabPanel.isComponent && !oldTabPanel) {
            tabPanel = Ext.apply({
                cls: 'slate-cbl-ratings-studentcompetenciesfield-competenciestabs',
                tabBar: {
                    hidden: true
                },
                defaultType: 'slate-cbl-ratings-studentcompetency',
                defaults: {
                    closable: true
                }
            }, tabPanel);
        }

        return Ext.factory(tabPanel, 'Ext.tab.Panel', oldTabPanel);
    },

    updateTabPanel: function(tabPanel) {
        tabPanel.on({
            scope: this,
            add: 'syncCards',
            beforeremove: 'onBeforeCardRemove',
            remove: 'syncCards'
        });
    },

    applyCompetenciesGrid: function(competenciesGrid, oldCompetenciesGrid) {
        if (!competenciesGrid || typeof competenciesGrid == 'boolean') {
            // TODO: remove from tabpanel when hidden so ratings field can be shown with single sheets
            competenciesGrid = {
                hidden: !competenciesGrid
            };
        }

        if (typeof competenciesGrid == 'object' && !competenciesGrid.isComponent && !oldCompetenciesGrid) {
            competenciesGrid = Ext.apply({
                title: 'Add competency',
                glyph: 0xf0fe + '@FontAwesome',
                closable: false,
                hideHeaders: true
            }, competenciesGrid);
        }

        return Ext.factory(competenciesGrid, 'Slate.cbl.view.CompetenciesGrid', oldCompetenciesGrid);
    },

    updateCompetenciesGrid: function(competenciesGrid) {
        competenciesGrid.on('competencyselect', 'onCompetencySelect', this);
    },


    // container lifecycle
    initItems: function() {
        var me = this,
            tabPanel = me.getTabPanel(),
            competenciesGrid = me.getCompetenciesGrid();

        me.callParent(arguments);

        // apply sorters for tab items, must be able to process both instances and config objects
        tabPanel.items.setSorters([
            {
                sorterFn: function(a, b) {
                    a = a.isCompetencyCard;
                    b = b.isCompetencyCard;

                    if (a == b) {
                        return 0;
                    }

                    return a ? -1 : 1;
                }
            },
            new Slate.sorter.Code({
                codeFn: function(item) {
                    return item.selectedCompetency;
                }
            })
        ]);

        tabPanel.add(competenciesGrid);
        me.insert(0, tabPanel);
    },


    // event handlers
    onCompetencySelect: function(competenciesGrid, competency) {
        this.addCompetencyCard(competency.get('Code'), true);
        competenciesGrid.setQueryFilter(null);
    },

    onBeforeCardRemove: function(tabPanel, card) {
        var me = this,
            fields = card.isCompetencyCard ? card.query('[isRatingField]') : [],
            length = fields.length,
            i = 0, skill;

        for (; i < length; i++) {
            skill = card.query('field')[i].getSkill();

            if (skill) {
                me.removeSkillValue(skill.getId());
            }
        }

        me.validate();
        me.checkDirty();
    },

    onRatingChange: function(competencyCard, rating, level, skill) {
        var me = this;

        if (rating === null) {
            me.removeSkillValue(skill.getId());
        } else {
            me.setSkillValue(skill.getId(), rating, level);
        }

        me.validate();
        me.checkDirty();
    },


    // local methods
    syncCards: function() {
        var tabPanel = this.getTabPanel(),
            tabPanelItems = tabPanel.items;

        tabPanel.getTabBar().setHidden(tabPanelItems.getCount() <= 1);
        this.getCompetenciesGrid().setExcludeFilter(tabPanelItems.collect('selectedCompetency'));
    },

    loadValue: function() {
        var me = this,
            tabPanel = me.getTabPanel(),
            competenciesStore = me.getCompetenciesGrid().getStore(),
            skills = me.value,
            skillsLength = skills ? skills.length : 0,
            skillIndex = 0, skillData, competency, competencyId, skillId,
            skillIds = [],
            competencyCardsMap = {},
            cards = tabPanel.query('slate-cbl-ratings-studentcompetency'),
            cardsLength = cards.length,
            cardIndex = 0,
            card;

        // defer until competencies store is loaded
        if (!competenciesStore.isLoaded()) {
            competenciesStore.on('load', 'loadValue', me, { single: true });
            return;
        }


        Ext.suspendLayouts();


        // collect competencies
        for (; skillIndex < skillsLength; skillIndex++) {
            skillData = skills[skillIndex];
            skillId = skillData.SkillID;
            competency = competenciesStore.getBySkillId(skillId);

            if (!competency) {
                Ext.Logger.warn('Value loaded with competency not found in competencies store, skipping');
                continue;
            }

            competencyId = competency.getId();

            card = competencyCardsMap[competencyId];
            if (!card) {
                card = competencyCardsMap[competencyId] = me.addCompetencyCard(competency.get('Code'));
            }

            card.setSkillValue(skillId, skillData.DemonstratedLevel, skillData.TargetLevel);
            skillIds.push(skillId);
        }


        // reset rating fields for skills not in value
        for (; cardIndex < cardsLength; cardIndex++) {
            cards[cardIndex].resetSkills(skillIds);
        }


        // activate first card if grid is active
        if (tabPanel.getActiveTab() === me.getCompetenciesGrid()) {
            tabPanel.setActiveTab(0);
        }


        Ext.resumeLayouts(true);
    },

    getCompetencyCard: function(competencyCode) {
        var tabPanelItems = this.getTabPanel().items,
            cardIndex = tabPanelItems.findIndex('selectedCompetency', competencyCode);

        return cardIndex == -1 ? null : tabPanelItems.getAt(cardIndex);
    },

    addCompetencyCard: function(competencyCode, activate) {
        var me = this,
            selectedCompetencies = me.getSelectedCompetencies(),
            tabPanel = me.getTabPanel(),
            cardConfig, card;

        if (selectedCompetencies.indexOf(competencyCode) == -1) {
            selectedCompetencies.push(competencyCode);
        }

        card = me.getCompetencyCard(competencyCode);
        if (card) {
            return card;
        }

        cardConfig = {
            isCompetencyCard: true,
            selectedStudent: me.getSelectedStudent(),
            selectedCompetency: competencyCode,
            listeners: {
                scope: me,
                ratingchange: 'onRatingChange'
            }
        };

        card = tabPanel.addSorted(cardConfig);

        if (activate) {
            tabPanel.setActiveItem(card);
        }

        return card;
    },

    removeCompetencyCard: function(competencyCode) {
        var tabPanel = this.getTabPanel(),
            cardIndex = tabPanel.items.findIndex('selectedCompetency', competencyCode);

        Ext.Array.remove(this.getSelectedCompetencies(), competencyCode);

        if (cardIndex != -1) {
            tabPanel.remove(cardIndex);
        }
    }
});