Ext.define('SlateDemonstrationsStudent.controller.Dashboard', {
    extend: 'Ext.app.Controller',


    // controller configuration
    views: [
        'Dashboard'
    ],

    stores: [
        'StudentCompetencies',
        'Competencies@Slate.cbl.store'
    ],

    refs: {
        dashboardCt: {
            selector: 'slate-demonstrations-student-dashboard',
            autoCreate: true,

            xtype: 'slate-demonstrations-student-dashboard'
        },
        studentSelector: 'slate-demonstrations-student-dashboard slate-appheader slate-cbl-studentselector',
        contentAreaSelector: 'slate-demonstrations-student-dashboard slate-appheader slate-cbl-contentareaselector',
        competenciesSummary: 'slate-demonstrations-student-competenciessummary',
        cardsCt: 'slate-demonstrations-student-cardsct'
    },


    // entry points
    routes: {
        ':studentUsername': {
            action: 'showDashboard',
            conditions: {
                ':studentUsername': '([^/]+)'
            }
        },
        ':studentUsername/:contentAreaCode': {
            action: 'showDashboard',
            conditions: {
                ':studentUsername': '([^/]+)',
                ':contentAreaCode': '([^/]+)'
            }
        }
    },

    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onUnmatchedRoute',
                bootstrapdataload: 'onBootstrapDataLoad'
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
            selectedstudentchange: 'onStudentChange',
            selectedcontentareachange: 'onContentAreaChange',
            loadedcontentareachange: 'onLoadedContentAreaChange'
        },
        studentSelector: {
            select: 'onStudentSelectorSelect',
            clear: 'onStudentSelectorClear'
        },
        contentAreaSelector: {
            select: 'onContentAreaSelectorSelect',
            clear: 'onContentAreaSelectorClear'
        }
    },


    // controller templates method overrides
    onLaunch: function () {

        // instantiate and render viewport
        this.getDashboardCt().render('slateapp-viewport');
    },


    // route handlers
    showDashboard: function(studentUsername, contentAreaCode) {
        var dashboardCt = this.getDashboardCt();

        // use false instead of null, to indicate selecting *nothing* vs having no selection
        dashboardCt.setSelectedStudent(studentUsername == 'me' ? false : studentUsername);
        dashboardCt.setSelectedContentArea(contentAreaCode || null);
    },


    // event handlers
    onUnmatchedRoute: function(token) {
        Ext.Logger.warn('Unmatched route: '+token);
    },

    onBootstrapDataLoad: function(app, bootstrapData) {
        var studentSelector = this.getStudentSelector(),
            studentsStore = studentSelector.getStore(),
            userData = bootstrapData.user,
            isStaff = userData.AccountLevel != 'User',
            wards = userData.Wards || [];

        // show and load student selector for privileged users
        if (isStaff || wards.length) {
            studentSelector.show();

            if (!isStaff) {
                studentSelector.queryMode = 'local';
                studentSelector.setEditable(false);

                if (studentsStore.isLoading()) {
                    studentsStore.getProxy().abortLastRequest();
                }

                studentsStore.loadRawData(wards);
                studentSelector.setValueOnData();
            }
        }
    },

    onStudentCompetenciesStoreBeforeLoad: function(store) {
        this.getCompetenciesSummary().setLoading('Loading content area: '+store.getContentArea());
    },

    onStudentCompetenciesStoreLoad: function(store, studentCompetencies, success) {
        if (!success) {
            return;
        }


        // eslint-disable-next-line vars-on-top
        var me = this,
            competenciesSummary = me.getCompetenciesSummary(),
            cardsCt = me.getCardsCt(),

            rawData = store.getProxy().getReader().rawData,
            contentAreaData = rawData.ContentArea,
            competenciesData = contentAreaData.Competencies,

            competenciesStore = me.getCompetenciesStore(),
            competenciesCount, competencyIndex,

            studentCompetenciesStore = me.getStudentCompetenciesStore(),
            studentCompetenciesCount = studentCompetenciesStore.getCount(),
            studentCompetencyIndex, studentCompetency, level, competencyId,
            competency, competencyCurrent, average, growth,


            competencyLevels = {},
            lowestLevel = Infinity,
            totalRequired = 0,
            totalMissed = 0,
            totalComplete = 0,
            averageValues = [],
            growthValues = [],

            cardConfigs = [];


        // load content area and competencies
        delete contentAreaData.Competencies;
        me.getDashboardCt().setLoadedContentArea(contentAreaData);
        competenciesStore.loadRawData(competenciesData);


        // find highest enrollment for each competency
        for (studentCompetencyIndex = 0; studentCompetencyIndex < studentCompetenciesCount; studentCompetencyIndex++) {
            studentCompetency = studentCompetenciesStore.getAt(studentCompetencyIndex);
            competencyId = studentCompetency.get('CompetencyID');
            level = studentCompetency.get('Level');

            // locate related competency in current store
            competency = competenciesStore.getById(competencyId);

            if (!competency) {
                Ext.Logger.warn('Encountered CompetencyID not in loaded content area, skipping...');
                continue;
            }

            // set current to highest enrolled
            competencyCurrent = competency.get('currentStudentCompetency');

            if (!competencyCurrent || competencyCurrent.get('Level') < level) {
                competency.set('currentStudentCompetency', studentCompetency, { dirty: false });
                competencyLevels[competencyId] = level;
            }
        }


        // determine lowest level of highest enrollments
        lowestLevel = Ext.Array.min(Object.values(competencyLevels));


        // aggregate data for lowest incomplete level
        for (studentCompetencyIndex = 0; studentCompetencyIndex < studentCompetenciesCount; studentCompetencyIndex++) {
            studentCompetency = studentCompetenciesStore.getAt(studentCompetencyIndex);

            // process only the lowest incomplete level
            if (studentCompetency.get('Level') !== lowestLevel) {
                continue;
            }

            // update aggregate values
            totalRequired += studentCompetency.get('demonstrationsRequired');
            totalMissed += studentCompetency.get('demonstrationsMissed');
            totalComplete += studentCompetency.get('demonstrationsComplete');

            average = studentCompetency.get('demonstrationsAverage');
            if (average !== null) {
                averageValues.push(average);
            }

            growth = studentCompetency.get('growth');
            if (growth !== null) {
                growthValues.push(growth);
            }
        }


        // build cards
        competenciesCount = competenciesStore.getCount();
        competencyIndex = 0;

        for (; competencyIndex < competenciesCount; competencyIndex++) {
            cardConfigs.push({
                competency: competenciesStore.getAt(competencyIndex)
            });
        }


        // update interface
        Ext.suspendLayouts();

        competenciesSummary.setConfig({
            level: isFinite(lowestLevel) ? lowestLevel : null,
            percentComplete: totalRequired ? 100 * totalComplete / totalRequired : null,
            percentMissed: totalRequired ? 100 * totalMissed / totalRequired : null,
            missed: totalRequired ? totalMissed : null,
            average: averageValues.length ? Ext.Array.sum(averageValues) / averageValues.length : null,
            growth: averageValues.length ? Ext.Array.sum(growthValues) / growthValues.length : null
        });

        cardsCt.removeAll(true);
        cardsCt.add(cardConfigs);

        Ext.resumeLayouts(true);


        // finish load
        competenciesSummary.setLoading(false);
    },

    onStudentChange: function(dashboardCt, studentUsername) {
        var me = this,
            studentCombo = me.getStudentSelector(),
            studentCompetenciesStore = me.getStudentCompetenciesStore();

        // (re)load student competencies store
        studentCompetenciesStore.setStudent(studentUsername || '*current');
        studentCompetenciesStore.loadIfDirty();

        // push value to selector
        studentCombo.setValue(studentUsername);

        // reload students store with just selected student if they're not in the current result set
        if (studentUsername && !studentCombo.getSelectedRecord()) {
            studentCombo.getStore().load({
                params: {
                    q: 'username:'+studentUsername
                }
            });
        }
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

    onLoadedContentAreaChange: function(dashboardCt, contentArea) {
        this.getCompetenciesSummary().setContentAreaTitle(contentArea.get('Title'));
    },

    onStudentSelectorSelect: function(studentCombo, student) {
        var path = [student.get('Username')],
            contentArea = this.getDashboardCt().getSelectedContentArea();

        if (contentArea) {
            path.push(contentArea);
        }

        this.redirectTo(path);
    },

    onStudentSelectorClear: function() {
        var path = ['me'],
            contentArea = this.getDashboardCt().getSelectedContentArea();

        if (contentArea) {
            path.push(contentArea);
        }

        this.redirectTo(path);
    },

    onContentAreaSelectorSelect: function(contentAreaCombo, contentArea) {
        this.redirectTo([
            this.getDashboardCt().getSelectedStudent() || 'me',
            contentArea.get('Code')
        ]);
    },

    onContentAreaSelectorClear: function() {
        this.redirectTo([
            this.getDashboardCt().getSelectedStudent() || 'me'
        ]);
    }
});