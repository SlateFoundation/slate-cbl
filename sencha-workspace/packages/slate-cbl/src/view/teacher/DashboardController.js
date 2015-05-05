/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext,Slate*/
/**
 * TODO:
 * - move rendering responsibilities to the view?
 */
Ext.define('Slate.cbl.view.teacher.DashboardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-teacher-dashboard',
    requires: [
        'Slate.cbl.API',
        'Slate.cbl.model.Student',
        'Slate.cbl.model.Competency',
        'Slate.cbl.model.Demonstration',
        'Slate.cbl.store.AllCompetencies',
        'Slate.cbl.view.teacher.demonstration.EditWindow',
        'Slate.cbl.view.teacher.skill.OverviewWindow',

        'Ext.util.Collection',
        'Ext.data.Store'
    ],

    config: {
        id: 'slate-cbl-teacher-dashboard', // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
        control: {
            '#': {
                contentareachange: 'refresh',
                progressrowclick: 'onProgressRowClick',
                democellclick: 'onDemoCellClick'
            }
        },

        listen: {
            store: {
                '#cbl-students-loaded': {
                    refresh: 'onStudentsRefresh'
                },
                '#cbl-competencies-loaded': {
                    refresh: 'onCompetenciesRefresh'
                }
            },
            api: {
                demonstrationsave: 'onDemonstrationSave'
            }
        }
    },


    // lifecycle overrides
    init: function() {
        Ext.create('Ext.data.Store', {
            storeId: 'cbl-students-loaded',
            model: 'Slate.cbl.model.Student',
            sorters: [{
                property: 'FullName',
                direction: 'ASC'
            }]
        });

        Ext.create('Ext.data.Store', {
            storeId: 'cbl-competencies-loaded',
            model: 'Slate.cbl.model.Competency'
        });

        Ext.create('Slate.cbl.store.AllCompetencies', {
            storeId: 'cbl-competencies-all'
        });
    },


    // event handers
    onStudentsRefresh: function () {
        this.getView().refreshDashboard();
    },

    onCompetenciesRefresh: function () {
        this.getView().refreshDashboard();
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
            loadedCompetency, loadedCompetencySkills, loadedSkill, demonstrationsByStudent, loadedDemonstrations, skillDemonstrationsCell, existingDemonstrationSkill,

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
            loadedCompetency = competenciesStore.getById(demonstratedSkill.CompetencyID);
            loadedCompetencySkills = loadedCompetency && loadedCompetency.get('skills');
            loadedSkill = loadedCompetencySkills && loadedCompetencySkills.getByKey(demonstratedSkill.SkillID);

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
            skillDemonstrationsCell = mainGridEl.down('.cbl-grid-skill-row[data-skill="'+loadedSkill.ID+'"] .cbl-grid-demos-cell[data-student="'+studentId+'"]', true);

            if (skillDemonstrationsCell) {
                updatesDemonstrations.push({
                    cellDom: skillDemonstrationsCell,
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
            updatesLength = updatesDemonstrations.length;
            updateIndex = 0;
            for (; updateIndex < updatesLength; updateIndex++) {
                update = updatesDemonstrations[updateIndex];
                demonstrationsTpl.overwrite(update.cellDom, update.values);
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

    /**
     * Attached via listeners config in view
     */
    onProgressRowClick: function(dashboardView, ev, targetEl) {
        dashboardView.expandCompetency(
            Ext.getStore('cbl-competencies-loaded').getById(
                targetEl.getAttribute('data-competency')
            )
        );
    },


    // public methods
    showDemonstrationEditWindow: function(options) {
        return Ext.create('Slate.cbl.view.teacher.demonstration.EditWindow', Ext.apply({
            autoShow: true
        }, options));
    }
});
