Ext.define('SlateDemonstrationsStudent.controller.Dashboard', {
    extend: 'Ext.app.Controller',


    // entry points
    control: {
        dashboardCt: {
            render: 'onDashboardCtRender'
        },
        competencyCard: {
            democellclick: 'onDemoCellClick'
        }
    },


   // controller configuration
    views: [
        'OverviewWindow'
    ],

    refs: {
        dashboardCt: 'slate-demonstrations-student-dashboard',
        competencyCard: 'slate-demonstrations-student-competencycard'
    },


    // event handlers
    onDashboardCtRender: function(dashboardCt) {
        var studentId = dashboardCt.getStudentId(),
            competenciesStore = dashboardCt.getCompetenciesStore();

        if (!studentId || !competenciesStore.isLoaded()) { // TODO: check if competencies store is loaded instead
            return;
        }

        dashboardCt.setCompetenciesStatus('loading');

        dashboardCt.getCompletionsStore().loadByStudentsAndCompetencies(studentId, competenciesStore.collect('ID'), {
            callback: function(completions) {
                dashboardCt.add(Ext.Array.map(completions, function(completion) {
                    return {
                        competency: competenciesStore.getById(completion.get('CompetencyID')),
                        completion: completion,
                        autoEl: 'li'
                    };
                }));

                dashboardCt.setCompetenciesStatus('loaded');
            }
        });
    },

    onDemoCellClick: function(competencyCard, ev, targetEl) {
        this.getOverviewWindowView().create({
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
