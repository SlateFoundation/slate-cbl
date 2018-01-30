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
        'Slate.cbl.view.CompetenciesGrid'
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
                defaultType: 'slate-demonstrations-teacher-demonstration-competencycard',
                defaults: {
                    closable: true
                }
            }, tabPanel);
        }

        return Ext.factory(tabPanel, 'Ext.tab.Panel', oldTabPanel);
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


    // container lifecycle
    initItems: function() {
        var me = this,
            tabPanel = me.getTabPanel(),
            competenciesGrid = me.getCompetenciesGrid();

        me.callParent(arguments);

        tabPanel.insert(0, competenciesGrid);
        me.insert(0, tabPanel);
    },


    // containerfield lifecycle
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
});