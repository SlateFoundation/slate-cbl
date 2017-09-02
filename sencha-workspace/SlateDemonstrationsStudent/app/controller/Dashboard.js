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
        'Dashboard',
        'ContentAreaStatus',
        'RecentProgress',
        'OverviewWindow'
    ],


    refs: {
        dashboardCt: {
            selector: 'slate-demonstrations-student-dashboard',
            autoCreate: true,

            xtype: 'slate-demonstrations-student-dashboard'
        },
        contentAreaStatusCmp: {
            selector: 'slate-demonstrations-student-contentareastatus',
            autoCreate: true,

            xtype: 'slate-demonstrations-student-contentareastatus'
        },
        recentProgressCmp: {
            selector: 'slate-demonstrations-student-recentprogress',
            autoCreate: true,

            xtype: 'slate-demonstrations-student-recentprogress'
        },
        competencyCard: 'slate-demonstrations-student-competencycard'
    },


    // controller templates method overrides
    onLaunch: function () {
        var siteEnv = window.SiteEnvironment || {},
            cblStudentId = (siteEnv.cblStudent || {}).ID,
            cblContentArea = siteEnv.cblContentArea || {},
            dashboardCt, contentAreaStatusCmp, recentProgressCmp;

        // fetch component instances
        dashboardCt = this.getDashboardCt();
        contentAreaStatusCmp = this.getContentAreaStatusCmp();
        recentProgressCmp = this.getRecentProgressCmp();

        // configure recent progress component with any available embedded data
        if (cblStudentId) {
            recentProgressCmp.setStudentId(cblStudentId);
        }

        if (cblContentArea) {
            recentProgressCmp.setContentAreaId(cblContentArea.ID);
        }

        // configure dashboard with any available embedded data
        if (cblStudentId) {
            dashboardCt.setStudentId(cblStudentId);
        }

        if (siteEnv.cblCompetencies) {
            dashboardCt.getCompetenciesStore().loadData(siteEnv.cblCompetencies);
        }

        // render components
        Ext.suspendLayouts();
        contentAreaStatusCmp.render('slateapp-viewport');
        recentProgressCmp.render('slateapp-viewport');
        dashboardCt.render('slateapp-viewport');
        Ext.resumeLayouts(true);
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
