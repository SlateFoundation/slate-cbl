/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext,Slate*/
/**
 * TODO:
 * - move rendering responsibilities to the view?
 */
Ext.define('Slate.cbl.view.teacher.DashboardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-teacher-dashboard',
    requires: [
        'Slate.cbl.view.teacher.skill.OverviewWindow',
        'Slate.cbl.view.teacher.demonstration.EditWindow'
    ],


    config: {
        id: 'slate-cbl-teacher-dashboard', // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
        control: {
            'slate-cbl-teacher-studentsprogressgrid': {
                democellclick: 'onDemoCellClick'
            },
            'slate-cbl-teacher-skill-overviewwindow': {
                createdemonstrationclick: 'onOverviewCreateDemonstrationClick',
                editdemonstrationclick: 'onOverviewEditDemonstrationClick',
                deletedemonstrationclick: 'onOverviewDeleteDemonstrationClick'
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
            ownerCmp: this.getView(),
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
        var me = this;

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
                                Slate.cbl.API.fireEvent('demonstrationdelete', operation.getResultSet().getRecords()[0]);
                                overviewWindow.setLoading(false);
                            }
                        });
                    }
                );
            }
        });
    },

    onDemonstrationSave: function(demonstration) {
        this.getView().progressGrid.loadDemonstration(demonstration);
    },
    
    onDemonstrationDelete: function(demonstration) {
        this.getView().progressGrid.deleteDemonstration(demonstration);
    },


    // public methods
    showDemonstrationEditWindow: function(options) {
        var dashboardView = this.getView();

        return Ext.create('Slate.cbl.view.teacher.demonstration.EditWindow', Ext.apply({
            ownerCmp: dashboardView,
            autoShow: true,
            
            studentsStore: dashboardView.progressGrid.getStudentsStore()
        }, options));
    }
});