Ext.define('SlateDemonstrationsStudent.controller.Dashboard', {
    extend: 'Ext.app.Controller',
    requires: [
        /* global Slate */
        'Slate.API'
    ],


    // controller configuration
    views: [
        'Dashboard',
        'OverviewWindow'
    ],

    stores: [
        'ContentAreas',
        // 'Students'
    ],


    refs: {
        dashboardCt: {
            selector: 'slate-demonstrations-student-dashboard',
            autoCreate: true,

            xtype: 'slate-demonstrations-student-dashboard'
        },
        studentSelector: 'slate-demonstrations-student-dashboard slate-appheader slate-cbl-studentselector',
        contentAreaSelector: 'slate-demonstrations-student-dashboard slate-appheader slate-cbl-contentareaselector'

        // contentAreaStatusCmp: {
        //     selector: 'slate-demonstrations-student-contentareastatus',
        //     autoCreate: true,

        //     xtype: 'slate-demonstrations-student-contentareastatus'
        // },
        // recentProgressCmp: {
        //     selector: 'slate-demonstrations-student-recentprogress',
        //     autoCreate: true,

        //     xtype: 'slate-demonstrations-student-recentprogress'
        // },
        // appHeader: {
        //     selector: 'slate-demonstrations-student-appheader',
        //     autoCreate: true,

        //     xtype: 'slate-demonstrations-student-appheader'
        // },
        // competencyCard: 'slate-demonstrations-student-competencycard',
        // studentSelector: 'slate-demonstrations-student-appheader #studentCombo',
        // contentAreaSelector: 'slate-demonstrations-student-appheader #contentAreaCombo'
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
                unmatchedroute: 'onUnmatchedRoute'
            }
        }
    },

    control: {
        dashboardCt: {
            selectedstudentchange: 'onStudentChange',
            selectedcontentareachange: 'onContentAreaChange'
        },
        studentSelector: {
            select: 'onStudentSelectorSelect',
            clear: 'onStudentSelectorClear'
        },
        contentAreaSelector: {
            select: 'onContentAreaSelectorSelect',
            clear: 'onContentAreaSelectorClear'
        }
    //     competencyCard: {
    //         democellclick: 'onDemoCellClick'
    //     }
    },

    // controller templates method overrides
    onLaunch: function () {
        var me = this;

        // instantiate and render viewport
        me.getDashboardCt().render('slateapp-viewport');

        // load bootstrap data
        Slate.API.request({
            method: 'GET',
            url: '/cbl/dashboards/demonstrations/student/bootstrap',
            params: {
                include: 'Wards'
            },
            success: function(response) {
                var studentSelector = me.getStudentSelector(),
                    studentsStore = studentSelector.getStore(),
                    userData = response.data.user,
                    isStaff = userData.AccountLevel != 'User',
                    wards = userData.Wards || [];

                // show and load student selector for priveleged users
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
            }
        });
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

    onStudentChange: function(dashboardCt, studentUsername) {
        var me = this,
            studentCombo = me.getStudentSelector();
            // sectionsStore = me.getSectionsStore();

        // (re)load content areas list
        // sectionsStore.getProxy().setExtraParam('enrolled_user', studentUsername || 'current');
        // sectionsStore.load();

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
        var me = this;

        me.getContentAreaSelector().setValue(contentAreaCode);
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


    // event handlers
    // onDashboardCtRender: function(dashboardCt) {
    //     var studentId = dashboardCt.getStudentId(),
    //         competenciesStore = dashboardCt.getCompetenciesStore(),
    //         contentAreaStatusCmp = this.getContentAreaStatusCmp();

    //     if (!studentId || !competenciesStore.isLoaded()) { // TODO: check if competencies store is loaded instead
    //         return;
    //     }

    //     dashboardCt.setCompetenciesStatus('loading');

    //     dashboardCt.getCompletionsStore().loadByStudentsAndCompetencies(studentId, competenciesStore.collect('ID'), {
    //         callback: function(completions) {
    //             var minLevel = Infinity,
    //                 totalRequired = 0,
    //                 totalMissed = 0,
    //                 totalComplete = 0,
    //                 averageValues = [],
    //                 growthValues = [],
    //                 cardConfigs = [],
    //                 completionsLength = completions.length,
    //                 completionIndex = 0,
    //                 completion, lowestCompletion, average, growth;

    //             for (; completionIndex < completionsLength; completionIndex++) {
    //                 completion = completions[completionIndex];

    //                 cardConfigs.push({
    //                     competency: competenciesStore.getById(completion.get('CompetencyID')),
    //                     completion: completion,
    //                     autoEl: 'li'
    //                 });

    //                 // only use completions for lowest incomplete level for aggregate figures
    //                 lowestCompletion = completion.get('lowest');

    //                 if (lowestCompletion === false) {
    //                     // this completion isn't at the lowest level but one at that level isn't available
    //                     continue;
    //                 } else if (lowestCompletion) {
    //                     // switch to lowest-level completion
    //                     completion = lowestCompletion;
    //                 }

    //                 minLevel = Math.min(minLevel, completion.get('currentLevel'));
    //                 totalRequired += completion.get('demonstrationsRequired');
    //                 totalMissed += completion.get('demonstrationsMissed');
    //                 totalComplete += completion.get('demonstrationsComplete');

    //                 if (growth = completion.get('growth')) {
    //                     growthValues.push(growth);
    //                 }

    //                 if (average = completion.get('demonstrationsAverage')) {
    //                     averageValues.push(average);
    //                 }
    //             }

    //             contentAreaStatusCmp.setLevel(minLevel);
    //             contentAreaStatusCmp.setPercentComplete(100 * totalComplete / totalRequired);
    //             contentAreaStatusCmp.setPercentMissed(100 * totalMissed / totalRequired);
    //             contentAreaStatusCmp.setMissed(totalMissed);
    //             contentAreaStatusCmp.setAverage(Ext.Array.sum(averageValues) / averageValues.length);
    //             contentAreaStatusCmp.setGrowth(Ext.Array.sum(growthValues) / growthValues.length);

    //             dashboardCt.add(cardConfigs);

    //             dashboardCt.setCompetenciesStatus('loaded');
    //         }
    //     });
    // },

    // onDemoCellClick: function(competencyCard, ev, targetEl) {
    //     this.getOverviewWindowView().create({
    //         ownerCmp: this.getDashboardCt(),
    //         autoShow: true,
    //         animateTarget: targetEl,

    //         competency: parseInt(targetEl.up('ul.cbl-skill-demos').up('li.cbl-competency-panel').getAttribute('data-competency'), 10),
    //         skill: parseInt(targetEl.up('ul.cbl-skill-demos').getAttribute('data-skill'), 10),
    //         student: this.getDashboardCt().getStudentId(),
    //         selectedDemonstration: parseInt(targetEl.getAttribute('data-demonstration'), 10)
    //     });
    // },

    // syncFilters: function() {
    //     var me = this,
    //         appHeader = me.getAppHeader(),
    //         token = Ext.util.History.getToken(),
    //         recentProgressCmp = me.getRecentProgressCmp(),
    //         dashboardCt = me.getDashboardCt(),
    //         splitToken = [], i = 0,
    //         param, value,
    //         studentCombo, contentAreaCombo,
    //         student, contentArea;

    //     if (token) {
    //         if (dashboardCt.getContentAreaId() && dashboardCt.getStudentId()) {
    //             window.location.reload();
    //         }
    //         splitToken = token.split('&');
    //         for (; i < splitToken.length; i++) {
    //             param = splitToken[i].split('=', 1)[0];
    //             value = splitToken[i].split('=', 2)[1];

    //             if (param == 'student') {
    //                 studentCombo = appHeader.down('#studentCombo');
    //                 if (!studentCombo.getStore().isLoaded()) {
    //                     dashboardCt.mask('Loading Content Areas&hellip;');
    //                     studentCombo.getStore().load({
    //                         params: {
    //                             q: value
    //                         },
    //                         callback: function() {
    //                             dashboardCt.unmask();
    //                             return me.syncFilters();
    //                         }
    //                     });
    //                     return;
    //                 }

    //                 student = studentCombo.getStore().findRecord('Username', window.decodeURI(value));
    //                 studentCombo.setValue(student);
    //                 if (student) {
    //                     // configure recent progress component with any available embedded data
    //                     recentProgressCmp.setStudentId(student.getId());
    //                     // configure dashboard with any available embedded data
    //                     dashboardCt.setStudentId(student.getId());
    //                 }
    //             } else if (param == 'contentarea') {
    //                 contentAreaCombo = appHeader.down('#contentAreaCombo');
    //                 if (!contentAreaCombo.getStore().isLoaded()) {
    //                     dashboardCt.mask('Loading Content Areas&hellip;');
    //                     contentAreaCombo.getStore().getSource().load(function() {
    //                         dashboardCt.unmask();
    //                         return me.syncFilters();
    //                     });
    //                     return;
    //                 }

    //                 contentArea = contentAreaCombo.getStore().findRecord('Code', window.decodeURI(value));
    //                 contentAreaCombo.setValue(contentArea);
    //                 if (contentArea) {
    //                     recentProgressCmp.setContentAreaId(contentArea.getId());
    //                     dashboardCt.setContentAreaId(contentArea.getId());
    //                 }
    //             }
    //         }
    //     }
    // }
});