/**
 * TODO:
 * - move rendering responsibilities to the view?
 */
Ext.define('SlateDemonstrationsTeacher.controller.Dashboard', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.window.MessageBox',

        // 'Jarvus.util.APIDomain',

        /* global Slate */
        'Slate.API',
    ],


    // controller configuration
    views: [
        'Dashboard',
        // 'OverviewWindow',
        // 'OverrideWindow',
        // 'EditWindow'
    ],

    // models: [
    //     'Demonstration@Slate.cbl.model'
    // ],

    stores: [
        'Students',
        'ContentAreas@Slate.cbl.store',
        'Competencies@Slate.cbl.store',
        'Skills@Slate.cbl.store',
        'StudentCompetencies',
        'DemonstrationSkills'
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
        // api: {
        //     demonstrationsave: 'onDemonstrationSave',
        //     demonstrationdelete: 'onDemonstrationDelete'
        // }
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
        // studentProgressGrid: {
        //     competencyrowclick: 'onCompetencyRowClick',
        //     democellclick: 'onDemoCellClick'
        // },
        // 'slate-demonstrations-teacher-skill-overviewwindow': {
        //     createdemonstrationclick: 'onOverviewCreateDemonstrationClick',
        //     editdemonstrationclick: 'onOverviewEditDemonstrationClick',
        //     deletedemonstrationclick: 'onOverviewDeleteDemonstrationClick',
        //     createoverrideclick: 'onOverviewCreateOverrideClick'
        // },
        // 'slate-demonstrations-teacher-appheader button[action=submitevidence]': {
        //     click: 'onSubmitEvidenceClick'
        // }
    },


    // controller lifecycle
    onLaunch: function () {
        var me = this;

        // instantiate and render viewport
        me.getDashboardCt().render('slateapp-viewport');

        // load bootstrap data
        Slate.API.request({
            method: 'GET',
            url: '/cbl/dashboards/demonstrations/teacher/bootstrap',
            success: function(response) {
                console.log('Loaded bootstrap data', response.data);
            }
        });


        // var me = this,
        //     dashboardCt = me.getDashboardCt();
        //     studentGroupSelector = me.getStudentGroupSelector(),
        //     SiteEnvironment = window.SiteEnvironment;

        // if (SiteEnvironment === undefined) {
        //     SiteEnvironment = window.SiteEnvironment = {};
        // }

        // load bootstrap data
        // Slate.API.request({
        //     url: '/cbl/dashboards/demonstrations/teacher/bootstrap',
        //     success: function(response) {
        //         var data = response.data || Ext.decode(response.responseText);

        //         if (data) {
        //             if (data.experience_types) {
        //                 window.SiteEnvironment.cblExperienceTypeOptions = data.experience_types;
        //             }

        //             if (data.context_options) {
        //                 SiteEnvironment.cblContextOptions = data.context_options;
        //             }

        //             if (data.performance_types) {
        //                 SiteEnvironment.cblPerformanceTypeOptions = data.performance_types;
        //             }

        //             if (data.cblLevels) {
        //                 Slate.cbl.data.CBLLevels.loadRawData(data.cblLevels, false);
        //             }
        //         }
        //     }
        // });

        // // load current user sections
        // me.getCourseSectionsStore().load(function() {
        //     studentGroupSelector.getStore().loadData(Ext.Array.map(this.getRange(), function(cs) {
        //         return cs.data;
        //     }), true);
        // });

        // // load all groups
        // me.getGroupsStore().load(function() {
        //     studentGroupSelector.getStore().loadData(Ext.Array.map(this.getRange(), function(g) {
        //         return g.data;
        //     }), true);
        // });

        // // handle any external "Log a Demonstartion" buttons
        // Ext.getBody().on('click', function(ev) {
        //     ev.stopEvent();

        //     me.showDemonstrationEditWindow();
        // }, me, { delegate: 'button[data-action="demonstration-create"]' });

        // render dashboard
        // dashboardCt.render('slateapp-viewport');

        // var studentCompetenciesStore = this.getStudentCompetenciesStore();

        // debugger;

        // studentCompetenciesStore.setStudents('3,4,2,5,6,7,8,10,9,12,14,11,13,15,16,19,17,18,20,21');
        // studentCompetenciesStore.setContentArea('MIDMATH');
        // studentCompetenciesStore.loadIfDirty();
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
        this.getDashboardCt().setLoading('Loading progress...');
    },

    onStudentCompetenciesStoreLoad: function(store, studentCompetencies, success) {
        if (!success) {
            return;
        }


        // eslint-disable-next-line vars-on-top
        var me = this,
            dashboardCt = me.getDashboardCt(),
            skillsStore = me.getSkillsStore(),
            rawData = store.getProxy().getReader().rawData,
            relatedData = rawData.related || {},
            contentAreaData = rawData.ContentArea,
            competenciesData = contentAreaData.Competencies,
            competenciesLength = competenciesData.length,
            competencyIndex = 0;


        // clear embedded data from contentArea
        delete contentAreaData.Competencies;


        // load content area, competencies, skills, and students
        me.getDashboardCt().setLoadedContentArea(contentAreaData);

        me.getCompetenciesStore().loadRawData(competenciesData);

        skillsStore.beginUpdate();
        skillsStore.removeAll(true);
        for (; competencyIndex < competenciesLength; competencyIndex++) {
            skillsStore.loadRawData(competenciesData[competencyIndex].Skills, true);
        }
        skillsStore.endUpdate();

        me.getStudentsStore().loadRawData(relatedData.Student || []);


        // finish load
        dashboardCt.setProgressGrid(true); // TODO: defer until students loaded
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
    }


    // event handers


    // onSubmitEvidenceClick: function() {
    //     this.showDemonstrationEditWindow();
    // },

    // onCompetencyRowClick: function(me, competency, ev, targetEl) {
    //     me.toggleCompetency(competency);
    // },

    // onDemoCellClick: function(progressGrid, ev, targetEl) {
    //     this.getOverviewWindowView().create({
    //         ownerCmp: this.getDashboardCt(),
    //         autoShow: true,
    //         animateTarget: targetEl,

    //         competency: parseInt(targetEl.up('.cbl-grid-skills-row').getAttribute('data-competency'), 10),
    //         studentsStore: progressGrid.getStudentsStore(),
    //         competenciesStore: progressGrid.getCompetenciesStore(),

    //         skill: parseInt(targetEl.up('.cbl-grid-skill-row').getAttribute('data-skill'), 10),
    //         student: parseInt(targetEl.up('.cbl-grid-demos-cell').getAttribute('data-student'), 10),
    //         selectedDemonstration: parseInt(targetEl.getAttribute('data-demonstration'), 10)
    //     });
    // },

    // onOverviewCreateDemonstrationClick: function(overviewWindow, student, competency) {
    //     this.showDemonstrationEditWindow({
    //         defaultStudent: student,
    //         defaultCompetency: competency
    //     });
    // },

    // onOverviewEditDemonstrationClick: function(overviewWindow, demonstrationId) {
    //     var me = this,
    //         editWindow = me.showDemonstrationEditWindow({
    //             title: 'Edit demonstration #' + demonstrationId
    //         });

    //     editWindow.setLoading('Loading demonstration #' + demonstrationId + '&hellip;');
    //     Slate.cbl.model.Demonstration.load(demonstrationId, {
    //         params: {
    //             include: 'Skills.Skill'
    //         },
    //         success: function(demonstration) {
    //             editWindow.setDemonstration(demonstration);
    //             editWindow.setLoading(false);
    //         }
    //     });
    // },

    // onOverviewDeleteDemonstrationClick: function(overviewWindow, demonstrationId) {
    //     overviewWindow.setLoading('Loading demonstration #' + demonstrationId + '&hellip;');

    //     Slate.cbl.model.Demonstration.load(demonstrationId, {
    //         params: {
    //             include: 'Skills.Skill'
    //         },
    //         success: function(demonstration) {
    //             Ext.Msg.confirm(
    //                 'Delete demonstration #' + demonstrationId,
    //                 'Are you sure you want to permenantly delete this demonstration?' +
    //                     ' Scores in all the following standards will be removed:' +
    //                     '<ul>' +
    //                         '<li>' +
    //                         Ext.Array.map(demonstration.get('Skills'), function(demoSkill) {
    //                             return '<strong>Level ' + demoSkill.DemonstratedLevel + '</strong> demonstrated in <strong>' + demoSkill.Skill.Code + '</strong>: <em>' + demoSkill.Skill.Statement + '</em>';
    //                         }).join('</li><li>') +
    //                         '</li>' +
    //                     '</ul>',
    //                 function(btnId) {
    //                     if (btnId != 'yes') {
    //                         overviewWindow.setLoading(false);
    //                         return;
    //                     }

    //                     demonstration.erase({
    //                         params: {
    //                             include: 'competencyCompletions'
    //                         },
    //                         success: function(demonstration, operation) {
    //                             Slate.API.fireEvent('demonstrationdelete', operation.getResultSet().getRecords()[0]);
    //                             overviewWindow.setLoading(false);
    //                         }
    //                     });
    //                 }
    //             );
    //         }
    //     });
    // },

    // onOverviewCreateOverrideClick: function(overviewWindow, studentId, standardId) {
    //     this.getOverrideWindowView().create({
    //         ownerCmp: this.getDashboardCt(),
    //         autoShow: true,

    //         student: studentId,
    //         standard: standardId
    //     });
    // },

    // onDemonstrationSave: function(demonstration) {
    //     this.getDashboardCt().progressGrid.loadDemonstration(demonstration);
    // },

    // onDemonstrationDelete: function(demonstration) {
    //     this.getDashboardCt().progressGrid.deleteDemonstration(demonstration);
    // },


    // // public methods
    // showDemonstrationEditWindow: function(options) {
    //     var dashboardCt = this.getDashboardCt();

    //     return this.getEditWindowView().create(Ext.apply({
    //         ownerCmp: dashboardCt,
    //         autoShow: true,

    //         studentsStore: dashboardCt.progressGrid.getStudentsStore()
    //     }, options));
    // },

    // syncFilters: function() {
    //     var me = this,
    //         token = Ext.util.History.getToken(),
    //         splitToken = [], i = 0,
    //         param, value,

    //         dashboardCt = me.getDashboardCt(),

    //         progressGrid = me.getStudentProgressGrid(),
    //         studentsStore = progressGrid.getStudentsStore(),
    //         studentGroupCombo = me.getStudentGroupSelector(),

    //         contentAreaCombo = me.getContentAreaSelector(),
    //         competenciesStore = progressGrid.getCompetenciesStore(),
    //         studentGroup, contentArea; // = studentGroupCombo.getSelection(),


    //     if (!dashboardCt.rendered) {
    //         return dashboardCt.on('render', function() {
    //             me.syncFilters();
    //         }, null, { single: true });
    //     }
    //     if (token) {
    //         splitToken = token.split('&');
    //         for (; i < splitToken.length; i++) {
    //             param = splitToken[i].split('=', 1)[0];
    //             value = splitToken[i].split('=', 2)[1];

    //             if (param == 'student-group') {
    //                 if (!studentGroupCombo.getStore().isLoaded()) {
    //                     dashboardCt.mask('Loading Content Areas&hellip;');
    //                     studentGroupCombo.getStore().load({
    //                         params: {
    //                             q: value
    //                         },
    //                         callback: function() {
    //                             dashboardCt.unmask();
    //                             return me.syncFilters();
    //                         }
    //                     });
    //                     return false;
    //                 }

    //                 studentGroup = studentGroupCombo.getStore().findRecord('Identifier', window.decodeURI(value));
    //                 studentGroupCombo.setValue(studentGroup);
    //                 if (studentGroup) {
    //                     Slate.API.request({
    //                         url: '/cbl/dashboards/demonstrations/teacher/*students',
    //                         params: {
    //                             students: studentGroup.getIdentifier()
    //                         },
    //                         success: function(response) {
    //                             var data = response.data || Ext.decode(response.responseText),
    //                                 students = data.data || [];

    //                             studentsStore.loadRecords(Ext.Array.map(students, function(s) {
    //                                 return studentsStore.getSession().peekRecord(studentsStore.model, s.ID) || studentsStore.createModel(s);
    //                             }), { addRecords: false });
    //                         }
    //                     });
    //                 }
    //             } else if (param == 'contentarea') {
    //                 if (!contentAreaCombo.getStore().isLoaded()) {
    //                     dashboardCt.mask('Loading Content Areas&hellip;');
    //                     contentAreaCombo.getStore().load(function() {
    //                         dashboardCt.unmask();
    //                         return me.syncFilters();
    //                     });
    //                     return false;
    //                 }

    //                 contentArea = contentAreaCombo.getStore().findRecord('Code', window.decodeURI(value));
    //                 contentAreaCombo.setValue(contentArea);

    //                 if (contentArea) {
    //                     me.getDashboardCt().setContentArea(contentArea);
    //                     competenciesStore.getAllByContentArea(contentArea, function(competencies) {
    //                         competenciesStore.loadRecords(competencies.getRange(), { addRecords: false });
    //                     });
    //                 }
    //             }
    //         }
    //     }
    // }
});