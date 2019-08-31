/**
 * TODO:
 * - move rendering responsibilities to the view?
 */
Ext.define('SlateDemonstrationsTeacher.controller.Dashboard', {
    extend: 'Ext.app.Controller',


    // controller configuration
    views: [
        'Dashboard'
    ],

    stores: [
        'Students',
        'Competencies@Slate.cbl.store',
        'Skills@Slate.cbl.store',
        'StudentCompetencies'
    ],

    refs: {
        dashboardCt: {
            selector: 'slate-demonstrations-teacher-dashboard',
            autoCreate: true,

            xtype: 'slate-demonstrations-teacher-dashboard'
        },
        contentAreaSelector: 'slate-demonstrations-teacher-dashboard slate-appheader slate-cbl-contentareaselector',
        studentsListSelector: 'slate-demonstrations-teacher-dashboard slate-appheader slate-cbl-studentslistselector',
        progressGrid: 'slate-demonstrations-teacher-dashboard slate-demonstrations-teacher-progressgrid'
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
        progressGrid: {
            competencyrowclick: 'onCompetencyRowClick'
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
        var dashboardCt = this.getDashboardCt();

        dashboardCt.setProgressGrid(false);
        dashboardCt.setLoading('Loading progress...');
    },

    onStudentCompetenciesStoreLoad: function(store, studentCompetencies, success) {
        if (!success) {
            return;
        }


        // eslint-disable-next-line vars-on-top
        var me = this,
            dashboardCt = me.getDashboardCt(),
            skillsStore = me.getSkillsStore(),
            proxy = store.getProxy(),
            studentsCollection = proxy.relatedCollections.Student,
            rawData = proxy.getReader().rawData,
            contentAreaData = rawData.ContentArea,
            competenciesData = contentAreaData.Competencies,
            competenciesLength = competenciesData.length,
            competencyIndex = 0;


        // clear embedded data from contentArea
        delete contentAreaData.Competencies;


        // load content area, competencies, skills, and students
        dashboardCt.setLoadedContentArea(contentAreaData);

        me.getCompetenciesStore().loadRawData(competenciesData);

        skillsStore.beginUpdate();
        skillsStore.removeAll(true);
        for (; competencyIndex < competenciesLength; competencyIndex++) {
            skillsStore.loadRawData(competenciesData[competencyIndex].Skills, true);
        }
        skillsStore.endUpdate();

        me.getStudentsStore().loadRawData(studentsCollection.getRange());


        // finish load
        dashboardCt.setProgressGrid({
            contentArea: dashboardCt.getLoadedContentArea()
        });
        dashboardCt.setLoading(false);
    },

    onContentAreaChange: function(dashboardCt, contentAreaCode) {
        var me = this,
            studentCompetenciesStore = me.getStudentCompetenciesStore();

        // (re)load student competencies store
        studentCompetenciesStore.setContentArea(contentAreaCode);
        studentCompetenciesStore.loadIfDirty();

        // push value to selector
        me.getContentAreaSelector().setValue(contentAreaCode);
    },

    onStudentsListChange: function(dashboardCt, studentsList) {
        var me = this,
            studentCompetenciesStore = me.getStudentCompetenciesStore();

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

    onCompetencyRowClick: function(progressGrid, context) {
        progressGrid.toggleCompetency(context.competency);
    }
});