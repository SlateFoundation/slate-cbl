Ext.define('SlateStudentCompetenciesAdmin.controller.Dashboard', {
    extend: 'Ext.app.Controller',
    requires: [
        /* global Slate*/
        'Slate.cbl.util.Config'
    ],


    // controller configuration
    views: [
        'Dashboard'
    ],

    stores: [
        'Students@Slate.store.people',
        'Competencies@Slate.cbl.store',
        'StudentCompetencies'
    ],

    models: [
        'StudentCompetency@Slate.cbl.model'
    ],

    refs: {
        dashboardCt: {
            selector: 'slate-studentcompetencies-admin-dashboard',
            autoCreate: true,

            xtype: 'slate-studentcompetencies-admin-dashboard'
        },
        contentAreaSelector: 'slate-studentcompetencies-admin-dashboard slate-appheader slate-cbl-contentareaselector',
        studentsListSelector: 'slate-studentcompetencies-admin-dashboard slate-appheader slate-cbl-studentslistselector',
        grid: 'slate-studentcompetencies-admin-dashboard slate-studentcompetencies-admin-grid'
    },


    // entry points
    routes: {
        ':contentAreaCode': {
            action: 'showDashboard',
            conditions: {
                ':contentAreaCode': '([^/]+)'
            }
        },
        ':contentAreaCode/:studentsList': {
            action: 'showDashboard',
            conditions: {
                ':contentAreaCode': '([^/]+)',
                ':studentsList': '([^/]+)'
            }
        }
    },

    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onUnmatchedRoute'
            }
        },
        store: {
            '#StudentCompetencies': {
                beforeload: 'onStudentCompetenciesStoreBeforeLoad',
                load: 'onStudentCompetenciesStoreLoad'
            }
        }
    },

    control: {
        dashboardCt: {
            selectedcontentareachange: 'onContentAreaChange',
            selectedstudentslistchange: 'onStudentsListChange'
        },
        contentAreaSelector: {
            select: 'onContentAreaSelectorSelect',
            clear: 'onContentAreaSelectorClear'
        },
        studentsListSelector: {
            select: 'onStudentsListSelectorSelect',
            clear: 'onStudentsListSelectorClear'
        },
        grid: {
            cellclick: 'onCellClick'
        }
    },


    // controller lifecycle
    onLaunch: function () {
        // build array of available levels
        this.availableLevels = Slate.cbl.util.Config.getAvailableLevels();

        // instantiate and render viewport
        this.getDashboardCt().render('slateapp-viewport');
    },


    // route handlers
    showDashboard: function(contentAreaCode, studentsList) {
        var dashboardCt = this.getDashboardCt();

        dashboardCt.setSelectedContentArea(contentAreaCode != '_' && contentAreaCode || null);
        dashboardCt.setSelectedStudentsList(this.decodeRouteComponent(studentsList) || null);
    },


    // event handlers
    onUnmatchedRoute: function(token) {
        Ext.Logger.warn('Unmatched route: '+token);
    },

    onStudentCompetenciesStoreBeforeLoad: function() {
        this.getDashboardCt().setLoading('Loading enrollments...');
    },

    onStudentCompetenciesStoreLoad: function(store, studentCompetencies, success) {
        this.getDashboardCt().setLoading(false);
    },

    onContentAreaChange: function(dashboardCt, contentAreaCode) {
        var me = this,
            competenciesStore = me.getCompetenciesStore(),
            studentCompetenciesStore = me.getStudentCompetenciesStore();

        // (re)load student competencies store
        competenciesStore.setContentArea(contentAreaCode);
        competenciesStore.loadIfDirty();

        // (re)load student competencies store
        studentCompetenciesStore.setContentArea(contentAreaCode);
        studentCompetenciesStore.loadIfDirty();

        // push value to selector
        me.getContentAreaSelector().setValue(contentAreaCode);
    },

    onStudentsListChange: function(dashboardCt, studentsList) {
        var me = this,
            studentsStore = me.getStudentsStore(),
            studentCompetenciesStore = me.getStudentCompetenciesStore();

        // (re)load student competencies store
        studentsStore.setList(studentsList || null);
        studentsStore.loadIfDirty();

        // (re)load student competencies store
        studentCompetenciesStore.setStudentsList(studentsList || null);
        studentCompetenciesStore.loadIfDirty();

        // push value to selector
        me.getStudentsListSelector().setValue(studentsList);
    },

    onContentAreaSelectorSelect: function(contentAreaCombo, contentArea) {
        var path = [contentArea.get('Code')],
            studentsList = this.getDashboardCt().getSelectedStudentsList();

        if (studentsList) {
            path.push(studentsList);
        }

        this.redirectTo(path);
    },

    onContentAreaSelectorClear: function() {
        var path = ['_'],
            studentsList = this.getDashboardCt().getSelectedStudentsList();

        if (studentsList) {
            path.push(studentsList);
        }

        this.redirectTo(path);
    },

    onStudentsListSelectorSelect: function(studentsListCombo, studentsList) {
        var contentArea = this.getDashboardCt().getSelectedContentArea();

        this.redirectTo([
            contentArea || '_',
            studentsList.get('value')
        ]);
    },

    onStudentsListSelectorClear: function() {
        this.redirectTo(this.getDashboardCt().getSelectedContentArea() || '_');
    },

    onCellClick: function(grid, competencyId, studentId, cellEl) {
        var me = this,
            studentCompetenciesStore = me.getStudentCompetenciesStore(),
            StudentCompetency = me.getStudentCompetencyModel(),
            availableLevels = me.availableLevels,
            currentLevel = parseInt(cellEl.dom.textContent, 10),
            nextLevel, studentCompetency;

        // find any existing phantom record
        studentCompetency = studentCompetenciesStore.queryBy(
            sc => sc.phantom
                  && sc.get('StudentID') == studentId
                  && sc.get('CompetencyID') == competencyId
        ).first();

        // determine next level
        if (currentLevel) {
            nextLevel = availableLevels[availableLevels.indexOf(currentLevel) + 1];

            if (!nextLevel) {
                // reset existing phantom when clicking past last level
                if (studentCompetency) {
                    studentCompetency.drop();
                }

                return;
            }
        } else {
            nextLevel = availableLevels[0];
        }

        // update existing phantom or create new one
        if (studentCompetency) {
            studentCompetency.set('Level', nextLevel);
        } else {
            studentCompetency = StudentCompetency.create({
                StudentID: studentId,
                CompetencyID: competencyId,
                Level: nextLevel,
                EnteredVia: 'enrollment'
            });

            studentCompetenciesStore.add(studentCompetency);
        }
    }
});