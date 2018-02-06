Ext.define('SlateDemonstrationsTeacher.controller.Debug', {
    extend: 'Ext.app.Controller',


    // controller configuration
    stores: [
        'Students',
        'Competencies@Slate.cbl.store',
        'StudentCompetencies',
    ],

    refs: {
        dashboardCt: 'slate-demonstrations-teacher-dashboard',
        progressGrid: 'slate-demonstrations-teacher-dashboard slate-demonstrations-teacher-progressgrid'
    },


    // entry points
    control: {
    },


    // controller lifecycle
    onLaunch: function () {
        var me = this;

        me.getDashboardCt().add({
            xtype: 'toolbar',
            defaults: {
                scope: me
            },
            items: [{
                text: 'Load level-up demos',
                handler: me.loadLevelUpDemos
            },{
                text: 'Swap first and second students',
                handler: me.swapFirstTwoStudents
            }]
        });
    },


    // debug actions
    loadLevelUpDemos: function() {
        this.getStudentCompetenciesStore().mergeData([
            {
                ID: 156,
                Class: 'Slate\\CBL\\StudentCompetency',
                Created: 1503954759,
                CreatorID: 1,
                StudentID: 3,
                CompetencyID: 8,
                Level: 9,
                EnteredVia: 'enrollment',
                BaselineRating: 8,
                demonstrationsMissed: 0,
                demonstrationsComplete: 14,
                demonstrationsAverage: 8.5,
                demonstrationsRequired: 14,
                effectiveDemonstrationsData: {
                    58: [
                        {
                            ID: 596,
                            Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                            Created: 1517930713,
                            CreatorID: 1,
                            DemonstrationID: 150,
                            SkillID: 58,
                            TargetLevel: 9,
                            DemonstratedLevel: 11,
                            Override: false,
                            DemonstrationDate: 1517930706
                        },
                        {
                            ID: 595,
                            Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                            Created: 1517930296,
                            CreatorID: 1,
                            DemonstrationID: 149,
                            SkillID: 58,
                            TargetLevel: 9,
                            DemonstratedLevel: 10,
                            Override: false,
                            DemonstrationDate: 1517930287
                        }
                    ],
                    59: [
                        {
                            ID: 584,
                            Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                            Created: 1517872812,
                            CreatorID: 1,
                            DemonstrationID: 141,
                            SkillID: 59,
                            TargetLevel: 9,
                            DemonstratedLevel: 9,
                            Override: false,
                            DemonstrationDate: 1517872801
                        },
                        {
                            ID: 583,
                            Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                            Created: 1517870422,
                            CreatorID: 1,
                            DemonstrationID: 140,
                            SkillID: 59,
                            TargetLevel: 9,
                            DemonstratedLevel: 9,
                            Override: false,
                            DemonstrationDate: 1517870414
                        }
                    ],
                    60: [
                        {
                            ID: 593,
                            Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                            Created: 1517928841,
                            CreatorID: 1,
                            DemonstrationID: 147,
                            SkillID: 60,
                            TargetLevel: 9,
                            DemonstratedLevel: 8,
                            Override: false,
                            DemonstrationDate: 1517928822
                        },
                        {
                            ID: 585,
                            Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                            Created: 1517927077,
                            CreatorID: 1,
                            DemonstrationID: 142,
                            SkillID: 60,
                            TargetLevel: 9,
                            DemonstratedLevel: 8,
                            Override: false,
                            DemonstrationDate: 1517927058
                        }
                    ],
                    61: [
                        {
                            ID: 594,
                            Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                            Created: 1517930191,
                            CreatorID: 1,
                            DemonstrationID: 148,
                            SkillID: 61,
                            TargetLevel: 9,
                            DemonstratedLevel: 8,
                            Override: false,
                            DemonstrationDate: 1517930167
                        },
                        {
                            ID: 586,
                            Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                            Created: 1517927077,
                            CreatorID: 1,
                            DemonstrationID: 142,
                            SkillID: 61,
                            TargetLevel: 9,
                            DemonstratedLevel: 8,
                            Override: false,
                            DemonstrationDate: 1517927058
                        }
                    ],
                    62: [
                        {
                            ID: 592,
                            Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                            Created: 1517928166,
                            CreatorID: 1,
                            DemonstrationID: 146,
                            SkillID: 62,
                            TargetLevel: 9,
                            DemonstratedLevel: 8,
                            Override: false,
                            DemonstrationDate: 1517928158
                        },
                        {
                            ID: 587,
                            Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                            Created: 1517927077,
                            CreatorID: 1,
                            DemonstrationID: 142,
                            SkillID: 62,
                            TargetLevel: 9,
                            DemonstratedLevel: 8,
                            Override: false,
                            DemonstrationDate: 1517927058
                        }
                    ],
                    63: [
                        {
                            ID: 591,
                            Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                            Created: 1517927891,
                            CreatorID: 1,
                            DemonstrationID: 145,
                            SkillID: 63,
                            TargetLevel: 9,
                            DemonstratedLevel: 8,
                            Override: false,
                            DemonstrationDate: 1517927883
                        },
                        {
                            ID: 588,
                            Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                            Created: 1517927077,
                            CreatorID: 1,
                            DemonstrationID: 142,
                            SkillID: 63,
                            TargetLevel: 9,
                            DemonstratedLevel: 8,
                            Override: false,
                            DemonstrationDate: 1517927058
                        }
                    ],
                    64: [
                        {
                            ID: 590,
                            Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                            Created: 1517927810,
                            CreatorID: 1,
                            DemonstrationID: 144,
                            SkillID: 64,
                            TargetLevel: 9,
                            DemonstratedLevel: 8,
                            Override: false,
                            DemonstrationDate: 1517927795
                        },
                        {
                            ID: 589,
                            Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                            Created: 1517927388,
                            CreatorID: 1,
                            DemonstrationID: 143,
                            SkillID: 64,
                            TargetLevel: 9,
                            DemonstratedLevel: 8,
                            Override: false,
                            DemonstrationDate: 1517927379
                        }
                    ]
                },
                isLevelComplete: true,
                growth: null
            }
        ]);
    },

    swapFirstTwoStudents: function() {
        var me = this,
            studentsStore = me.getStudentsStore(),
            competenciesStore = me.getCompetenciesStore(),
            studentCompetenciesStore = me.getStudentCompetenciesStore(),
            studentCompetencyMaxId = studentCompetenciesStore.max('ID'),
            progressGrid = me.getProgressGrid(),
            student1 = studentsStore.getAt(0),
            student2 = studentsStore.getAt(1),
            newData = [];

        competenciesStore.each(competency => {
            var studentCompetency1 = studentCompetenciesStore.queryBy(r => r.get('CompetencyID') == competency.getId() && r.get('StudentID') == student1.getId()).first(),
                studentCompetency2 = studentCompetenciesStore.queryBy(r => r.get('CompetencyID') == competency.getId() && r.get('StudentID') == student2.getId()).first();

            newData.push(
                Ext.applyIf({
                    ID: studentCompetency1.getId(),
                    StudentID: student1.getId()
                }, studentCompetency2.getData()),
                Ext.applyIf({
                    ID: studentCompetency2.getId(),
                    StudentID: student2.getId()
                }, studentCompetency1.getData())
            );
        });

        studentCompetenciesStore.mergeData(newData);
    }
});