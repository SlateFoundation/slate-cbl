/*jslint browser: true, undef: true *//*global Ext*/
// @require-package slate-cbl
Ext.define('Site.page.StudentCompetencyDashboard', {
    singleton: true,
    requires: [
        'Site.Common',
        'Slate.cbl.model.Student',
        'Slate.cbl.model.ContentArea',
        'Slate.cbl.model.Competency',
        'Ext.XTemplate'
    ],

    competenciesTpl: [
        '<tpl for="competencies">',
            '{%var level = 9%}', // TODO: real level
            '{%var studentCompletion = values.studentCompletions[parent.student.ID] || {}%}',
            '{%var percent = Math.round(100 * (studentCompletion.demonstrationsCount || 0) / values.totalDemonstrationsRequired)%}',
            '{%var isAverageLow = studentCompletion.demonstrationsAverage < values.minimumAverage && percent >= 50%}',
            '<li class="panel cbl-competency-panel cbl-level-{[level]}" data-competency="{ID}">',
                '<header class="panel-header">',
                    '<h4 class="header-title">{Descriptor}</h4>',
                '</header>',
                
                '<div class="panel-body">',
                    '<div class="cbl-progress-meter {[isAverageLow ? "is-average-low" : ""]}">',
                        '<div class="cbl-progress-bar" style="width:{[percent]}%"></div>',
                        '<div class="cbl-progress-level">L{[level]}</div>',
                        '<div class="cbl-progress-percent">{[percent]}%</div>',
                        '<div class="cbl-progress-average">{[fm.number(studentCompletion.demonstrationsAverage, "0.##")]}</div>',
                    '</div>',

					'<div class="explainer">',
                        '<p>{Statement}</p>',
//						'<p>Here goes a sentence explaining that your average score of <strong>9.25</strong> is below the skill level needed to progress, <strong>10</strong>. This is a sentence describing what you can do to improve.</p>',
					'</div>',

                    '<ul class="cbl-skill-meter skills-unloaded"></ul>',
                '</div>',
            '</li>',
        '</tpl>'
    ],
    
    skillsTpl: [
        '<tpl for=".">',
            '<li class="cbl-skill">',
                '<h5 class="cbl-skill-name">{Descriptor}</h5>',
                '<ul class="cbl-skill-demos">',
                    '<tpl for="this.getDemonstrationBlocks(values)">',
                        '<li class="cbl-skill-demo" <tpl if="DemonstrationID">data-demonstration="{DemonstrationID}"</tpl>>',
                            '{Level:defaultValue("&nbsp;")}',
                        '</li>',
                    '</tpl>',
                '</ul>',
//                '<div class="cbl-skill-complete-indicator cbl-level-{parent.level} is-checked">',
//                    '<svg class="check-mark-image" width="16" height="16">',
//                        '<polygon class="check-mark" points="13.824,2.043 5.869,9.997 1.975,6.104 0,8.079 5.922,14.001 15.852,4.07"/>',
//                    '</svg>',
//                '</div>',
            '</li>',
        '</tpl>',
        {
            // TODO: deduplicate this and its copy from the teacher dashboard?
            getDemonstrationBlocks: function(skill) {
                var demonstrationsRequired = skill.DemonstrationsRequired,
                    blocks, blocksLength, blockIndex, lowestBlockIndex;


                // start with all demonstrations 1 level below the competency level or greater
                if (skill.demonstrations) {
                    blocks = Ext.Array.filter(skill.demonstrations, function(demonstration) {
                        return demonstration.Level >= 8; // TODO: retrieve the competency level dynamically rather than hard coding to 9
                    });
                } else {
                    blocks = [];
                }


                // trim lowest demonstrations
                while ((blocksLength = blocks.length) > demonstrationsRequired) {
                    for (blockIndex = 0, lowestBlockIndex = null; blockIndex < blocksLength; blockIndex++) {
                        if (lowestBlockIndex === null || blocks[blockIndex].Level < blocks[lowestBlockIndex].Level) {
                            lowestBlockIndex = blockIndex;
                        }
                    }

                    Ext.Array.splice(blocks, lowestBlockIndex, 1);
                }


                // add empty blocks
                while (blocks.length < demonstrationsRequired) {
                    blocks.push({});
                }


                return blocks;
            }
        }
    ],

    constructor: function() {
        Ext.onReady(this.onDocReady, this);
    },

    onDocReady: function() {
        var me = this,
            body = Ext.getBody(),
            studentDashboardCompetenciesList = body.down('#studentDashboardCompetenciesList'),
            siteEnv = window.SiteEnvironment || {},
            student = siteEnv.cblStudent && Ext.create('Slate.cbl.model.Student', siteEnv.cblStudent),
            contentArea = siteEnv.cblContentArea && Ext.create('Slate.cbl.model.ContentArea', siteEnv.cblContentArea),
            competenciesTpl = Ext.XTemplate.getTpl(me, 'competenciesTpl');

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
    
    loadSkills: function(student, competency, skillsList) {
        var me = this,
            skillsTpl = Ext.XTemplate.getTpl(me, 'skillsTpl'),
            skills, demonstrations, _renderSkills;

        skillsList.removeCls('skills-unloaded').addCls('skills-loading');

        _renderSkills = function() {
            var demonstrationsLength = demonstrations.length, demonstrationIndex = 0, demonstration, skill;

            // group skills by student
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