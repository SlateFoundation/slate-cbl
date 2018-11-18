Ext.define('SlateDemonstrationsStudent.view.Dashboard', {
    extend: 'Slate.ui.app.Container',
    xtype: 'slate-demonstrations-student-dashboard',
    requires: [
        'SlateDemonstrationsStudent.view.CompetenciesSummary',
        'SlateDemonstrationsStudent.view.RecentProgress',
        'SlateDemonstrationsStudent.view.CardsContainer',

        /* global Slate */
        'Slate.cbl.view.LevelsLegend',
        'Slate.cbl.field.StudentSelector',
        'Slate.cbl.field.ContentAreaSelector',
        'Slate.cbl.model.ContentArea'
    ],


    /**
     * @event selectedstudentchange
     * Fires when a new student is selected via browser navigation or a menu
     * @param {SlateDemonstrationsStudent.view.Dashboard} dashboardCt
     * @param {String|null} student
     * @param {String|null} oldStudent
     */

    /**
     * @event selectedcontentareachange
     * Fires when a new content area is selected via browser navigation or a menu
     * @param {SlateDemonstrationsStudent.view.Dashboard} dashboardCt
     * @param {String|null} contentArea
     * @param {String|null} oldContentArea
     */

    /**
     * @event loadedcontentareachange
     * Fires when the populated record for the last selected section becomes available
     * or is cleared pending a new section loading
     * @param {SlateDemonstrationsStudent.view.Dashboard} dashboardCt
     * @param {Slate.cbl.model.ContentArea|null} section
     * @param {Slate.cbl.model.ContentArea|null} oldSection
     */


    config: {

        /**
         * @cfg {String|null}
         * The username for the student selected for loading by the user. This config gets
         * set first when the user indicates their intent to navigate to a given student,
         * and it may not necessarily reflect a valid or available student.
         *
         * The {@link #event-selectedstudentchange} event is fired when this config changes,
         * which should trigger all student selection UI to update immediately and new data to
         * begin loading.
         */
        selectedStudent: null,

        /**
         * @cfg {String}
         * The code for the content area selected for loading by the user. This config gets
         * set first when the user indicates their intent to navigate to a given content area,
         * and it may not necessarily reflect a valid or available content area.
         *
         * The {@link #event-selectedcontentareachange} event is fired when this config changes,
         * which should trigger all content area selection UI to update immediately and new data to
         * begin loading.
         */
        selectedContentArea: null,

        /**
         * @cfg {Slate.cbl.model.ContentArea|null}
         * The loaded content area model instance for the application. This config gets
         * set following a change in {@link #cfg-selectedContentArea} and successful load
         * of the indicated content area.
         */
        loadedContentArea: null,

        /**
         * @cfg {SlateDemonstrationsStudent.view.CompetenciesSummary|Object|boolean}
         * Instance or configuration for competencies summary component.
         *
         * Setting boolean values change visibility.
         */
        competenciesSummary: false,

        /**
         * @cfg {SlateDemonstrationsStudent.view.RecentProgress|Object|boolean}
         * Instance or configuration for recent progress component.
         *
         * Setting boolean values change visibility.
         */
        recentProgress: false,

        /**
         * @cfg {Slate.cbl.view.LevelsLegend|Object|boolean}
         * Instance or configuration for legend component.
         *
         * Setting boolean values change visibility.
         */
        legend: false,

        /**
         * @cfg {Ext.container.Container|Object|boolean}
         * Instance or configuration for cards container.
         *
         * Setting boolean values change visibility.
         */
        cardsCt: {
            xtype: 'slate-demonstrations-student-cardsct',
            hidden: true
        },


        // appcontainer config
        header: {
            title: 'My Progress',

            items: [
                {
                    xtype: 'slate-cbl-studentselector',
                    hidden: true,
                    emptyText: 'Me'
                },
                {
                    xtype: 'slate-cbl-contentareaselector',
                    emptyText: 'Select'
                }
            ]
        },
        placeholderItem: 'Select a content area to load demonstrations dashboard'
    },


    // component configuration
    cls: 'slate-demonstrations-student-dashboard',


    // config handlers
    updateSelectedStudent: function(student, oldStudent) {
        this.fireEvent('selectedstudentchange', this, student, oldStudent);
    },

    updateSelectedContentArea: function(contentArea, oldContentArea) {
        var me = this,
            contentAreaSet = Boolean(contentArea);

        Ext.suspendLayouts();
        me.setPlaceholderItem(!contentAreaSet);
        me.setCompetenciesSummary(contentAreaSet);
        me.setRecentProgress(contentAreaSet);
        me.setLegend(contentAreaSet);
        me.setCardsCt(contentAreaSet);
        Ext.resumeLayouts(true);

        me.fireEvent('selectedcontentareachange', me, contentArea, oldContentArea);
    },

    applyLoadedContentArea: function(contentArea, oldContentArea) {
        if (!contentArea) {
            return null;
        }

        if (!contentArea.isModel) {
            if (oldContentArea && contentArea.ID == oldContentArea.getId()) {
                oldContentArea.set(contentArea, { dirty: false });
                return oldContentArea;
            }

            contentArea = Slate.cbl.model.ContentArea.create(contentArea);
        }

        return contentArea;
    },

    updateLoadedContentArea: function(contentArea, oldContentArea) {
        var me = this;

        if (contentArea) {
            me.setSelectedContentArea(contentArea.get('Code'));
        }

        me.fireEvent('loadedcontentareachange', me, contentArea, oldContentArea);
    },

    applyCompetenciesSummary: function(competenciesSummary, oldCompetenciesSummary) {
        if (typeof competenciesSummary === 'boolean') {
            competenciesSummary = {
                hidden: !competenciesSummary
            };
        }

        return Ext.factory(competenciesSummary, 'SlateDemonstrationsStudent.view.CompetenciesSummary', oldCompetenciesSummary);
    },

    applyRecentProgress: function(recentProgress, oldRecentProgress) {
        if (typeof recentProgress === 'boolean') {
            recentProgress = {
                hidden: !recentProgress
            };
        }

        return Ext.factory(recentProgress, 'SlateDemonstrationsStudent.view.RecentProgress', oldRecentProgress);
    },

    applyLegend: function(legend, oldLegend) {
        if (typeof legend === 'boolean') {
            legend = {
                hidden: !legend
            };
        }

        return Ext.factory(legend, 'Slate.cbl.view.LevelsLegend', oldLegend);
    },

    applyCardsCt: function(cardsCt, oldCardsCt) {
        if (typeof cardsCt === 'boolean') {
            cardsCt = {
                hidden: !cardsCt
            };
        }

        return Ext.factory(cardsCt, 'SlateDemonstrationsStudent.view.CardsContainer', oldCardsCt);
    },


    // component lifecycle
    initItems: function() {
        var me = this;

        me.callParent();

        me.add([
            me.getCompetenciesSummary(),
            me.getRecentProgress(),
            me.getLegend(),
            me.getCardsCt()
        ]);
    }
});