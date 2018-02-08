/**
 * Implements a custom field for looking up skills and inputting ratings
 *
 * Modeled after a combination of FieldContainer and field.Base
 */
Ext.define('Slate.cbl.field.Ratings', {
    extend: 'Slate.ui.form.ContainerField',
    xtype: 'slate-cbl-ratingsfield',
    requires: [
        'Ext.tab.Panel',

        /* global Slate */
        'Slate.sorter.Code',

        'Slate.cbl.view.CompetenciesGrid',
        'Slate.cbl.view.CompetencyRatings'
    ],


    config: {
        selectedStudent: null,
        selectedCompetencies: true,

        skillStore: null,
        competenciesStore: null,

        tabPanel: true,
        competenciesGrid: true
    },


    // containerfield configuration
    name: 'Skills',
    allowBlank: false,
    blankText: 'At least one rating must be selected',


    // container/component configuration
    componentCls: 'slate-cbl-ratingsfield',
    layout: 'fit',


    constructor: function() {
        var me = this;

        me.syncCards = Ext.Function.createBuffered(me.syncCards, 100, me);

        me.callParent(arguments);
    },


    // config handlers
    updateSelectedStudent: function(selectedStudent) {
        var tabPanel = this.tabPanel,
            items = tabPanel ? tabPanel.query('[setSelectedStudent]') : [],
            itemsLength = items.length,
            i = 0;

        for (; i < itemsLength; i++) {
            items[i].setSelectedStudent(selectedStudent);
        }

        this.setValue(null);
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

        if (typeof tabPanel == 'object' && !tabPanel.isComponent) {
            tabPanel = Ext.apply({
                cls: 'slate-cbl-ratingsfield-competenciestabs',
                tabBar: {
                    hidden: true
                },
                defaultType: 'slate-cbl-competencyratings',
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

        if (typeof competenciesGrid == 'object' && !competenciesGrid.isComponent) {
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


    // containerfield lifecycle
    // beforeReset: function() {
    //     this.callParent();
    //     this.getCompetenciesGrid().getSearchField().reset();
    // },

    // reset: function() {
    //     debugger;
    //     this.callParent();
    //     // TODO: clear selected competencies
    // }

    setValue: function(value) {
        return this.callParent([value || []]);
    },

    isEqual: function(value1, value2) {
        return (
            value1 === value2
            || (value1 && value1.length == 0 && value2 && value2.length == 0)
        );
    },

    onChange: function(value) {
        var length = value ? value.length : 0,
            i = 0, skillData,
            valueSkillsMap = this.valueSkillsMap = {};

        for (; i < length; i++) {
            skillData = value[i];
            valueSkillsMap[skillData.SkillID] = skillData;
            // TODO: load
        }
    },

    getErrors: function(value) {
        var me = this,
            errors;

        value = value || me.getValue();
        errors = me.callParent([value]);

        if (!me.allowBlank && value.length == 0) {
            errors.push(me.blankText);
        }

        return errors;
    },


    // event handlers
    onCompetencySelect: function(competenciesGrid, competency) {
        this.addCompetencyCard(competency.get('Code'), true);
        competenciesGrid.setQueryFilter(null);
    },

    onBeforeCardRemove: function(tabPanel, card) {
        var me = this,
            value = me.value,
            valueSkillsMap = me.valueSkillsMap,
            fields = card.isCompetencyCard ? card.query('[isRatingField]') : [],
            length = fields.length,
            i = 0, skill, skillId, skillData;

        for (; i < length; i++) {
            skill = card.query('field')[i].getSkill();

            if (!skill) {
                continue;
            }

            skillId = skill.getId();
            skillData = valueSkillsMap[skillId];

            delete valueSkillsMap[skillId];

            if (skillData) {
                Ext.Array.remove(value, skillData);
            }
        }
    },

    onRatingChange: function(competencyCard, rating, level, skill, ratingSlider) {
        var me = this,
            value = me.value,
            valueSkillsMap = me.valueSkillsMap,
            skillId = skill.getId(),
            skillData = valueSkillsMap[skillId];

        if (rating === null) {
            delete valueSkillsMap[skillId];

            if (skillData) {
                Ext.Array.remove(value, skillData);
            }
        } else {
            if (!skillData) {
                skillData = valueSkillsMap[skillId] = { SkillID: skillId };
                value.push(skillData);
            }

            skillData.TargetLevel = level;
            skillData.DemonstratedLevel = rating;
        }

        me.fireEvent('ratingchange', me, rating, level, skill, ratingSlider, competencyCard);

        me.validate();
    },


    // local methods
    syncCards: function() {
        var tabPanel = this.getTabPanel(),
            tabPanelItems = tabPanel.items;

        tabPanel.getTabBar().setHidden(tabPanelItems.getCount() <= 1);
        this.getCompetenciesGrid().setExcludeFilter(tabPanelItems.collect('selectedCompetency'));
    },

    addCompetencyCard: function(competencyCode, activate) {
        var me = this,
            selectedCompetencies = me.getSelectedCompetencies(),
            tabPanel = me.getTabPanel(),
            tabPanelItems = tabPanel.items,
            cardConfig, cardIndex;

        if (selectedCompetencies.indexOf(competencyCode) == -1) {
            selectedCompetencies.push(competencyCode);
        }

        if (tabPanelItems.findIndex('selectedCompetency', competencyCode) != -1) {
            return;
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

        cardIndex = tabPanelItems.getSorters() ? tabPanelItems.findInsertionIndex(cardConfig) : 0;

        tabPanel.insert(cardIndex, cardConfig);

        if (activate) {
            tabPanel.setActiveItem(cardIndex);
        }
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