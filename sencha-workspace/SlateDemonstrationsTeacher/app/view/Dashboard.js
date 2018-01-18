/**
 * The top-level container for the Teachers' Progress Dashboard application
 * that configures, instantiates, and lays out the top-level view components.
 *
 * As the top-level view, this component also serves as the authoritative store
 * for the application's top-level user-driven state, offering a central place to
 * set and get that state as well as firing change events to propogate state
 * transitions out to all controllers in the application.
 */
Ext.define('SlateDemonstrationsTeacher.view.Dashboard', {
    extend: 'Slate.ui.app.Container',
    xtype: 'slate-demonstrations-teacher-dashboard',
    requires: [
        // 'SlateDemonstrationsStudent.view.CompetenciesSummary',
        // 'SlateDemonstrationsStudent.view.RecentProgress',
        // 'SlateDemonstrationsStudent.view.CardsContainer',

        /* global Slate */
        'Slate.cbl.widget.StudentsListSelector',
        'Slate.cbl.widget.ContentAreaSelector',
        'Slate.cbl.model.ContentArea'
    ],


    /**
     * @event selectedstudentslistchange
     * Fires when a new students list is selected via browser navigation or a menu
     * @param {SlateDemonstrationsTeacher.view.Dashboard} dashboardCt
     * @param {String|null} studentsList
     * @param {String|null} oldStudentsList
     */

    /**
     * @event selectedcontentareachange
     * Fires when a new content area is selected via browser navigation or a menu
     * @param {SlateDemonstrationsTeacher.view.Dashboard} dashboardCt
     * @param {String|null} contentArea
     * @param {String|null} oldContentArea
     */

    /**
     * @event loadedcontentareachange
     * Fires when the populated record for the last selected section becomes available
     * or is cleared pending a new section loading
     * @param {SlateDemonstrationsTeacher.view.Dashboard} dashboardCt
     * @param {Slate.cbl.model.ContentArea|null} section
     * @param {Slate.cbl.model.ContentArea|null} oldSection
     */


    config: {

        /**
         * @cfg {String|null}
         * The identifier for the students list selected for loading by the user. This config gets
         * set first when the user indicates their intent to navigate to a given students list,
         * and it may not necessarily reflect a valid or available students list.
         *
         * The {@link #event-selectedstudentslistchange} event is fired when this config changes,
         * which should trigger all students list selection UI to update immediately and new data to
         * begin loading.
         */
        selectedStudentsList: null,

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


        // appcontainer config
        header: {
            title: 'Students\' Progress',

            items: [
                {
                    xtype: 'slate-cbl-contentareaselector',
                    emptyText: 'Select'
                },
                {
                    xtype: 'slate-cbl-studentslistselector',
                    emptyText: 'Select',
                    allowBlank: false,
                    flex: 2
                },
                {
                    xtype: 'tbfill',
                    flex: 1
                },
                {
                    cls: 'primary',
                    iconCls: 'x-fa fa-plus',
                    action: 'create-demonstration'
                }
            ]
        },
        placeholder: 'Select a list of students and a content area to load progress dashboard',
    },


    // config handlers
    updateSelectedStudent: function(student, oldStudent) {
        this.fireEvent('selectedstudentchange', this, student, oldStudent);
    },

    updateSelectedContentArea: function(contentArea, oldContentArea) {
        var me = this,
            contentAreaSet = Boolean(contentArea);

        Ext.suspendLayouts();
        me.setPlaceholder(!contentAreaSet);
        // me.setCompetenciesSummary(contentAreaSet);
        // me.setRecentProgress(contentAreaSet);
        // me.setCardsCt(contentAreaSet);
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


    // component lifecycle
    initItems: function() {
        var me = this;

        me.callParent();

        me.add([
            // me.getCompetenciesSummary(),
            // me.getRecentProgress(),
            // me.getCardsCt()
        ]);
    }
});