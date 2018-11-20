Ext.define('SlateStudentCompetenciesAdmin.controller.Dashboard', {
    extend: 'Ext.app.Controller',


    // controller configuration
    views: [
        'Dashboard'
    ],

    stores: [
        'Students@Slate.store.people',
        'Competencies@Slate.cbl.store',
        'StudentCompetencies'
    ],

    refs: {
        dashboardCt: {
            selector: 'slate-studentcompetencies-admin-dashboard',
            autoCreate: true,

            xtype: 'slate-studentcompetencies-admin-dashboard'
        },
        contentAreaSelector: 'slate-studentcompetencies-admin-dashboard slate-appheader slate-cbl-contentareaselector',
        studentsListSelector: 'slate-studentcompetencies-admin-dashboard slate-appheader slate-cbl-studentslistselector',
        progressGrid: 'slate-studentcompetencies-admin-dashboard slate-studentcompetencies-admin-grid'
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
        }
    },


    // controller lifecycle
    onLaunch: function () {

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
    }
});