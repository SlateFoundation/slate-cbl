/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext,Slate*/
/**
 * TODO:
 * - move rendering responsibilities to the view?
 */
Ext.define('Slate.cbl.view.teacher.DashboardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-teacher-dashboard',
    requires: [
        'Slate.cbl.view.teacher.demonstration.EditWindow',
        'Slate.cbl.view.teacher.skill.OverviewWindow',

        'Slate.cbl.API',
        'Slate.cbl.store.Students',
        'Slate.cbl.store.Competencies',
        'Slate.cbl.model.Demonstration'
    ],

    config: {
        id: 'slate-cbl-teacher-dashboard', // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
        control: {
            '#': {
                contentareachange: 'refresh',
                democellclick: 'onDemoCellClick'
            }
        },

        listen: {
            store: {
                '#cbl-students': {
                    refresh: 'onStudentsRefresh'
                },
                '#cbl-competencies': {
                    refresh: 'onCompetenciesRefresh'
                }
            },
            api: {
                demonstrationsave: 'onDemonstrationSave'
            }
        }
    },


    // event handers
    onStudentsRefresh: function () {
        this.refreshDashboard();
    },

    onCompetenciesRefresh: function () {
        this.refreshDashboard();
    },

    onDemoCellClick: function(dashboardView, ev, targetEl) {
        Ext.create('Slate.cbl.view.teacher.skill.OverviewWindow', {
            autoShow: true,
            animateTarget: targetEl,

            competency: parseInt(targetEl.up('.cbl-grid-skills-row').getAttribute('data-competency'), 10),

            skill: parseInt(targetEl.up('.cbl-grid-skill-row').getAttribute('data-skill'), 10),
            student: parseInt(targetEl.up('.cbl-grid-demos-cell').getAttribute('data-student'), 10),
            selectedDemonstration: parseInt(targetEl.getAttribute('data-demonstration'), 10),

            listeners: {
                scope: this,
                createdemonstrationclick: 'onOverviewCreateDemonstrationClick',
                editdemonstrationclick: 'onOverviewEditDemonstrationClick'
            }
        });
    },

    onOverviewCreateDemonstrationClick: function(overviewWindow, student, competency) {
        Ext.suspendLayouts();

        var editWindow = this.showDemonstrationEditWindow();
        editWindow.down('field[name=StudentID]').setValue(student);
        editWindow.getController().addCompetency(competency);

        Ext.resumeLayouts(true);
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

    onDemonstrationSave: function(demonstration) {
        var me = this,
            dashboardView = me.view,
            demonstrationsTpl = dashboardView.getTpl('demonstrationsTpl'),
            mainGridEl = dashboardView.el.down('.cbl-grid-main'),
            studentId = demonstration.get('StudentID'),
            competenciesStore = Ext.getStore('cbl-competencies-loaded'),

            demonstratedSkills = demonstration.get('Skills'),
            demonstratedSkillsLength = demonstratedSkills.length, demonstratedSkillIndex = 0, demonstratedSkill,
            loadedCompetency, loadedSkill, demonstrationsByStudent, loadedDemonstrations, skillDemonstrationsList, existingDemonstrationSkill,

            competencyCompletions = demonstration.get('competencyCompletions'),
            competencyCompletionsLength = competencyCompletions.length, competencyCompletionIndex = 0, competencyCompletion,
            competencyProgressCell, competencyPercent,

            updatesDemonstrations = [],
            updatesCompetencies = [],
            updatesLength, updateIndex, update;


        // compile operations and DOM references for needed updates -- don't write to dom!
        for (; demonstratedSkillIndex < demonstratedSkillsLength; demonstratedSkillIndex++) {
            demonstratedSkill = demonstratedSkills[demonstratedSkillIndex];

            // update in-memory skills
            loadedSkill = Slate.cbl.model.Skill.globalStore.getById(demonstratedSkill.SkillID);

            // if the skill hasn't been loaded here yet, it hasn't been rendered yet either -- no updates are needed
            if (!loadedSkill) {
                continue;
            }

            demonstrationsByStudent = loadedSkill.demonstrationsByStudent || (loadedSkill.demonstrationsByStudent = {});
            loadedDemonstrations = studentId in demonstrationsByStudent ? demonstrationsByStudent[studentId] : demonstrationsByStudent[studentId] = [];

            // check if this is an update to an existing demonstration
            existingDemonstrationSkill = Ext.Array.findBy(loadedDemonstrations, function(loadedSkillDemonstration) {
                return loadedSkillDemonstration.DemonstrationID == demonstration.getId();
            });

            if (existingDemonstrationSkill) {
                existingDemonstrationSkill.DemonstratedLevel = demonstratedSkill.DemonstratedLevel;
            } else {
                loadedDemonstrations.push({
                    DemonstrationID: demonstration.getId(),
                    DemonstratedLevel: demonstratedSkill.DemonstratedLevel,
                    SkillID: demonstratedSkill.SkillID,
                    StudentID: studentId
                });
            }


            // update rendered demonstrations
            skillDemonstrationsList = mainGridEl.down('.cbl-grid-skill-row[data-skill="'+loadedSkill.getId()+'"] .cbl-grid-demos-cell[data-student="'+studentId+'"] ul', true);

            if (skillDemonstrationsList) {
                updatesDemonstrations.push({
                    listDom: skillDemonstrationsList,
                    values: {
                        skill: loadedSkill,
                        studentId: studentId
                    }
                });
            }
        }

        for (; competencyCompletionIndex < competencyCompletionsLength; competencyCompletionIndex++) {
            competencyCompletion = competencyCompletions[competencyCompletionIndex];
            competencyProgressCell = mainGridEl.down('.cbl-grid-progress-row[data-competency="'+competencyCompletion.CompetencyID+'"] .cbl-grid-progress-cell[data-student="'+studentId+'"]', true);
            loadedCompetency = competenciesStore.getById(competencyCompletion.CompetencyID);

            if (!competencyProgressCell || !loadedCompetency) {
                continue;
            }

            competencyPercent = Math.round(100 * (competencyCompletion.demonstrationsCount || 0) / loadedCompetency.get('totalDemonstrationsRequired'));

            updatesCompetencies.push({
                percent: competencyPercent,
                average: competencyCompletion.demonstrationsAverage || 0,
                isAverageLow: competencyCompletion.demonstrationsAverage < loadedCompetency.get('minimumAverage') && competencyPercent >= 50,
                cellDom: competencyProgressCell,
                textDom: Ext.fly(competencyProgressCell).down('.cbl-grid-progress-percent', true),
                barDom: Ext.fly(competencyProgressCell).down('.cbl-grid-progress-bar', true),
                averageDom: Ext.fly(competencyProgressCell).down('.cbl-grid-progress-average', true)
            });
        }

        // apply DOM writes for all updates in batch
        Ext.Function.requestAnimationFrame(function() {
            debugger;
            updatesLength = updatesDemonstrations.length;
            updateIndex = 0;
            for (; updateIndex < updatesLength; updateIndex++) {
                update = updatesDemonstrations[updateIndex];
                demonstrationsTpl.overwrite(update.listDom, update.values);
            }

            Ext.Function.requestAnimationFrame(function() {
                updatesLength = updatesCompetencies.length;
                updateIndex = 0;
                for (; updateIndex < updatesLength; updateIndex++) {
                    update = updatesCompetencies[updateIndex];

                    Ext.fly(update.textDom).update(update.percent+'%');
                    Ext.fly(update.barDom).setWidth(update.percent+'%');
                    Ext.fly(update.averageDom).update(Ext.util.Format.number(update.average, '0.##'));
                    Ext.fly(update.cellDom).toggleCls('is-average-low', update.isAverageLow);
                }
            });
        });
    },


    // public methods
    showDemonstrationEditWindow: function(options) {
        return Ext.create('Slate.cbl.view.teacher.demonstration.EditWindow', Ext.apply({
            autoShow: true
        }, options));
    },

    refreshDashboard: function() {
        var me = this,
            dashboardView = me.getView(),
            contentArea = dashboardView.getContentArea(),
            studentsStore = Slate.cbl.store.Students,
            competenciesStore = Slate.cbl.store.Competencies,

            syncCompetencyRowHeights = function() {
                dashboardView.syncRowHeights(
                    dashboardView.el.select('.cbl-grid-competencies thead tr, .cbl-grid-competencies .cbl-grid-progress-row'),
                    dashboardView.el.select('.cbl-grid-main thead tr, .cbl-grid-main .cbl-grid-progress-row')
                );
            };

        if (!studentsStore.isLoaded() || !contentArea) {
            return;
        }
        
        // TODO: load student completions too from teacher dashboard - studentsStore.collect('ID')

        if (!competenciesStore.isLoaded()) {
            competenciesStore.getAllByContentArea(contentArea);
            return;
        }
// TODO: move this ish to the view
        Ext.suspendLayouts();

        dashboardView.update(me.buildDashboardData());

        if (dashboardView.rendered) {
            syncCompetencyRowHeights();
        } else {
            dashboardView.on('render', syncCompetencyRowHeights, dashboardView, { single: true });
        }

        Ext.resumeLayouts(true);
    },

    buildDashboardData: function() {
        var me = this,
            contentArea = me.getView().getContentArea(),
            competenciesStore = Slate.cbl.store.Competencies,
            competenciesData = Ext.pluck(competenciesStore.getRange(), 'data'),
            competenciesLength = competenciesData.length, competencyIndex, competency, competencyStudents,
            studentsStore = Slate.cbl.store.Students,
            studentsData = Ext.pluck(studentsStore.getRange(), 'data'),
            studentsLength = studentsData.length, studentIndex, student,
            completion, percentComplete, demonstrationsAverage;


        // build aligned students array for each competency
        for (competencyIndex = 0; competencyIndex < competenciesLength; competencyIndex++) {
            competency = competenciesData[competencyIndex];
            competencyStudents = competency.students = [];

            for (studentIndex = 0; studentIndex < studentsLength; studentIndex++) {
                student = studentsData[studentIndex];
                completion = competency.studentCompletions[student.ID] || {};
                percentComplete = Math.round(100 * (completion.demonstrationsCount || 0) / competency.totalDemonstrationsRequired);
                demonstrationsAverage = completion.demonstrationsAverage;

                competencyStudents.push({
                    student: student,
                    level: completion.currentLevel,
                    percentComplete: percentComplete,
                    demonstrationsAverage: demonstrationsAverage,
                    isAverageLow: percentComplete >= 50 && demonstrationsAverage < competency.minimumAverage
                });
            }
        }


        return {
            contentArea: contentArea.getData(),
            students: studentsData,
            competencies: competenciesData
        };
    },
    
    refreshCompetency: function(competency) {
        var me = this,
            rowEls = me.getRowElsForCompetency(competency),
            headersRowEl = rowEls.headers,
            studentsRowEl = rowEls.students;

        competency.set('skillsRendered', true);

        // render details tables
        me.getTpl('skillHeadersTpl').overwrite(headersRowEl.down('tbody'), Ext.pluck(competency.skills.items, 'data'));
        me.getTpl('skillStudentsTpl').overwrite(studentsRowEl.down('tbody'), me.buildCompetencyData(competency));

        me.syncRowHeights(
            headersRowEl.select('tr'),
            studentsRowEl.select('tr')
        );
    },

    // TODO: don't modify or return models
    buildCompetencyData: function(competency) {
        var competenciesStore = Ext.getStore('cbl-competencies-loaded'),
            skillsCollection = competency.skills,
            skillsLength = skillsCollection.getCount(), skillIndex, skill,
            skillCompetencyCompletions, demonstrationsRequired, skillStudents,
            studentsStore = Ext.getStore('cbl-students-loaded'),
            studentsData = Ext.pluck(studentsStore.getRange(), 'data'),
            studentsLength = studentsStore.getCount(), studentIndex, student,
            demonstrations = competency.get('demonstrations'),
            demonstrationsLength = demonstrations.length, demonstrationIndex = 0, demonstration,
            skillId, studentId,
            demonstrationsBySkillStudent = {}, skillDemonstrationsByStudent, skillStudentDemonstrations,
            skillsData = [];


        // group demonstrations by skill and student
        for (; demonstrationIndex < demonstrationsLength; demonstrationIndex++) {
            demonstration = demonstrations[demonstrationIndex];
            skillId = demonstration.SkillID;
            studentId = demonstration.StudentID;

            skillDemonstrationsByStudent = demonstrationsBySkillStudent[skillId] || (demonstrationsBySkillStudent[skillId] = {});
            skillStudentDemonstrations = skillDemonstrationsByStudent[studentId] || (skillDemonstrationsByStudent[studentId] = []);

            skillStudentDemonstrations.push(demonstration);
        }


        // build aligned students array with embedded demonstrations list for each skill+student
        for (skillIndex = 0; skillIndex < skillsLength; skillIndex++) {
            skill = Ext.applyIf({
                students: skillStudents = []
            }, skillsCollection.getAt(skillIndex).getData());

            skillCompetencyCompletions = competenciesStore.getById(skill.CompetencyID).get('studentCompletions') || {};
            demonstrationsRequired = skill.DemonstrationsRequired;
            skillDemonstrationsByStudent = demonstrationsBySkillStudent[skill.ID] || {};

            for (studentIndex = 0; studentIndex < studentsLength; studentIndex++) {
                student = studentsData[studentIndex];
                studentId = student.ID;
                skillStudentDemonstrations = skillDemonstrationsByStudent[studentId] || [];

                skillStudentDemonstrations = Slate.cbl.util.CBL.sortDemonstrations(skillStudentDemonstrations, demonstrationsRequired);
                Slate.cbl.util.CBL.padArray(skillStudentDemonstrations, demonstrationsRequired);

                skillStudents.push({
                    student: student,
                    level: (skillCompetencyCompletions[studentId] || {}).currentLevel || null,
                    demonstrations: skillStudentDemonstrations
                });
            }

            skillsData.push(skill);
        }


        return skillsData;
    }
});
