Ext.define('SlateDemonstrationsStudent.view.Dashboard', {
    extend: 'Slate.ui.app.Container',
    xtype: 'slate-demonstrations-student-dashboard',
    requires: [
        // 'Slate.cbl.widget.Popover',
        // 'Slate.cbl.store.Competencies',
        // 'Slate.cbl.store.Completions',
        // 'Slate.cbl.store.DemonstrationSkills',
        'SlateDemonstrationsStudent.view.CompetenciesSummary',
        'SlateDemonstrationsStudent.view.RecentProgress',
        'SlateDemonstrationsStudent.view.CardsContainer',

        /* global Slate */
        'Slate.cbl.widget.StudentSelector',
        'Slate.cbl.widget.ContentAreaSelector',
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
         * @cfg {Ext.container.Container|Object|boolean}
         * Instance or configuration for cards container.
         *
         * Setting boolean values change visibility.
         */
        cardsCt: {
            xtype: 'slate-demonstrations-student-cardsct',
            hidden: true
        },

        // componentCls: 'slate-demonstrations-student-dashboard',
        // bodyStyle: {
        //     padding: '1.5em 7.5%'
        // }
        // popover: {
        //     pointer: 'none'
        // },

        // competenciesStatus: 'unloaded',

        // competenciesStore: {
        //     xclass: 'Slate.cbl.store.Competencies'
        // },

        // skillsStore: 'cbl-skills',

        // completionsStore: {
        //     xclass: 'Slate.cbl.store.Completions'
        // },

        // demonstrationSkillsStore: {
        //     xclass: 'Slate.cbl.store.DemonstrationSkills'
        // }

        // appcontainer config
        header: {
            title: 'Student Demonstrations Dashboard',

            items: [
                {
                    xtype: 'slate-cbl-studentselector',
                    hidden: true,
                    emptyText: 'Me'
                },
                {
                    xtype: 'slate-cbl-contentareaselector',
                    emptyText: 'Select',
                    store: 'ContentAreas',
                    queryMode: 'local'
                }
            ]
        },
        placeholder: 'Select a content area to load demonstrations dashboard',
    },


    // config handlers
    updateSelectedStudent: function(student, oldStudent) {
        console.info('updateSelectedStudent(%o, %o)', student, oldStudent);
        this.fireEvent('selectedstudentchange', this, student, oldStudent);
    },

    updateSelectedContentArea: function(contentArea, oldContentArea) {
        var me = this,
            contentAreaSet = Boolean(contentArea);

        Ext.suspendLayouts();
        me.setPlaceholder(!contentAreaSet);
        me.setCompetenciesSummary(contentAreaSet);
        me.setRecentProgress(contentAreaSet);
        me.setCardsCt(contentAreaSet);
        Ext.resumeLayouts(true);

        console.info('updateSelectedContentArea(%o, %o)', contentArea, oldContentArea);
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
        console.info('updateLoadedContentArea(%o, %o)', contentArea, oldContentArea);
        this.fireEvent('loadedcontentareachange', this, contentArea, oldContentArea);
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

    applyCardsCt: function(cardsCt, oldCardsCt) {
        if (typeof cardsCt === 'boolean') {
            cardsCt = {
                hidden: !cardsCt
            };
        }

        return Ext.factory(cardsCt, 'SlateDemonstrationsStudent.view.CardsContainer', oldCardsCt);
    },


    // config handlers
    // applyPopover: function(newPopover, oldPopover) {
    //     return Ext.factory(newPopover, 'Slate.cbl.widget.Popover', oldPopover);
    // },

    // updateCompetenciesStatus: function(newStatus, oldStatus) {
    //     if (oldStatus) {
    //         this.removeCls('competencies-' + oldStatus);
    //     }

    //     if (newStatus) {
    //         this.addCls('competencies-' + newStatus);
    //     }
    // },

    // updateContentAreaId: function(contentAreaId) {
    //     this.getCompetenciesStore().getAllByContentArea(contentAreaId, this.loadCompletions, this);
    // },

    // updateStudentId: function() {
    //     this.loadCompletions();
    // },

    // applyCompetenciesStore: function(store) {
    //     return Ext.StoreMgr.lookup(store);
    // },

    // applySkillsStore: function(store) {
    //     return Ext.StoreMgr.lookup(store);
    // },

    // applyCompletionsStore: function(store) {
    //     return Ext.StoreMgr.lookup(store);
    // },

    // applyDemonstrationSkillsStore: function(store) {
    //     return Ext.StoreMgr.lookup(store);
    // },

    // loadCompletions: function() {
    //     var me = this,
    //         competenciesStore = me.getCompetenciesStore(),
    //         studentId = me.getStudentId(),
    //         contentAreaId = me.getContentAreaId();

    //     if (!studentId || !contentAreaId) {
    //         return;
    //     }

    //     me.setCompetenciesStatus('loading');
    //     me.mask('Loading&hellip;');

    //     competenciesStore.filter({
    //         property: 'ContentAreaID',
    //         value: contentAreaId
    //     });

    //     me.removeAll(true);
    //     me.getCompletionsStore().loadByStudentsAndCompetencies(studentId, competenciesStore.collect('ID'), {
    //         callback: function(completions) {
    //             me.add(Ext.Array.map(completions || [], function(completion) {
    //                 return {
    //                     competency: competenciesStore.getById(completion.get('CompetencyID')),
    //                     completion: completion,
    //                     autoEl: 'li'
    //                 };
    //             }));

    //             me.setCompetenciesStatus('loaded');
    //             me.unmask();
    //         }
    //     });
    // },


    // component lifecycle
    initItems: function() {
        var me = this;

        me.callParent();

        me.add([
            me.getCompetenciesSummary(),
            me.getRecentProgress(),
            me.getCardsCt()
        ]);
    }
});