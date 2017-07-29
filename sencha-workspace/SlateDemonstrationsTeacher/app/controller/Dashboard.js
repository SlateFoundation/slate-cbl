/**
 * TODO:
 * - move rendering responsibilities to the view?
 */
Ext.define('SlateDemonstrationsTeacher.controller.Dashboard', {
    extend: 'Ext.app.Controller',
    requires: [
        'Jarvus.util.APIDomain',

        'Slate.API',

        'Ext.window.MessageBox'
    ],


    // entry points
    listen: {
        api: {
            demonstrationsave: 'onDemonstrationSave',
            demonstrationdelete: 'onDemonstrationDelete'
        }
    },

    control: {
        studentProgressGrid: {
            competencyrowclick: 'onCompetencyRowClick',
            democellclick: 'onDemoCellClick'
        },
        'slate-demonstrations-teacher-skill-overviewwindow': {
            createdemonstrationclick: 'onOverviewCreateDemonstrationClick',
            editdemonstrationclick: 'onOverviewEditDemonstrationClick',
            deletedemonstrationclick: 'onOverviewDeleteDemonstrationClick',
            createoverrideclick: 'onOverviewCreateOverrideClick'
        },
        studentGroupSelector: {
            select: 'onStudentsGroupSelect'
        },
        'slate-demonstrations-teacher-appheader combo#contentAreaSelect': {
            select: 'onContentAreaSelect'
        },
        'slate-demonstrations-teacher-appheader button[action=submitevidence]': {
            click: 'onSubmitEvidenceClick'
        }
    },


    // controller configuration
    views: [
        'Dashboard',
        'OverviewWindow',
        'OverrideWindow',
        'EditWindow'
    ],

    models: [
        'Demonstration@Slate.cbl.model'
    ],

    stores: [
        'ContentAreas',
        'CourseSections',
        'Groups',
        'StudentGroups'
    ],

    refs: {
        dashboardCt: {
            selector: 'slate-demonstrations-teacher-dashboard',
            autoCreate: true,

            xtype: 'slate-demonstrations-teacher-dashboard'
        },
        studentProgressGrid: 'slate-demonstrations-teacher-dashboard slate-demonstrations-teacher-studentsprogressgrid',
        appHeader: 'slate-demonstrations-teacher-appheader',
        studentGroupSelector: 'slate-demonstrations-teacher-appheader slate-demonstrations-teacher-studentgroupselector',
        contentAreaSelector: 'slate-demonstrations-teacher-appheader #contentAreaSelect'
    },

    routes: {
        ':queryString': {
            action: 'syncFilters',
            conditions: {
                ':queryString': '.*'
            }
        }
    },

    // controller templates method overrides
    onLaunch: function () {
        var me = this,
            dashboardCt = me.getDashboardCt(),
            studentGroupSelector = me.getStudentGroupSelector(),
            SiteEnvironment = window.SiteEnvironment;

        if (SiteEnvironment === undefined) {
            SiteEnvironment = window.SiteEnvironment = {};
        }

        // load bootstrap data
        Slate.API.request({
            url: '/cbl/dashboards/demonstrations/teacher/bootstrap',
            success: function(response) {
                var data = response.data || Ext.decode(response.responseText);

                if (data) {
                    if (data.experience_types) {
                        window.SiteEnvironment.cblExperienceTypeOptions = data.experience_types;
                    }

                    if (data.context_options) {
                        SiteEnvironment.cblContextOptions = data.context_options;
                    }

                    if (data.performance_types) {
                        SiteEnvironment.cblPerformanceTypeOptions = data.performance_types;
                    }

                    if (data.cblLevels) {
                        Slate.cbl.data.CBLLevels.loadRawData(data.cblLevels, false);
                    }
                }
            }
        });

        // load current user sections
        me.getCourseSectionsStore().load(function() {
            studentGroupSelector.getStore().loadData(Ext.Array.map(this.getRange(), function(cs) {
                return cs.data;
            }), true);
        });

        // load all groups
        me.getGroupsStore().load(function() {
            studentGroupSelector.getStore().loadData(Ext.Array.map(this.getRange(), function(g) {
                return g.data;
            }), true);
        });

        // handle any external "Log a Demonstartion" buttons
        Ext.getBody().on('click', function(ev) {
            ev.stopEvent();

            me.showDemonstrationEditWindow();
        }, me, { delegate: 'button[data-action="demonstration-create"]' });

        // render dashboard
        dashboardCt.render('slateapp-viewport');
    },


    // event handers


    onSubmitEvidenceClick: function() {
        this.showDemonstrationEditWindow();
    },

    onCompetencyRowClick: function(me, competency, ev, targetEl) {
        me.toggleCompetency(competency);
    },

    onDemoCellClick: function(progressGrid, ev, targetEl) {
        this.getOverviewWindowView().create({
            ownerCmp: this.getDashboardCt(),
            autoShow: true,
            animateTarget: targetEl,

            competency: parseInt(targetEl.up('.cbl-grid-skills-row').getAttribute('data-competency'), 10),
            studentsStore: progressGrid.getStudentsStore(),
            competenciesStore: progressGrid.getCompetenciesStore(),

            skill: parseInt(targetEl.up('.cbl-grid-skill-row').getAttribute('data-skill'), 10),
            student: parseInt(targetEl.up('.cbl-grid-demos-cell').getAttribute('data-student'), 10),
            selectedDemonstration: parseInt(targetEl.getAttribute('data-demonstration'), 10)
        });
    },

    onOverviewCreateDemonstrationClick: function(overviewWindow, student, competency) {
        this.showDemonstrationEditWindow({
            defaultStudent: student,
            defaultCompetency: competency
        });
    },

    onOverviewEditDemonstrationClick: function(overviewWindow, demonstrationId) {
        var me = this,
            editWindow = me.showDemonstrationEditWindow({
                title: 'Edit demonstration #' + demonstrationId
            });

        editWindow.setLoading('Loading demonstration #' + demonstrationId + '&hellip;');
        Slate.cbl.model.Demonstration.load(demonstrationId, {
            params: {
                include: 'Skills.Skill'
            },
            success: function(demonstration) {
                editWindow.setDemonstration(demonstration);
                editWindow.setLoading(false);
            }
        });
    },

    onOverviewDeleteDemonstrationClick: function(overviewWindow, demonstrationId) {
        overviewWindow.setLoading('Loading demonstration #' + demonstrationId + '&hellip;');

        Slate.cbl.model.Demonstration.load(demonstrationId, {
            params: {
                include: 'Skills.Skill'
            },
            success: function(demonstration) {
                Ext.Msg.confirm(
                    'Delete demonstration #' + demonstrationId,
                    'Are you sure you want to permenantly delete this demonstration?' +
                        ' Scores in all the following standards will be removed:' +
                        '<ul>' +
                            '<li>' +
                            Ext.Array.map(demonstration.get('Skills'), function(demoSkill) {
                                return '<strong>Level ' + demoSkill.DemonstratedLevel + '</strong> demonstrated in <strong>' + demoSkill.Skill.Code + '</strong>: <em>' + demoSkill.Skill.Statement + '</em>';
                            }).join('</li><li>') +
                            '</li>' +
                        '</ul>',
                    function(btnId) {
                        if (btnId != 'yes') {
                            overviewWindow.setLoading(false);
                            return;
                        }

                        demonstration.erase({
                            params: {
                                include: 'competencyCompletions'
                            },
                            success: function(demonstration, operation) {
                                Slate.API.fireEvent('demonstrationdelete', operation.getResultSet().getRecords()[0]);
                                overviewWindow.setLoading(false);
                            }
                        });
                    }
                );
            }
        });
    },

    onOverviewCreateOverrideClick: function(overviewWindow, studentId, standardId) {
        this.getOverrideWindowView().create({
            ownerCmp: this.getDashboardCt(),
            autoShow: true,

            student: studentId,
            standard: standardId
        });
    },

    onDemonstrationSave: function(demonstration) {
        this.getDashboardCt().progressGrid.loadDemonstration(demonstration);
    },

    onDemonstrationDelete: function(demonstration) {
        this.getDashboardCt().progressGrid.deleteDemonstration(demonstration);
    },


    // public methods
    showDemonstrationEditWindow: function(options) {
        var dashboardView = this.getDashboardCt();

        return this.getEditWindowView().create(Ext.apply({
            ownerCmp: dashboardView,
            autoShow: true,

            studentsStore: dashboardView.progressGrid.getStudentsStore()
        }, options));
    },

    syncFilters: function() {
        var me = this,
            token = Ext.util.History.getToken(),
            splitToken = [], i = 0,
            param, value,

            dashboardCt = me.getDashboardCt(),

            progressGrid = me.getStudentProgressGrid(),
            studentsStore = progressGrid.getStudentsStore(),
            studentGroupCombo = me.getStudentGroupSelector(),

            contentAreaCombo = me.getContentAreaSelector(),
            competenciesStore = progressGrid.getCompetenciesStore(),
            studentGroup, contentArea; // = studentGroupCombo.getSelection(),


        if (!dashboardCt.rendered) {
            return dashboardCt.on('render', function() {
                me.syncFilters();
            }, null, { single: true });
        }
        if (token) {
            splitToken = token.split('&');
            for (; i < splitToken.length; i++) {
                param = splitToken[i].split('=', 1)[0];
                value = splitToken[i].split('=', 2)[1];

                if (param == 'student-group') {
                    if (!studentGroupCombo.getStore().isLoaded()) {
                        dashboardCt.mask('Loading Content Areas&hellip;');
                        studentGroupCombo.getStore().load({
                            params: {
                                q: value
                            },
                            callback: function() {
                                dashboardCt.unmask();
                                return me.syncFilters();
                            }
                        });
                        return false;
                    }

                    studentGroup = studentGroupCombo.getStore().findRecord('Identifier', window.decodeURI(value));
                    studentGroupCombo.setValue(studentGroup);
                    if (studentGroup) {
                        Slate.API.request({
                            url: '/cbl/dashboards/demonstrations/teacher/*students',
                            params: {
                                students: studentGroup.getIdentifier()
                            },
                            success: function(response) {
                                var data = response.data || Ext.decode(response.responseText),
                                    students = data.data || [];

                                studentsStore.loadRecords(Ext.Array.map(students, function(s) {
                                    return studentsStore.getSession().peekRecord(studentsStore.model, s.ID) || studentsStore.createModel(s);
                                }), { addRecords: false });
                            }
                        });
                    }
                } else if (param == 'contentarea') {
                    if (!contentAreaCombo.getStore().isLoaded()) {
                        dashboardCt.mask('Loading Content Areas&hellip;');
                        contentAreaCombo.getStore().load(function() {
                            dashboardCt.unmask();
                            return me.syncFilters();
                        });
                        return;
                    }

                    contentArea = contentAreaCombo.getStore().findRecord('Code', value);
                    contentAreaCombo.setValue(contentArea);

                    if (contentArea) {
                        me.getDashboardCt().setContentArea(contentArea);
                        competenciesStore.getAllByContentArea(contentArea, function(competencies) {
                            competenciesStore.loadRecords(competencies.getRange(), { addRecords: false });
                        });
                    }
                }

            }
        }
    }
});