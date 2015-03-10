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
//                contentareachange: 'refresh',
//                progressrowclick: 'onProgressRowClick',
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


    //event handlers
    onComponentRender: function(dashboardView) {
        var me = this,
            siteEnv = window.SiteEnvironment || {},
            student = siteEnv.cblStudent && Ext.create('Slate.cbl.model.Student', siteEnv.cblStudent)
        studentDashboardCompetenciesList = dashboardView.el.down('#studentDashboardCompetenciesList'),
            contentArea = siteEnv.cblContentArea && Ext.create('Slate.cbl.model.ContentArea', siteEnv.cblContentArea),
            competenciesStore = Ext.getStore('cbl-competencies-loaded'),
            competenciesTpl = Ext.XTemplate.getTpl(me.view, 'competenciesTpl');

        if (!student || !contentArea) {
            return;
        }

        // empty competencies list
        studentDashboardCompetenciesList.empty();
        studentDashboardCompetenciesList.removeCls('competencies-unloaded').addCls('competencies-loading');

        contentArea.getCompetenciesForStudents([student.getId()], function(competencies) {
            var competenciesLength = competencies.length,
                competencyIndex = 0,
                competency, skillsList;


            if(!competenciesStore.isLoaded()) {
                competenciesStore.loadRawData(competencies);
            }

            competenciesTpl.overwrite(studentDashboardCompetenciesList, {
                student: student.getData(),
                competencies: competencies
            });

            studentDashboardCompetenciesList.removeCls('competencies-loading').addCls('competencies-loaded');

            for (; competencyIndex < competenciesLength; competencyIndex++) {
                competency = Ext.create('Slate.cbl.model.Competency', competencies[competencyIndex]);
                skillsList = studentDashboardCompetenciesList.down('.cbl-competency-panel[data-competency="'+competency.getId()+'"] .cbl-skill-meter');
                me.loadSkills(student, competency, skillsList);
            }
        });
    },

    onDemoCellClick: function(dashboardView, ev, targetEl) {
        // HACK: No idea how to get the demonstration set below into the OverviewBody xtemplate
        window.SiteEnvironment.clickedDemonstration = parseInt(targetEl.getAttribute('data-demonstration'), 10);
        
        Ext.create('Slate.cbl.view.student.skill.OverviewWindow', {
            autoShow: true,
            animateTarget: targetEl,

            student: window.SiteEnvironment.cblStudent.ID,
            competency: targetEl.up('ul.cbl-skill-demos').up('li.cbl-competency-panel').getAttribute('data-competency'),
            skill: targetEl.up('ul.cbl-skill-demos').getAttribute('data-skill'),
            demonstration: window.SiteEnvironment.clickedDemonstration /* HACK: FIXME: */
        });
    },
    
    // protected methods
    loadSkills: function(student, competency, skillsList) {
        var me = this,
            skillsTpl = Ext.XTemplate.getTpl(me.view, 'skillsTpl'),
            skills, demonstrations, _renderSkills;

        skillsList.removeCls('skills-unloaded').addCls('skills-loading');

        _renderSkills = function() {
            var demonstrationsLength = demonstrations.length, demonstrationIndex = 0, demonstration, skill;
            // group demonstrations by skill
            for (; demonstrationIndex < demonstrationsLength; demonstrationIndex++) {
                demonstration = demonstrations[demonstrationIndex];
                skill = skills.get(demonstration.SkillID);

                if (!skill.demonstrations) {
                    skill.demonstrations = [];
                }

                skill.demonstrations.push(demonstration);
            }


            skillsTpl.overwrite(skillsList, skills.items);
            skillsList.removeCls('skills-loading').addCls('skills-loaded');
        };

        competency.getDemonstrationsForStudents([student.getId()], function(loadedDemonstrations) {
            demonstrations = loadedDemonstrations;

            if (skills) {
                _renderSkills();
            }
        });


        competency.withSkills(function(loadedSkills) {
            skills = loadedSkills;



            if (demonstrations) {
                _renderSkills();
            }
        });
    }
});
