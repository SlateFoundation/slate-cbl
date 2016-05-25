Ext.define('SlateDemonstrationsStudent.controller.Dashboard', {
    extend: 'Ext.app.Controller',
    requires: [
    ],
 
 
    config: {        
    },
    
    
    // entry points
    control: {
        dashboardCt: {
            render: 'onComponentRender'
        },
        competencyCard: {
            democellclick: 'onDemoCellClick',
        }
    },
   
   
   // controller configuration
    views: [
        'SlateDemonstrationsStudent.view.CompetencyCard',
        'Slate.cbl.view.student.skill.OverviewWindow'        
    ],
    
    refs: {
        dashboardCt: 'slate-demonstrations-student-dashboard',
        competencyCard: 'slate-demonstrations-student-competencycard'
    },

    
    // event handlers
    onComponentRender: function(dashboardView) {
        var studentId = dashboardView.getStudentId(),
            competenciesStore = dashboardView.getCompetenciesStore();

        if (!studentId || !competenciesStore.isLoaded()) { // TODO: check if competencies store is loaded instead
            return;
        }

        dashboardView.setCompetenciesStatus('loading');

        dashboardView.getCompletionsStore().loadByStudentsAndCompetencies(studentId, competenciesStore.collect('ID'), {
            callback: function(completions) {
                dashboardView.add(Ext.Array.map(completions, function(completion) {
                    return {
                        competency: competenciesStore.getById(completion.get('CompetencyID')),
                        completion: completion,
                        autoEl: 'li'
                    };
                }));

                dashboardView.setCompetenciesStatus('loaded');
            }
        });
    },

    onDemoCellClick: function(competencyCard, ev, targetEl) {
        Ext.create('Slate.cbl.view.student.skill.OverviewWindow', {
            ownerCmp: this.getDashboardCt(),
            autoShow: true,
            animateTarget: targetEl,

            competency: parseInt(targetEl.up('ul.cbl-skill-demos').up('li.cbl-competency-panel').getAttribute('data-competency'), 10),
            skill: parseInt(targetEl.up('ul.cbl-skill-demos').getAttribute('data-skill'), 10),
            student: this.getDashboardCt().getStudentId(),
            selectedDemonstration: parseInt(targetEl.getAttribute('data-demonstration'), 10)
        });
    }
});
