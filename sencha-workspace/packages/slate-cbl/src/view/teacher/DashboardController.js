/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.view.teacher.DashboardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-teacher-dashboard',
    requires: [
//        'Slate.cbl.view.teacher.DummyData',
        'Slate.cbl.API',
        'Slate.cbl.model.Student',
        'Slate.cbl.model.Competency',
        'Slate.cbl.view.teacher.demonstration.CreateWindow',
        'Slate.cbl.view.teacher.skill.OverviewWindow',
        
        'Ext.util.Collection',
        'Ext.data.Store',
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
                '#cbl-students': {
                    refresh: 'refresh'
                },
                '#cbl-competencies': {
                    refresh: 'refresh'
                }
            },
            api: {
                demonstrationcreate: 'onDemonstrationCreate'
            }
        }
    },


    // lifecycle overrides
    init: function() {
        var me = this;

        Ext.create('Ext.data.Store', {
            storeId: 'cbl-students',
            model: 'Slate.cbl.model.Student'
        });
    
        Ext.create('Ext.data.Store', {
            storeId: 'cbl-competencies',
            model: 'Slate.cbl.model.Competency'
        });
    },


    // event handers
    onDemoCellClick: function(dashboardView, ev, targetEl) {
        var me = this,
            overviewWindow;

        overviewWindow = Ext.create('Slate.cbl.view.teacher.skill.OverviewWindow', {
            autoShow: true,
            animateTarget: targetEl,

            student: targetEl.getAttribute('data-student'),
            competency: targetEl.up('.cbl-grid-skills-row').getAttribute('data-competency'),
            skill: targetEl.up('.cbl-grid-skill-row').getAttribute('data-skill'),

            listeners: {
                'createdemonstrationclick': function() {
                    Ext.suspendLayouts();

                    var createWindow = me.showCreateDemonstration();
                    createWindow.down('field[name=StudentID]').setValue(overviewWindow.getStudent().getId());
                    createWindow.getController().addCompetency(overviewWindow.getCompetency());
                    
                    Ext.resumeLayouts(true);
                }
            }
        });
    },

    onDemonstrationCreate: function(demonstration) {
        var me = this,
            mainGridEl = me.view.el.down('.cbl-grid-main'),
            studentId = demonstration.get('StudentID'),
            completion = demonstration.get('completion'),

            skills = completion && completion.skills,
            skillsLength = skills.length, skillIndex = 0, skill,
            skillDemonstrationsCell, skillDemonstrationBoxes, skillDemonstrationBoxesLength, skillDemonstrationBoxIndex, skillDemonstrationBox,

            competencies = completion && completion.competencies,
            competenciesLength = competencies.length, competencyIndex = 0, competency,
            competencyPercent, competencyProgressCell,

            updatesAddSkillComplete = [],
            updatesSetPercent = [],
            updatesLength, updateIndex, update;

        // compile operations and DOM references for needed updates -- don't write to dom!
        for (; skillIndex < skillsLength; skillIndex++) {
            skill = skills[skillIndex];
            skillDemonstrationsCell = mainGridEl.down('.cbl-grid-skill-row[data-skill="'+skill.ID+'"] .cbl-grid-demos-cell[data-student="'+studentId+'"]', true);

            if (!skillDemonstrationsCell) {
                continue;
            }

            skillDemonstrationBoxes = Ext.fly(skillDemonstrationsCell).query('.cbl-grid-demo');
            skillDemonstrationBoxesLength = Math.min(skillDemonstrationBoxes.length, skill.complete);
            skillDemonstrationBoxIndex = 0;

            for (; skillDemonstrationBoxIndex < skillDemonstrationBoxesLength; skillDemonstrationBoxIndex++) {
                skillDemonstrationBox = skillDemonstrationBoxes[skillDemonstrationBoxIndex];
                if (!Ext.fly(skillDemonstrationBox).hasCls('is-complete')) {
                    updatesAddSkillComplete.push(skillDemonstrationBox);
                }
            }
        }

        for (; competencyIndex < competenciesLength; competencyIndex++) {
            competency = competencies[competencyIndex];
            competencyProgressCell = mainGridEl.down('.cbl-grid-progress-row[data-competency="'+competency.ID+'"] .cbl-grid-progress-cell[data-student="'+studentId+'"]', true);
            
            if (!competencyProgressCell) {
                continue;
            }

            if (competency.complete && competency.needed) {
                competencyPercent = Math.round(100 * competency.complete / competency.needed);
            } else {
                competencyPercent = 0;
            }

            updatesSetPercent.push({
                percent: competencyPercent,
                textDom: Ext.fly(competencyProgressCell).down('.cbl-grid-progress-percent', true),
                barDom: Ext.fly(competencyProgressCell).down('.cbl-grid-progress-bar', true)
            });
        }

        // apply DOM writes for all updates in batch
        Ext.Function.requestAnimationFrame(function() {
            updatesLength = updatesAddSkillComplete.length;
            updateIndex = 0;
            for (; updateIndex < updatesLength; updateIndex++) {
                Ext.fly(updatesAddSkillComplete[updateIndex]).addCls('is-complete');
            }

            Ext.Function.requestAnimationFrame(function() {
                updatesLength = updatesSetPercent.length;
                updateIndex = 0;
                for (; updateIndex < updatesLength; updateIndex++) {
                    update = updatesSetPercent[updateIndex];
                    Ext.fly(update.textDom).update(update.percent+'%');
                    Ext.fly(update.barDom).setWidth(update.percent+'%');
                }
            });
        });
    },

    /**
     * Attached via listeners config in view
     */
    onProgressRowClick: function(dashboardView, ev, targetEl) {
        var me = this,
            competencyId = targetEl.getAttribute('data-competency'),
            competency = Ext.getStore('cbl-competencies').getById(competencyId),
            skills = competency.get('skills'),
            skillsRows = dashboardView.el.select(
                Ext.String.format('.cbl-grid-skills-row[data-competency="{0}"]', competencyId),
                true // true to get back unique Ext.Element instances
            ),
            skillHeadersRow = skillsRows.item(0),
            skillStudentsRow = skillsRows.item(1),
            skillsHeight = 0,
            _finishExpand, _finishToggle, _renderSkills,
            studentIds, demonstrations;

    
        Ext.suspendLayouts();
        
        _finishToggle = function() {
            skillHeadersRow.down('.cbl-grid-skills-ct').setHeight(skillsHeight);
            skillStudentsRow.down('.cbl-grid-skills-ct').setHeight(skillsHeight);
            Ext.resumeLayouts(true);
        };


        // handle collapse
        if (competency.get('expanded')) {
            competency.set('expanded', false);
            skillsRows.removeCls('is-expanded');
            _finishToggle();
            return;
        }


        // handle expand
        competency.set('expanded', true);
        
        _finishExpand = function() {
            skillsHeight = skillHeadersRow.down('.cbl-grid-skills-grid').getHeight();
            skillsRows.addCls('is-expanded');
            _finishToggle();
        };

        // skills are already loaded & rendered, finish expand immediately
        if (competency.get('skillsRendered')) {
            _finishExpand();
            return;
        }

        // load skills from server and render
        studentIds = Ext.getStore('cbl-students').collect('ID');
        _renderSkills = function() {
            var skillHeadersTpl = dashboardView.getTpl('skillHeadersTpl'),
                skillStudentsTpl = dashboardView.getTpl('skillStudentsTpl'),
                skill, demonstrationsByStudent,
                demonstrationsLength = demonstrations.length, demonstrationIndex = 0, demonstration;

            competency.set('skillsRendered', true);

            // group skills by student
            for (; demonstrationIndex < demonstrationsLength; demonstrationIndex++) {
                demonstration = demonstrations[demonstrationIndex];
                skill = skills.get(demonstration.SkillID);
                demonstrationsByStudent = skill.demonstrationsByStudent || (skill.demonstrationsByStudent = {});

                if (demonstration.StudentID in demonstrationsByStudent) {
                    demonstrationsByStudent[demonstration.StudentID].push(demonstration);
                } else {
                    demonstrationsByStudent[demonstration.StudentID] = [demonstration];
                }
            }


            // render details tables
            skillHeadersTpl.overwrite(skillHeadersRow.down('tbody'), skills.items);
            skillStudentsTpl.overwrite(skillStudentsRow.down('tbody'), {
                skills: skills.items,
                studentIds: studentIds
            });

            me.syncRowHeights(
                skillHeadersRow.select('tr'),
                skillStudentsRow.select('tr')
            );

            _finishExpand();
        };

        // load demonstrations and skills
        competency.getDemonstrationsForStudents(studentIds, function(loadedDemonstrations) {
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
    },


    // public methods
    showCreateDemonstration: function(options) {
        return Ext.create('Slate.cbl.view.teacher.demonstration.CreateWindow', Ext.apply({
            autoShow: true
        }, options));
    },


    // protected methods

    /**
     * Redraw the dashboard based on currently loaded data
     */
    refresh: function() {
        var me = this,
            dashboardView = me.getView(),
            contentArea = dashboardView.getContentArea(),
            studentsStore = Ext.getStore('cbl-students'),
            competenciesStore = Ext.getStore('cbl-competencies'),
            
            syncCompetencyRowHeights = function() {
                me.syncRowHeights(
                    dashboardView.el.select('.cbl-grid-competencies thead tr, .cbl-grid-competencies .cbl-grid-progress-row'),
                    dashboardView.el.select('.cbl-grid-main thead tr, .cbl-grid-main .cbl-grid-progress-row')
                );
            };

        if (!studentsStore.isLoaded() || !contentArea) {
            return;
        }
        
        if (!competenciesStore.isLoaded()) {
            contentArea.getCompetenciesForStudents(studentsStore.collect('ID'), function(competencies) {
                competenciesStore.loadRawData(competencies);
                me.refresh();
            });
            return;
        }

//        Ext.suspendLayouts();

//        me.lookupReference('competencies').update({
//            competencies: me.competencies,
//            skills: me.skills
//        });

        dashboardView.update({
            students: Ext.pluck(studentsStore.getRange(), 'data'),
            competencies: Ext.pluck(competenciesStore.getRange(), 'data')
        });

        if (dashboardView.rendered) {
            syncCompetencyRowHeights();
        } else {
            dashboardView.on('render', syncCompetencyRowHeights, me, { single: true });
        }
        
//
//        Ext.resumeLayouts(true);
    },
    
    syncRowHeights: function(table1Rows, table2Rows) {
        var me = this,
            dashboardView = me.getView(),
            table1RowHeights = [],
            table2RowHeights = [],
            rowCount, rowIndex, table1Row, table2Row, maxHeight;

//        Ext.suspendLayouts();

        rowCount = table1Rows.getCount();

        if (table2Rows.getCount() != rowCount) {
            Ext.Logger.warn('tables\' row counts don\'t match');
        }

        // read all the row height in batch first for both tables
        for (rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            table1RowHeights.push(table1Rows.item(rowIndex).getHeight());
            table2RowHeights.push(table2Rows.item(rowIndex).getHeight());
        }

        // write all the max row heights
        for (rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            maxHeight = Math.max(table1RowHeights[rowIndex], table2RowHeights[rowIndex]);
            table1Rows.item(rowIndex).select('td, th').setHeight(maxHeight);
            table2Rows.item(rowIndex).select('td, th').setHeight(maxHeight);
            
//            console.log('set row %o height to %o', rowIndex, maxHeight);
//            studentsRows.item(rowIndex).setHeight(Math.max(competenciesRowHeights[rowIndex], studentsRowHeights[rowIndex]));
        }

//        Ext.resumeLayouts(true);
    }
});