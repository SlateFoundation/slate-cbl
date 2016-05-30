Ext.define('SlateDemonstrationsStudent.view.DashboardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-demonstrations-student-dashboardcontroller',
    requires: [
        'SlateDemonstrationsStudent.view.OverviewWindow'
    ],

    config: {
        id: 'slate-cbl-student-dashboard', // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
        control: {
            '#': {
                render: 'onComponentRender'
            },
            'slate-demonstrations-student-competencycard': {
                democellclick: 'onDemoCellClick'
            }
        }
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
        Ext.create('SlateDemonstrationsStudent.view.OverviewWindow', {
            ownerCmp: this.getView(),
            autoShow: true,
            animateTarget: targetEl,

            competency: parseInt(targetEl.up('ul.cbl-skill-demos').up('li.cbl-competency-panel').getAttribute('data-competency'), 10),
            skill: parseInt(targetEl.up('ul.cbl-skill-demos').getAttribute('data-skill'), 10),
            student: this.getView().getStudentId(),
            selectedDemonstration: parseInt(targetEl.getAttribute('data-demonstration'), 10)
        });
    }
});
