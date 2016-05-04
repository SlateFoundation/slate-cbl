/**
 * TODO:
 * - move rendering responsibilities to the view?
 */
Ext.define('SlateDemonstrationsTeacher.controller.DashboardController', {
    extend: 'Ext.app.Controller',
    alias: 'controller.slate-demonstrations-teacher-dashboard',
    requires: [
        'Jarvus.util.APIDomain',

        'Slate.API',

        'Slate.cbl.view.teacher.skill.OverviewWindow',
        'Slate.cbl.view.teacher.skill.OverrideWindow',
        'Slate.cbl.view.teacher.demonstration.EditWindow',
        
    ],
    
    refs: {
        dashboardCt: 'slate-demonstrations-teacher-dashboard',
        
        studentProgressGrid: 'slate-demonstrations-teacher-studentsprogressgrid',
        teacherOverviewwindow: 'slate-cbl-teacher-skill-overviewwindow'
    },


    config: {
        control: {
            studentProgressGrid: {
                democellclick: 'onDemoCellClick'
            },
            teacherOverviewwindow: {
                createdemonstrationclick: 'onOverviewCreateDemonstrationClick',
                editdemonstrationclick: 'onOverviewEditDemonstrationClick',
                deletedemonstrationclick: 'onOverviewDeleteDemonstrationClick',
                createoverrideclick: 'onOverviewCreateOverrideClick'
            }
        },

        listen: {
            api: {
                demonstrationsave: 'onDemonstrationSave',
                demonstrationdelete: 'onDemonstrationDelete'
            }
        }
    },


    // event handers
    onDemoCellClick: function(progressGrid, ev, targetEl) {
        Ext.create('Slate.cbl.view.teacher.skill.OverviewWindow', {
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
        Ext.create('Slate.cbl.view.teacher.skill.OverrideWindow', {
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

        return Ext.create('Slate.cbl.view.teacher.demonstration.EditWindow', Ext.apply({
            ownerCmp: dashboardView,
            autoShow: true,

            studentsStore: dashboardView.progressGrid.getStudentsStore()
        }, options));
    }
});