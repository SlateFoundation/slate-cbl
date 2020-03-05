/**
 * The top-level container for the Teachers' Tasks Dashboard application
 * that configures, instantiates, and lays out the top-level view components.
 *
 * As the top-level view, this component also serves as the authoritative store
 * for the application's top-level user-driven state, offering a central place to
 * set and get that state as well as firing change events to propogate state
 * transitions  out to all controllers in the application.
 */
Ext.define('SlateTasksTeacher.view.Dashboard', {
    extend: 'Slate.ui.app.Container',
    xtype: 'slate-tasks-teacher-dashboard',
    requires: [
        'SlateTasksTeacher.view.StudentsGrid',
        'SlateTasksTeacher.view.GridLegend',
        'SlateTasksTeacher.view.GridToolbar',

        'Slate.cbl.field.SectionSelector',
        'Slate.cbl.field.CohortSelector',
    ],


    /**
     * @event selectedsectionchange
     * Fires when a new section is selected via browser navigation or a menu
     * @param {SlateTasksTeacher.view.Dashboard} dashboardCt
     * @param {String|null} sectionCode
     * @param {String|null} oldSectionCode
     */

    /**
     * @event selectedcohortchange
     * Fires when a new cohort is selected via browser navigation or a menu
     * @param {SlateTasksTeacher.view.Dashboard} dashboardCt
     * @param {String|null} cohortName
     * @param {String|null} oldCohortName
     */

    /**
     * @event loadedsectionchange
     * Fires when the populated record for the last selected section becomes available
     * or is cleared pending a new section loading
     * @param {SlateTasksTeacher.view.Dashboard} dashboardCt
     * @param {Slate.model.course.Section|null} section
     * @param {Slate.model.course.Section|null} oldSection
     */


    config: {

        /**
         * @cfg {String}
         * The code for the course section selected for loading by the user. This config gets
         * set first when the user indicates their intent to navigate to a given section,
         * and it may not necessarily reflect a valid or available section.
         *
         * The {@link #event-selectedsectionchange} event is fired when this config changes,
         * which should trigger all section selection UI to update immediately and new data to
         * begin loading.
         */
        selectedSection: null,

        /**
         * @cfg {String|null}
         * The name for the section cohort selected for loading by the user. This config gets
         * set first when the user indicates their intent to navigate to a given cohort,
         * and it may not necessarily reflect a valid or available cohort.
         *
         * The {@link #event-selectedcohortchange} event is fired when this config changes,
         * which should trigger all cohort selection UI to update immediately and new data to
         * begin loading.
         */
        selectedCohort: null,

        /**
         * @cfg {Slate.model.course.Section|null}
         * The loaded course section model instance for the application. This config gets
         * set following a change in {@link #cfg-selectedSection} and successful load
         * of the indicated course section.
         */
        loadedSection: null,

        /**
         * @cfg {SlateTasksTeacher.view.StudentsGrid|Object|boolean}
         * Instance or configuration for students grid component.
         *
         * Setting boolean values change visibility.
         */
        studentsGrid: false,

        /**
         * @cfg {SlateTasksTeacher.view.GridLegend|Object|boolean}
         * Instance or configuration for grid legend component.
         *
         * Setting boolean values change visibility.
         */
        gridLegend: false,


        /**
         * @cfg {SlateTasksTeacher.view.GridToolbar|Object|boolean}
         * Instance or configuration for grid toolbar component.
         *
         * Setting boolean values change visibility.
         */
        gridToolbar: false,


        fullWidth: true,
        header: {
            title: 'Classroom Tasks',

            items: [
                {
                    xtype: 'slate-cbl-sectionselector',
                    store: 'Sections',
                    queryMode: 'local',
                    emptyText: 'Select',
                    allowBlank: false
                },
                {
                    xtype: 'slate-cbl-cohortselector',
                    lazyAutoLoad: false,
                    hidden: true,
                    store: 'SectionCohorts',
                    queryMode: 'local',
                    emptyText: 'All Students'
                },
                '->',
                {
                    cls: 'primary',
                    iconCls: 'x-fa fa-plus',
                    action: 'create',
                    hidden: true,
                    disabled: true
                }
            ]
        },
        placeholderItem: 'Select a section to load tasks dashboard'
    },


    // config handlers
    updateSelectedSection: function(section, oldSection) {
        var me = this,
            sectionSet = Boolean(section);

        Ext.suspendLayouts();
        me.setPlaceholderItem(!sectionSet);
        me.setStudentsGrid(sectionSet);
        me.setGridLegend(sectionSet);
        me.setGridToolbar(sectionSet);
        Ext.resumeLayouts(true);

        me.fireEvent('selectedsectionchange', me, section, oldSection);
    },

    updateSelectedCohort: function(cohort, oldCohort) {
        this.fireEvent('selectedcohortchange', this, cohort, oldCohort);
    },

    updateLoadedSection: function(section, oldSection) {
        var me = this;

        if (section) {
            me.setSelectedSection(section.get('Code'));
        }

        me.fireEvent('loadedsectionchange', me, section, oldSection);
    },

    applyStudentsGrid: function(studentsGrid, oldStudentsGrid) {
        if (typeof studentsGrid === 'boolean') {
            studentsGrid = {
                hidden: !studentsGrid
            };
        }

        return Ext.factory(studentsGrid, 'SlateTasksTeacher.view.StudentsGrid', oldStudentsGrid);
    },

    applyGridLegend: function(gridLegend, oldGridLegend) {
        if (typeof gridLegend === 'boolean') {
            gridLegend = {
                hidden: !gridLegend
            };
        }

        return Ext.factory(gridLegend, 'SlateTasksTeacher.view.GridLegend', oldGridLegend);
    },

    applyGridToolbar: function(gridToolbar, oldGridToolbar) {
        if (typeof gridToolbar === 'boolean') {
            gridToolbar = {
                hidden: !gridToolbar
            };
        }

        return Ext.factory(gridToolbar, 'SlateTasksTeacher.view.GridToolbar', oldGridToolbar);
    },


    // component lifecycle
    initItems: function() {
        var me = this;

        me.callParent();

        me.add([
            me.getStudentsGrid(),
            me.getGridToolbar(),
            me.getGridLegend()
        ]);
    }
});