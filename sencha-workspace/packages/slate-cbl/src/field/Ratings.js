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
                // margin: '10 -16',
                // bodyPadding: '16 75',
                // title: 'Competencies',
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
                    a = a.isCompetencyRatings;
                    b = b.isCompetencyRatings;

                    if (a == b) {
                        return 0;
                    }

                    return a ? -1 : 1;
                }
            },
            new Slate.sorter.Code({
                codeFn: function(item) {
                    return item.title;
                }
            })
        ]);

        tabPanel.insert(0, competenciesGrid);
        me.insert(0, tabPanel);
    },


    // containerfield lifecycle
    beforeReset: function() {
        this.callParent();
        this.getCompetenciesGrid().getSearchField().reset();
    },

    // getValue: function() {
    //     return [
    //         {
    //             SkillID: 9,
    //             DemonstratedLevel: 10
    //         },
    //         {
    //             SkillID: 10,
    //             DemonstratedLevel: 10
    //         }
    //     ];
    // },

    // setValue: function(value) {
    //     debugger;
    //     return this.callParent(arguments);
    // }


    // event handlers
    onCompetencySelect: function(competenciesGrid, competency) {
        var tabPanel = this.getTabPanel(),
            cardConfig = {
                isCompetencyRatings: true,
                title: competency.get('Code'),
                data: competency.getData()
            };

        // TODO: get insert index
        tabPanel.insert(tabPanel.items.findInsertionIndex(cardConfig), cardConfig);
        // me.setLoading('Loading skills&hellip;');
        // me.addCompetency(selectionModel.getLastSelected(), function() {
        //     me.setLoading(false);
        // });
    },


    // local methods
    syncTabBar: function() {
        var tabPanel = this.getTabPanel();

        tabPanel.getTabBar().setHidden(tabPanel.items.getCount() <= 1);
    }
});