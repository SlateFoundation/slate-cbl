/*jslint browser: true, undef: true *//*global Ext,Slate, SiteEnvironment*/
Ext.define('Slate.cbl.view.teacher.DashboardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-teacher-dashboard',
    requires: [
//        'Slate.cbl.view.teacher.DummyData',
        'Slate.cbl.API',
        'Slate.cbl.model.Student',
        'Slate.cbl.model.Competency',
        'Slate.cbl.model.Demonstration',
        'Slate.cbl.store.AllCompetencies',
        'Slate.cbl.view.teacher.demonstration.EditWindow',
        'Slate.cbl.view.teacher.skill.OverviewWindow',

        'Ext.util.Collection',
        'Ext.data.Store'
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
                '#cbl-students-loaded': {
                    refresh: 'refresh'
                },
                '#cbl-competencies-loaded': {
                    refresh: 'refresh'
                }
            },
            api: {
                demonstrationsave: 'onDemonstrationSave',
                demonstrationdeleted: 'onDemonstrationDelete'
            }
        }
    },


    // lifecycle overrides
    init: function() {
        Ext.create('Ext.data.Store', {
            storeId: 'cbl-students-loaded',
            model: 'Slate.cbl.model.Student'
        });

        Ext.create('Ext.data.Store', {
            storeId: 'cbl-competencies-loaded',
            model: 'Slate.cbl.model.Competency'
        });

        Ext.create('Slate.cbl.store.AllCompetencies', {
            storeId: 'cbl-competencies-all'
        });
    },


    // event handers
    onDemoCellClick: function(dashboardView, ev, targetEl) {
        Ext.create('Slate.cbl.view.teacher.skill.OverviewWindow', {
            autoShow: true,
            animateTarget: targetEl,

            student: targetEl.getAttribute('data-student'),
            competency: targetEl.up('.cbl-grid-skills-row').getAttribute('data-competency'),
            skill: targetEl.up('.cbl-grid-skill-row').getAttribute('data-skill'),

            listeners: {
                scope: this,
                createdemonstrationclick: 'onOverviewCreateDemonstrationClick',
                editdemonstrationclick: 'onOverviewEditDemonstrationClick',
                deletedemonstrationclick: 'onOverviewDeleteDemonstrationClick'
            }
        });
    },

    onOverviewCreateDemonstrationClick: function(overviewWindow, student, competency) {
        Ext.suspendLayouts();

        var editWindow = this.showDemonstrationEditWindow();
        editWindow.down('field[name=StudentID]').setValue(student);
        editWindow.getController().addCompetency(competency);

        Ext.resumeLayouts(true);
    },

    onOverviewEditDemonstrationClick: function(overviewWindow, demonstrationId, ev, targetEl) {
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
    
    onOverviewDeleteDemonstrationClick: function(overviewWindow, demonstrationId, ev, targetEl) {
        var me = this,
            editWindow = me.showDemonstrationEditWindow({
                title: 'Deleting demonstration #' + demonstrationId,
                deleting: true
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

    onDemonstrationSave: function(demonstration, operation) {
        var me = this,
            dashboardView = me.view,
            demonstrationsTpl = dashboardView.getTpl('demonstrationsTpl'),
            mainGridEl = dashboardView.el.down('.cbl-grid-main'),
            studentId = demonstration.get('StudentID'),
            competenciesStore = Ext.getStore('cbl-competencies-loaded'),

            demonstratedSkills = demonstration.get('Skills'),
            demonstratedSkillsLength = demonstratedSkills.length, demonstratedSkillIndex = 0, demonstratedSkill,
            loadedCompetency, loadedCompetencySkills, loadedSkill, demonstrationsByStudent, loadedDemonstrations, skillDemonstrationsCell, existingDemonstrationSkill,
            demonstrationFilterFn = function(loadedSkillDemonstration) {
                return loadedSkillDemonstration.DemonstrationID == demonstration.getId();
            },

            competencyCompletions = demonstration.get('competencyCompletions'),
            competencyCompletionsLength = competencyCompletions.length, competencyCompletionIndex = 0, competencyCompletion,
            competencyProgressCell, competencyPercent,

            updatesDemonstrations = [],
            updatesCompetencies = [],
            updatesLength, updateIndex, update;


        // compile operations and DOM references for needed updates -- don't write to dom!
        for (; demonstratedSkillIndex < demonstratedSkillsLength; demonstratedSkillIndex++) {
            demonstratedSkill = demonstratedSkills[demonstratedSkillIndex];

            // update in-memory skills
            loadedCompetency = competenciesStore.getById(demonstratedSkill.CompetencyID);
            loadedCompetencySkills = loadedCompetency && loadedCompetency.get('skills');
            loadedSkill = loadedCompetencySkills && loadedCompetencySkills.getByKey(demonstratedSkill.SkillID);

            // if the skill hasn't been loaded here yet, it hasn't been rendered yet either -- no updates are needed
            if (!loadedSkill) {
                continue;
            }

            demonstrationsByStudent = loadedSkill.demonstrationsByStudent || (loadedSkill.demonstrationsByStudent = {});
            loadedDemonstrations = studentId in demonstrationsByStudent ? demonstrationsByStudent[studentId] : demonstrationsByStudent[studentId] = [];

            // check if this is an update to an existing demonstration
            existingDemonstrationSkill = Ext.Array.findBy(loadedDemonstrations, demonstrationFilterFn);

            if (existingDemonstrationSkill) {
                existingDemonstrationSkill.Level = demonstratedSkill.Level;
            } else {
                loadedDemonstrations.push({
                    DemonstrationID: demonstration.getId(),
                    Level: demonstratedSkill.Level,
                    SkillID: demonstratedSkill.SkillID,
                    StudentID: studentId
                });
            }


            // update rendered demonstrations
            skillDemonstrationsCell = mainGridEl.down('.cbl-grid-skill-row[data-skill="'+loadedSkill.ID+'"] .cbl-grid-demos-cell[data-student="'+studentId+'"]', true);

            if (skillDemonstrationsCell) {
                updatesDemonstrations.push({
                    cellDom: skillDemonstrationsCell,
                    values: {
                        skill: loadedSkill,
                        studentId: studentId
                    }
                });
            }
        }

        for (; competencyCompletionIndex < competencyCompletionsLength; competencyCompletionIndex++) {
            competencyCompletion = competencyCompletions[competencyCompletionIndex];
            competencyProgressCell = mainGridEl.down('.cbl-grid-progress-row[data-competency="'+competencyCompletion.CompetencyID+'"] .cbl-grid-progress-cell[data-student="'+studentId+'"]', true);
            loadedCompetency = competenciesStore.getById(competencyCompletion.CompetencyID);

            if (!competencyProgressCell || !loadedCompetency) {
                continue;
            }

            competencyPercent = Math.round(100 * (competencyCompletion.demonstrationsCount || 0) / loadedCompetency.get('totalDemonstrationsRequired'));

            updatesCompetencies.push({
                percent: competencyPercent,
                average: competencyCompletion.demonstrationsAverage || 0,
                isAverageLow: competencyCompletion.demonstrationsAverage < loadedCompetency.get('minimumAverage') && competencyPercent >= 50,
                cellDom: competencyProgressCell,
                textDom: Ext.fly(competencyProgressCell).down('.cbl-grid-progress-percent', true),
                barDom: Ext.fly(competencyProgressCell).down('.cbl-grid-progress-bar', true),
                averageDom: Ext.fly(competencyProgressCell).down('.cbl-grid-progress-average', true)
            });
        }

        // apply DOM writes for all updates in batch
        Ext.Function.requestAnimationFrame(function() {
            updatesLength = updatesDemonstrations.length;
            updateIndex = 0;
            for (; updateIndex < updatesLength; updateIndex++) {
                update = updatesDemonstrations[updateIndex];
                demonstrationsTpl.overwrite(update.cellDom, update.values);
            }

            Ext.Function.requestAnimationFrame(function() {
                updatesLength = updatesCompetencies.length;
                updateIndex = 0;
                for (; updateIndex < updatesLength; updateIndex++) {
                    update = updatesCompetencies[updateIndex];

                    Ext.fly(update.textDom).update(update.percent+'%');
                    Ext.fly(update.barDom).setWidth(update.percent+'%');
                    Ext.fly(update.averageDom).update(Ext.util.Format.number(update.average, '0.##'));
                    Ext.fly(update.cellDom).toggleCls('is-average-low', update.isAverageLow);
                }
            });
        });
    },
    
    onDemonstrationDelete: function(demonstration, operation) {
        var me = this,
            dashboardView = me.view,
            mainGridEl = dashboardView.el.down('.cbl-grid-main'),
            studentId = demonstration.get('StudentID'),
            competenciesStore = Ext.getStore('cbl-competencies-loaded'),
            skillStudentsTpl = dashboardView.getTpl('skillStudentsTpl'),

            deletedSkills = demonstration.get('Skills'),
            deletedSkillsLength = deletedSkills.length, deletedSkillIndex = 0, demonstratedSkill,
            loadedCompetency, loadedSkill, demonstrationsByStudent, skillDemonstrationsCell, deletedSkillIds, studentDemonstrations, studentDemonstrationIndex = 0,

            competencyCompletions = operation.getProxy().getReader().rawData.data[0].competencyCompletions,
            competencyCompletionsLength = competencyCompletions.length, competencyCompletionIndex = 0, competencyCompletion,
            competencyProgressCell, competencyPercent,
            _compentencyDemonstrationResetFn,
            _updateCompetencySkillsFn, 

            updatesCompetencies = [],
            updatesLength, updateIndex, update, skillsRows, skillHeadersRow, skillStudentsRow, competencySkills, skill,
            
            updatedDemonstrationLength, updatedDemonstrationIndex;


        // compile operations and DOM references for needed updates -- don't write to dom!
        for (; deletedSkillIndex < deletedSkillsLength; deletedSkillIndex++) {
            loadedSkill = deletedSkills[deletedSkillIndex];
            // update rendered demonstrations
            skillDemonstrationsCell = mainGridEl.down('.cbl-grid-demo[data-demonstration-skill="'+loadedSkill.ID+'"]');

            if (skillDemonstrationsCell) {
                skillDemonstrationsCell.replaceCls('cbl-grid-demo-counted', 'cbl-grid-demo-empty');
                skillDemonstrationsCell.replaceCls('cbl-grid-demo-uncounted', 'cbl-grid-demo-empty');
                
                skillDemonstrationsCell.update('');
            }
        }
        
        for (; competencyCompletionIndex < competencyCompletionsLength; competencyCompletionIndex++) {
            competencyCompletion = competencyCompletions[competencyCompletionIndex];
            competencyProgressCell = mainGridEl.down('.cbl-grid-progress-row[data-competency="'+competencyCompletion.CompetencyID+'"] .cbl-grid-progress-cell[data-student="'+studentId+'"]', true);
            loadedCompetency = competenciesStore.getById(competencyCompletion.CompetencyID);
            
            if (!competencyProgressCell || !loadedCompetency) {
                continue;
            }

            competencyPercent = Math.round(100 * (competencyCompletion.demonstrationsCount || 0) / loadedCompetency.get('totalDemonstrationsRequired'));

            updatesCompetencies.push({
                percent: competencyPercent,
                average: competencyCompletion.demonstrationsAverage || 0,
                isAverageLow: competencyCompletion.demonstrationsAverage < loadedCompetency.get('minimumAverage') && competencyPercent >= 50,
                cellDom: competencyProgressCell,
                textDom: Ext.fly(competencyProgressCell).down('.cbl-grid-progress-percent', true),
                barDom: Ext.fly(competencyProgressCell).down('.cbl-grid-progress-bar', true),
                averageDom: Ext.fly(competencyProgressCell).down('.cbl-grid-progress-average', true),
                competency: loadedCompetency
            });
        }

        // apply DOM writes for all updates in batch
        Ext.Function.requestAnimationFrame(function() {
            updatesLength = updatesCompetencies.length;
            updateIndex = 0;

            _compentencyDemonstrationResetFn = function(skill, skillIndex) {
                for(var studentIndex in skill.demonstrationsByStudent) {
                    skill.demonstrationsByStudent[studentIndex] = [];
                }
            };
            
            _updateCompetencySkillsFn = function(updatedDemonstrationSkills) {
                // render details tables
                updatedDemonstrationLength = updatedDemonstrationSkills.length;
                updatedDemonstrationIndex = 0;
                
                for (; updatedDemonstrationIndex < updatedDemonstrationLength; updatedDemonstrationIndex++) {

                    demonstratedSkill = updatedDemonstrationSkills[updatedDemonstrationIndex];
                    skill = competencySkills.get(demonstratedSkill.SkillID);
                    
                    if (skill) {
                        demonstrationsByStudent = skill.demonstrationsByStudent || (skill.demonstrationsByStudent = {});

                        if (demonstratedSkill.StudentID in demonstrationsByStudent) {
                            demonstrationsByStudent[demonstratedSkill.StudentID].push(demonstratedSkill);
                        } else {
                            demonstrationsByStudent[demonstratedSkill.StudentID] = [demonstratedSkill];
                        }
                    }

                } 

                skillStudentsTpl.overwrite(skillStudentsRow.down('tbody'), {
                    skills: competencySkills.items,
                    studentIds: Ext.Object.getKeys(update.competency.get('studentCompletions'))
                });
                
                me.syncRowHeights(
                    skillHeadersRow.select('tr'),
                    skillStudentsRow.select('tr')
                );
            };

            for (; updateIndex < updatesLength; updateIndex++) {
                update = updatesCompetencies[updateIndex];

                competencySkills = update.competency.get('skills');
                
                if (update.competency.get('expanded')) {
                    competencySkills.each(_compentencyDemonstrationResetFn);
                           
                    skillsRows = dashboardView.el.select(
                        Ext.String.format('.cbl-grid-skills-row[data-competency="{0}"]', update.competency.getId()),
                        true // true to get back unique Ext.Element instances
                    );
                    
                    console.log(skillsRows);
                    
                    skillHeadersRow = skillsRows.item(0);
                    skillStudentsRow = skillsRows.item(1);
    
                    Ext.fly(update.textDom).update(update.percent+'%');
                    Ext.fly(update.barDom).setWidth(update.percent+'%');
                    Ext.fly(update.averageDom).update(Ext.util.Format.number(update.average, '0.##'));
                    Ext.fly(update.cellDom).toggleCls('is-average-low', update.isAverageLow);
                    
                    update.competency.getDemonstrationsForStudents(Ext.pluck(SiteEnvironment.cblStudents, 'ID'), _updateCompetencySkillsFn, me);
                }
            }
        }, me);
    },

    /**
     * Attached via listeners config in view
     */
    onProgressRowClick: function (dashboardView, ev, targetEl) {
        var me = this,
            competencyId = targetEl.getAttribute('data-competency'),
            competency = Ext.getStore('cbl-competencies-loaded').getById(competencyId),
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
        studentIds = Ext.getStore('cbl-students-loaded').collect('ID');
        _renderSkills = function() {
            var skillHeadersTpl = dashboardView.getTpl('skillHeadersTpl'),
                skillStudentsTpl = dashboardView.getTpl('skillStudentsTpl'),
                skill, demonstrationsByStudent,
                demonstrationsLength = demonstrations.length, demonstrationIndex = 0, demonstration;
//                skillsLength = skills.getCount(), skillIndex = 0, studentId;

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
    showDemonstrationEditWindow: function(options) {
        return Ext.create('Slate.cbl.view.teacher.demonstration.EditWindow', Ext.apply({
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
            studentsStore = Ext.getStore('cbl-students-loaded'),
            competenciesStore = Ext.getStore('cbl-competencies-loaded'),
            competencies,

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

        Ext.suspendLayouts();
        
        competencies = Ext.pluck(competenciesStore.getRange(), 'data');
        
        dashboardView.update({
            contentArea: contentArea.getData(),
            students: Ext.pluck(studentsStore.getRange(), 'data'),
            competencies: competencies
        });
        

        if (dashboardView.rendered) {
            syncCompetencyRowHeights();
        } else {
            dashboardView.on('render', syncCompetencyRowHeights, me, { single: true });
        }

        Ext.resumeLayouts(true);
    },

    syncRowHeights: function(table1Rows, table2Rows) {
        var table1RowHeights = [],
            table2RowHeights = [],
            rowCount, rowIndex, maxHeight;

        Ext.suspendLayouts();

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

        Ext.resumeLayouts(true);
    }
});