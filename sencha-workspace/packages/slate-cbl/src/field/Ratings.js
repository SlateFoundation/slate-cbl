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
        skillStore: null,
        competenciesStore: null,

        tabPanel: true,
        competenciesGrid: true
    },


    // containerfield configuration
    name: 'Skills',


    // container/component configuration
    componentCls: 'slate-cbl-ratingsfield',
    layout: 'fit',


    // config handlers
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
            buffer: 100,
            add: 'syncTabBar',
            remove: 'syncTabBar'
        });
    },

    applyCompetenciesGrid: function(competenciesGrid, oldCompetenciesGrid) {
        if (!competenciesGrid || typeof competenciesGrid == 'boolean') {
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

        tabPanel.insert(0, competenciesGrid);
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


    // event handlers
    onCompetencySelect: function(competenciesGrid, competency) {
        var tabPanel = this.getTabPanel(),
            cardConfig = {
                isCompetencyCard: true,
                selectedCompetency: competency.get('Code'),
                listeners: {
                    scope: this,
                    ratingchange: 'onRatingChange'
                }
            },
            cardIndex = tabPanel.items.findInsertionIndex(cardConfig);

        tabPanel.insert(cardIndex, cardConfig);
        tabPanel.setActiveItem(cardIndex);
        competenciesGrid.setQueryFilter(null);
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
    },


    // local methods
    syncTabBar: function() {
        var tabPanel = this.getTabPanel(),
            tabPanelItems = tabPanel.items;

        tabPanel.getTabBar().setHidden(tabPanelItems.getCount() <= 1);
        this.getCompetenciesGrid().setExcludeFilter(tabPanelItems.collect('selectedCompetency'));
    }
});