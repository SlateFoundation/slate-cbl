/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.view.student.DashboardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-student-dashboard',
    requires: [
        'Slate.cbl.model.Student',
        'Slate.cbl.model.Competency',
        'Slate.cbl.view.student.skill.OverviewWindow'
    ],

    config: {
        id: 'slate-cbl-student-dashboard', // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
        control: {
            '#': {
                democellclick: 'onDemoCellClick',
                render: 'onComponentRender'
            }
        }
    },

    // lifecycle overrides
    init: function() {
        var me = this;

        Ext.create('Ext.data.Store', {
            storeId: 'cbl-competencies-loaded',
            model: 'Slate.cbl.model.Competency'
        });
    },


    // event handlers
    onComponentRender: function(dashboardView) {
        var me = this,
            /* HACK: what's the right way to get the recent progress... also why do we use down with an id above? */
            studentDashboardRecentProgress = Ext.get('studentDashboardRecentProgress'), // todo: move this to Site.page.Student script
            student = dashboardView.getStudent(),
            studentId = student && student.getId(),
            contentArea = dashboardView.getContentArea(),
            recentProgressTpl = Ext.XTemplate.getTpl(me.view, 'recentProgressTpl');

        if (!studentId || !contentArea) {
            return;
        }

        // TODO: recent progress should be its own component
        Slate.cbl.API.getRecentProgress(studentId, contentArea.get('Code'), function(progress) {
            progress = Ext.isArray(progress) ? progress : [];
            
            recentProgressTpl.overwrite(studentDashboardRecentProgress, {
                progress: progress
            });
        });

        dashboardView.setCompetenciesStatus('loading');

        contentArea.getCompetenciesForStudents([studentId], function(competencies) {
            var competenciesStore = Ext.getStore('cbl-competencies-loaded'),
                competenciesLength = competencies.length,
                competencyIndex = 0,
                competency, skillsList;

            competenciesStore.loadRawData(competencies);

            dashboardView.add(Ext.Array.map(competenciesStore.getRange(), function(competency) {
                return {
                    studentId: studentId,
                    competency: competency,
                    autoEl: 'li'
                };
            }));

            dashboardView.setCompetenciesStatus('loaded');
        });
    },

    onDemoCellClick: function(dashboardView, ev, targetEl) {
        Ext.create('Slate.cbl.view.student.skill.OverviewWindow', {
            autoShow: true,
            animateTarget: targetEl,

            competency: parseInt(targetEl.up('ul.cbl-skill-demos').up('li.cbl-competency-panel').getAttribute('data-competency'), 10),
            skill: parseInt(targetEl.up('ul.cbl-skill-demos').getAttribute('data-skill'), 10),
            student: dashboardView.getStudent().getId(),
            selectedDemonstration: parseInt(targetEl.getAttribute('data-demonstration'), 10)
        });
    }
});
