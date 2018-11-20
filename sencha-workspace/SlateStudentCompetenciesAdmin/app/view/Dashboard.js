/**
 * The top-level container for the Admin's Student Competencies Dashboard application
 * that configures, instantiates, and lays out the top-level view components.
 *
 * As the top-level view, this component also serves as the authoritative store
 * for the application's top-level user-driven state, offering a central place to
 * set and get that state as well as firing change events to propogate state
 * transitions  out to all controllers in the application.
 */
Ext.define('SlateStudentCompetenciesAdmin.view.Dashboard', {
    extend: 'Slate.ui.app.Container',
    xtype: 'slate-studentcompetencies-admin-dashboard',
    requires: [
        'SlateStudentCompetenciesAdmin.view.Grid',

        /* global Slate */
        'Slate.cbl.view.LevelsLegend',
        'Slate.cbl.field.ContentAreaSelector',
        'Slate.cbl.field.StudentsListSelector',
        'Slate.cbl.model.ContentArea'
    ],


    /**
     * @event selectedcontentareachange
     * Fires when a new content area is selected via browser navigation or a menu
     * @param {SlateStudentCompetenciesAdmin.view.Dashboard} dashboardCt
     * @param {String|null} contentArea
     * @param {String|null} oldContentArea
     */

    /**
     * @event loadedcontentareachange
     * Fires when the populated record for the last selected section becomes available
     * or is cleared pending a new section loading
     * @param {SlateStudentCompetenciesAdmin.view.Dashboard} dashboardCt
     * @param {Slate.cbl.model.ContentArea|null} section
     * @param {Slate.cbl.model.ContentArea|null} oldSection
     */

    /**
     * @event selectedstudentslistchange
     * Fires when a new students list is selected via browser navigation or a menu
     * @param {SlateStudentCompetenciesAdmin.view.Dashboard} dashboardCt
     * @param {String|null} studentsList
     * @param {String|null} oldStudentsList
     */


    config: {

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
         * @cfg {SlateStudentCompetenciesAdmin.view.Grid|Object|boolean}
         * Instance or configuration for progress grid component.
         *
         * Setting boolean values change visibility.
         */
        grid: false,

        /**
         * @cfg {Slate.cbl.view.LevelsLegend|Object|boolean}
         * Instance or configuration for legend component.
         *
         * Setting boolean values change visibility.
         */
        legend: false,


        // appcontainer config
        fullWidth: true,
        header: {
            title: 'Students\u2019 Enrollments', // u2019 = right single quote

            items: [
                {
                    xtype: 'slate-cbl-contentareaselector',
                    emptyText: 'Select'
                },
                {
                    xtype: 'slate-cbl-studentslistselector',
                    emptyText: 'Select',
                    flex: 1
                },
                {
                    xtype: 'tbfill',
                    flex: 2
                }
            ]
        },
        placeholderItem: 'Select a list of students and a content area to load enrollments dashboard'
    },


    // component configuration
    cls: 'slate-studentcompetencies-admin-dashboard',


    // config handlers
    updateSelectedContentArea: function(contentArea, oldContentArea) {
        this.fireEvent('selectedcontentareachange', this, contentArea, oldContentArea);
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
        var me = this,
            isLoaded = Boolean(contentArea);

        if (contentArea) {
            me.setSelectedContentArea(contentArea.get('Code'));
        }

        me.setPlaceholderItem(!isLoaded);
        me.setGrid(isLoaded);
        me.setLegend(isLoaded);

        me.fireEvent('loadedcontentareachange', me, contentArea, oldContentArea);
    },

    updateSelectedStudentsList: function(studentsList, oldStudentsList) {
        this.fireEvent('selectedstudentslistchange', this, studentsList, oldStudentsList);
    },

    applyGrid: function(grid, oldGrid) {
        if (typeof grid === 'boolean') {
            grid = {
                hidden: !grid
            };
        }

        return Ext.factory(grid, 'SlateStudentCompetenciesAdmin.view.Grid', oldGrid);
    },

    applyLegend: function(legend, oldLegend) {
        if (typeof legend === 'boolean') {
            legend = {
                hidden: !legend
            };
        }

        return Ext.factory(legend, 'Slate.cbl.view.LevelsLegend', oldLegend);
    },


    // component lifecycle
    initItems: function() {
        var me = this;

        me.callParent();

        me.add([
            me.getGrid(),
            me.getLegend()
        ]);
    }
});