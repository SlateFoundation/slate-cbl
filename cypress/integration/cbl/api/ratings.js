describe('CBL / API / Ratings', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        cy.loginAs('teacher');
    });

    it('Initial state matches expectations', () => {
        cy.request('/cbl/student-competencies?format=json&limit=0').then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('success').to.be.true;
            expect(response.body).property('total').to.eq(656);
            expect(response.body).property('limit').to.eq(0);
            expect(response.body).property('data').to.be.an('array');
            expect(response.body.data).to.have.length(656);
            expect(response.body.data[0]).to.include({
                ID: 584,
                Class: 'Slate\\CBL\\StudentCompetency',
                Created: 1622423774,
                CreatorID: 2,
                StudentID: 11,
                CompetencyID: 20,
                Level: 12,
                EnteredVia: 'enrollment',
                BaselineRating: 0
            });

        });

        cy.request('/cbl/student-competencies/1?format=json&include=completion,effectiveDemonstrationsData').then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');

            expect(response.body).property('data').to.be.an('object');
            expect(response.body.data).to.include({
                ID: 1,
                Class: 'Slate\\CBL\\StudentCompetency',
                Created: 1546398245,
                CreatorID: 2,
                StudentID: 4,
                CompetencyID: 1,
                Level: 9,
                EnteredVia: 'enrollment',
                BaselineRating: 9
            });

            expect(response.body.data).property('completion').to.be.an('object');
            expect(response.body.data.completion).to.include({
                StudentID: 4,
                CompetencyID: 1,
                currentLevel: 9,
                baselineRating: 9,
                demonstrationsLogged: 12,
                demonstrationsMissed: 0,
                demonstrationsComplete: 12,
                demonstrationsAverage: 10,
                demonstrationsRequired: 12
            });

            expect(response.body.data).property('effectiveDemonstrationsData').to.be.an('object');
            expect(response.body.data.effectiveDemonstrationsData).to.have.all.keys('1', '2', '3', '4');
            expect(response.body.data.effectiveDemonstrationsData['1']).to.be.an('array');
            expect(response.body.data.effectiveDemonstrationsData['1']).to.have.length(3);
            expect(response.body.data.effectiveDemonstrationsData['1'][0]).to.include({
                ID: 1,
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                Created: 1546398245,
                CreatorID: 3,
                Modified: null,
                ModifierID: null,
                DemonstrationID: 1,
                SkillID: 1,
                TargetLevel: 9,
                DemonstratedLevel: 9,
                EvidenceWeight: 1,
                DemonstrationDate: 1546300860
            });
        });

        cy.request('/cbl/student-competencies/33?format=json&include=completion,effectiveDemonstrationsData').then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');

            expect(response.body).property('data').to.be.an('object');
            expect(response.body.data).to.include({
                ID: 33,
                StudentID: 4,
                CompetencyID: 1,
                Level: 10,
                EnteredVia: 'graduation',
                BaselineRating: 10
            });

            expect(response.body.data).property('completion').to.be.an('object');
            expect(response.body.data.completion).to.include({
                StudentID: 4,
                CompetencyID: 1,
                currentLevel: 10,
                baselineRating: 10,
                demonstrationsLogged: 4,
                demonstrationsMissed: 0,
                demonstrationsComplete: 4,
                demonstrationsAverage: 9.3,
                demonstrationsRequired: 12
            });
        });
    });

    it('demonstration-skills: Can change DemonstratedLevel to 10', () => {
        cy.request('POST', '/cbl/demonstration-skills/save?format=json', {
            data: [{
                ID: 1,
                SkillID: 1,
                DemonstratedLevel: 10
            }]
        }).then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array').that.has.length(1);
            expect(response.body.data[0]).to.be.an('object');
            expect(response.body.data[0]).to.include({
                ID: 1,
                SkillID: 1,
                DemonstratedLevel: 10,
                TargetLevel: 9,
                EvidenceWeight: 1
            });
        });
    });

    it('demonstration-skills: Can change DemonstratedLevel to null', () => {
        cy.request('POST', '/cbl/demonstration-skills/save?format=json', {
            data: [{
                ID: 1,
                SkillID: 1,
                DemonstratedLevel: null
            }]
        }).then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array').that.has.length(1);
            expect(response.body.data[0]).to.be.an('object');
            expect(response.body.data[0]).to.include({
                ID: 1,
                SkillID: 1,
                DemonstratedLevel: null,
                TargetLevel: 9,
                EvidenceWeight: 1
            });
        });
    });

    it('demonstration-skills: Can change EvidenceWeight to 2', () => {
        cy.request('POST', '/cbl/demonstration-skills/save?format=json', {
            data: [{
                ID: 1,
                SkillID: 1,
                EvidenceWeight: 2
            }]
        }).then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array').that.has.length(1);
            expect(response.body.data[0]).to.be.an('object');
            expect(response.body.data[0]).to.include({
                ID: 1,
                SkillID: 1,
                DemonstratedLevel: null,
                TargetLevel: 9,
                EvidenceWeight: 2
            });
        });
    });

    it('demonstration-skills: Can change EvidenceWeight to null', () => {
        cy.request('POST', '/cbl/demonstration-skills/save?format=json', {
            data: [{
                ID: 1,
                SkillID: 1,
                EvidenceWeight: null
            }]
        }).then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array').that.has.length(1);
            expect(response.body.data[0]).to.be.an('object');
            expect(response.body.data[0]).to.include({
                ID: 1,
                SkillID: 1,
                DemonstratedLevel: null,
                TargetLevel: 9,
                EvidenceWeight: null
            });
        });
    });

    it('demonstration-skills: Validation prevents TargetLevel changes', () => {
        const patchData = {
            ID: 1,
            SkillID: 1,
            TargetLevel: 10,
            DemonstratedLevel: 11
        };

        cy.request('POST', '/cbl/demonstration-skills/save?format=json', {
            data: [patchData]
        }).then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array');
            expect(response.body).property('message', 'TargetLevel cannot be changed on existing records');
            expect(response.body).property('success', false);
            expect(response.body).property('failed').to.be.an('array').that.has.length(1);
            expect(response.body.failed[0]).to.be.an('object').that.has.all.keys('record', 'validationErrors');
            expect(response.body.failed[0].record).to.be.an('object').to.include(patchData);
            expect(response.body.failed[0].validationErrors).to.be.an('object')
                .that.has.all.keys('TargetLevel')
                .that.has.property('TargetLevel', 'TargetLevel cannot be changed on existing records');
        });

        cy.request('/cbl/demonstration-skills/1?format=json').then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data')
                .to.be.an('object')
                .to.include({
                    ID: 1,
                    SkillID: 1,
                    DemonstratedLevel: null,
                    TargetLevel: 9,
                    EvidenceWeight: null
                });
        });
    });

    let createdOverrideID;
    it('demonstrations: Create an override', () => {
        cy.request('POST', '/cbl/demonstrations/save?format=json&include=DemonstrationSkills', {
            data: [{
                ID: -1,
                Class: 'Slate\\CBL\\Demonstrations\\OverrideDemonstration',
                StudentID: 4,
                DemonstrationSkills: [
                  {
                    SkillID: 1,
                    EvidenceWeight: null
                  }
                ],
                Comments: 'this is an override comment'
            }]
        }).then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array').that.has.length(1);
            expect(response.body).property('message', null);
            expect(response.body).property('success', true);
            expect(response.body).property('failed').to.be.an('array').that.has.length(0);
            expect(response.body.data[0]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\OverrideDemonstration',
                StudentID: 4,
                ArtifactURL: null,
                Comments: 'this is an override comment'
            });
            expect(response.body.data[0].ID).to.be.a('number').that.has.greaterThan(0);
            expect(response.body.data[0].DemonstrationSkills).to.be.an('array').that.has.length(1);
            expect(response.body.data[0].DemonstrationSkills[0]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].ID,
                SkillID: 1,
                TargetLevel: 10,
                DemonstratedLevel: null,
                EvidenceWeight: null,
            });

            // save for delete test
            createdOverrideID = response.body.data[0].ID;
        });

        cy.request('/cbl/student-competencies/33?format=json&include=completion,effectiveDemonstrationsData').then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');

            expect(response.body).property('data').to.be.an('object');
            expect(response.body.data).to.include({
                ID: 33,
                StudentID: 4,
                CompetencyID: 1,
                Level: 10,
                EnteredVia: 'graduation',
                BaselineRating: 10
            });

            expect(response.body.data).property('completion').to.be.an('object');
            expect(response.body.data.completion).to.include({
                StudentID: 4,
                CompetencyID: 1,
                currentLevel: 10,
                baselineRating: 10,
                demonstrationsLogged: 4,
                demonstrationsMissed: 0,
                demonstrationsComplete: 6,
                demonstrationsAverage: 9.3,
                demonstrationsRequired: 12
            });

            expect(response.body.data).property('effectiveDemonstrationsData').to.be.an('object').to.have.all.keys('1', '2', '3', '4');
            expect(response.body.data.effectiveDemonstrationsData['1']).to.be.an('array').that.has.length(2);
            expect(response.body.data.effectiveDemonstrationsData['2']).to.be.an('array').that.has.length(1);
            expect(response.body.data.effectiveDemonstrationsData['3']).to.be.an('array').that.has.length(1);
            expect(response.body.data.effectiveDemonstrationsData['4']).to.be.an('array').that.has.length(1);
            expect(response.body.data.effectiveDemonstrationsData['1'][0]).to.be.an('object').to.include({
                SkillID: 1,
                TargetLevel: 10,
                DemonstratedLevel: 8,
                EvidenceWeight: 1
            });
            expect(response.body.data.effectiveDemonstrationsData['1'][1]).to.be.an('object').to.include({
                SkillID: 1,
                TargetLevel: 10,
                DemonstratedLevel: null,
                EvidenceWeight: null
            });
        });
    });

    it('demonstrations: Delete an override', () => {
        cy.request('POST', '/cbl/demonstrations/destroy?format=json&include=DemonstrationSkills', {
            data: [{
                ID: createdOverrideID
            }]
        }).then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array').that.has.length(1);
            expect(response.body).property('success', true);
            expect(response.body).property('failed').to.be.an('array').that.has.length(0);
            expect(response.body.data[0]).to.be.an('object').to.include({
                ID: createdOverrideID,
                Class: 'Slate\\CBL\\Demonstrations\\OverrideDemonstration',
                StudentID: 4,
                ArtifactURL: null,
                Comments: 'this is an override comment'
            });
            expect(response.body.data[0].DemonstrationSkills).to.be.an('array').that.has.length(1);
            expect(response.body.data[0].DemonstrationSkills[0]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].ID,
                SkillID: 1,
                TargetLevel: 10,
                DemonstratedLevel: null,
                EvidenceWeight: null,
            });
        });

        cy.request('/cbl/student-competencies/33?format=json&include=completion,effectiveDemonstrationsData').then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');

            expect(response.body).property('data').to.be.an('object');
            expect(response.body.data).to.include({
                ID: 33,
                StudentID: 4,
                CompetencyID: 1,
                Level: 10,
                EnteredVia: 'graduation',
                BaselineRating: 10
            });

            expect(response.body.data).property('completion').to.be.an('object');
            expect(response.body.data.completion).to.include({
                StudentID: 4,
                CompetencyID: 1,
                currentLevel: 10,
                baselineRating: 10,
                demonstrationsLogged: 4,
                demonstrationsMissed: 0,
                demonstrationsComplete: 4,
                demonstrationsAverage: 9.3,
                demonstrationsRequired: 12
            });

            expect(response.body.data).property('effectiveDemonstrationsData').to.be.an('object').to.have.all.keys('1', '2', '3', '4');
            expect(response.body.data.effectiveDemonstrationsData['1']).to.be.an('array').that.has.length(1);
            expect(response.body.data.effectiveDemonstrationsData['2']).to.be.an('array').that.has.length(1);
            expect(response.body.data.effectiveDemonstrationsData['3']).to.be.an('array').that.has.length(1);
            expect(response.body.data.effectiveDemonstrationsData['4']).to.be.an('array').that.has.length(1);
            expect(response.body.data.effectiveDemonstrationsData['1'][0]).to.be.an('object').to.include({
                SkillID: 1,
                TargetLevel: 10,
                DemonstratedLevel: 8,
                EvidenceWeight: 1
            });
        });
    });

    it('demonstrations: Change a single rating', () => {
        cy.request('POST', '/cbl/demonstrations/save?format=json&include=DemonstrationSkills', {
            data: [{
                ID: 28,
                DemonstrationSkills: [
                    { SkillID: 1, TargetLevel: 10, DemonstratedLevel: 9 },
                    { SkillID: 2, TargetLevel: 10 },
                    { SkillID: 3, TargetLevel: 10 },
                    { SkillID: 4, TargetLevel: 10 },
                    { SkillID: 5, TargetLevel: 10 }, // does not already exist and should be ignored
                ]
            }]
        }).then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array').that.has.length(1);
            expect(response.body).property('success', true);
            expect(response.body).property('failed').to.be.an('array').that.has.length(0);
            expect(response.body.data[0]).to.be.an('object').to.include({
                ID: 28,
                Class: 'Slate\\CBL\\Demonstrations\\ExperienceDemonstration',
                StudentID: 4,
            });
            expect(response.body.data[0].DemonstrationSkills).to.be.an('array').that.has.length(4);
            expect(response.body.data[0].DemonstrationSkills[0]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].ID,
                SkillID: 1,
                TargetLevel: 10,
                DemonstratedLevel: 9,
                EvidenceWeight: 1,
            });
            expect(response.body.data[0].DemonstrationSkills[1]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].ID,
                SkillID: 2,
                TargetLevel: 10,
                DemonstratedLevel: 9,
                EvidenceWeight: 1,
            });
            expect(response.body.data[0].DemonstrationSkills[2]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].ID,
                SkillID: 3,
                TargetLevel: 10,
                DemonstratedLevel: 10,
                EvidenceWeight: 1,
            });
            expect(response.body.data[0].DemonstrationSkills[3]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].ID,
                SkillID: 4,
                TargetLevel: 10,
                DemonstratedLevel: 10,
                EvidenceWeight: 1,
            });
        });

        cy.request('/cbl/student-competencies/33?format=json&include=completion,effectiveDemonstrationsData').then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');

            expect(response.body).property('data').to.be.an('object');
            expect(response.body.data).to.include({
                ID: 33,
                StudentID: 4,
                CompetencyID: 1,
                Level: 10,
                EnteredVia: 'graduation',
                BaselineRating: 10
            });

            expect(response.body.data).property('completion').to.be.an('object');
            expect(response.body.data.completion).to.include({
                StudentID: 4,
                CompetencyID: 1,
                currentLevel: 10,
                baselineRating: 10,
                demonstrationsLogged: 4,
                demonstrationsMissed: 0,
                demonstrationsComplete: 4,
                demonstrationsAverage: 9.5,
                demonstrationsRequired: 12
            });

            expect(response.body.data).property('effectiveDemonstrationsData').to.be.an('object').to.have.all.keys('1', '2', '3', '4');
            expect(response.body.data.effectiveDemonstrationsData['1']).to.be.an('array').that.has.length(1);
            expect(response.body.data.effectiveDemonstrationsData['2']).to.be.an('array').that.has.length(1);
            expect(response.body.data.effectiveDemonstrationsData['3']).to.be.an('array').that.has.length(1);
            expect(response.body.data.effectiveDemonstrationsData['4']).to.be.an('array').that.has.length(1);
        });
    });

    it('demonstrations: Delete a single rating', () => {
        cy.request('POST', '/cbl/demonstrations/save?format=json&include=DemonstrationSkills', {
            data: [{
                ID: 28,
                DemonstrationSkills: [
                    { SkillID: 2, TargetLevel: 10, DemonstratedLevel: 9 },
                    { SkillID: 3, TargetLevel: 10, DemonstratedLevel: 10 },
                    { SkillID: 4, TargetLevel: 10, DemonstratedLevel: 10 },
                ]
            }]
        }).then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array').that.has.length(1);
            expect(response.body).property('success', true);
            expect(response.body).property('failed').to.be.an('array').that.has.length(0);
            expect(response.body.data[0]).to.be.an('object').to.include({
                ID: 28,
                Class: 'Slate\\CBL\\Demonstrations\\ExperienceDemonstration',
                StudentID: 4,
            });
            expect(response.body.data[0].DemonstrationSkills).to.be.an('array').that.has.length(3);
            expect(response.body.data[0].DemonstrationSkills[0]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].ID,
                SkillID: 2,
                TargetLevel: 10,
                DemonstratedLevel: 9,
                EvidenceWeight: 1,
            });
            expect(response.body.data[0].DemonstrationSkills[1]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].ID,
                SkillID: 3,
                TargetLevel: 10,
                DemonstratedLevel: 10,
                EvidenceWeight: 1,
            });
            expect(response.body.data[0].DemonstrationSkills[2]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].ID,
                SkillID: 4,
                TargetLevel: 10,
                DemonstratedLevel: 10,
                EvidenceWeight: 1,
            });
        });

        cy.request('/cbl/student-competencies/33?format=json&include=completion,effectiveDemonstrationsData').then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');

            expect(response.body).property('data').to.be.an('object');
            expect(response.body.data).to.include({
                ID: 33,
                StudentID: 4,
                CompetencyID: 1,
                Level: 10,
                EnteredVia: 'graduation',
                BaselineRating: 10
            });

            expect(response.body.data).property('completion').to.be.an('object');
            expect(response.body.data.completion).to.include({
                StudentID: 4,
                CompetencyID: 1,
                currentLevel: 10,
                baselineRating: 10,
                demonstrationsLogged: 3,
                demonstrationsMissed: 0,
                demonstrationsComplete: 3,
                demonstrationsAverage: 9.7,
                demonstrationsRequired: 12
            });

            expect(response.body.data).property('effectiveDemonstrationsData').to.be.an('object').to.have.all.keys('2', '3', '4');
            expect(response.body.data.effectiveDemonstrationsData['2']).to.be.an('array').that.has.length(1);
            expect(response.body.data.effectiveDemonstrationsData['3']).to.be.an('array').that.has.length(1);
            expect(response.body.data.effectiveDemonstrationsData['4']).to.be.an('array').that.has.length(1);
        });
    });

    it('demonstrations: Add a single rating', () => {
        cy.request('POST', '/cbl/demonstrations/save?format=json&include=DemonstrationSkills', {
            data: [{
                ID: 28,
                DemonstrationSkills: [
                    { SkillID: 1, TargetLevel: 10, DemonstratedLevel: 12 },
                    { SkillID: 2, TargetLevel: 10 },
                    { SkillID: 3, TargetLevel: 10 },
                    { SkillID: 4, TargetLevel: 10 },
                ]
            }]
        }).then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array').that.has.length(1);
            expect(response.body).property('success', true);
            expect(response.body).property('failed').to.be.an('array').that.has.length(0);
            expect(response.body.data[0]).to.be.an('object').to.include({
                ID: 28,
                Class: 'Slate\\CBL\\Demonstrations\\ExperienceDemonstration',
                StudentID: 4,
            });
            expect(response.body.data[0].DemonstrationSkills).to.be.an('array').that.has.length(4);
            expect(response.body.data[0].DemonstrationSkills[0]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].ID,
                SkillID: 1,
                TargetLevel: 10,
                DemonstratedLevel: 12,
                EvidenceWeight: 1,
            });
            expect(response.body.data[0].DemonstrationSkills[1]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].ID,
                SkillID: 2,
                TargetLevel: 10,
                DemonstratedLevel: 9,
                EvidenceWeight: 1,
            });
            expect(response.body.data[0].DemonstrationSkills[2]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].ID,
                SkillID: 3,
                TargetLevel: 10,
                DemonstratedLevel: 10,
                EvidenceWeight: 1,
            });
            expect(response.body.data[0].DemonstrationSkills[3]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].ID,
                SkillID: 4,
                TargetLevel: 10,
                DemonstratedLevel: 10,
                EvidenceWeight: 1,
            });
        });

        cy.request('/cbl/student-competencies/33?format=json&include=completion,effectiveDemonstrationsData').then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');

            expect(response.body).property('data').to.be.an('object');
            expect(response.body.data).to.include({
                ID: 33,
                StudentID: 4,
                CompetencyID: 1,
                Level: 10,
                EnteredVia: 'graduation',
                BaselineRating: 10
            });

            expect(response.body.data).property('completion').to.be.an('object');
            expect(response.body.data.completion).to.include({
                StudentID: 4,
                CompetencyID: 1,
                currentLevel: 10,
                baselineRating: 10,
                demonstrationsLogged: 4,
                demonstrationsMissed: 0,
                demonstrationsComplete: 4,
                demonstrationsAverage: 10.3,
                demonstrationsRequired: 12
            });

            expect(response.body.data).property('effectiveDemonstrationsData').to.be.an('object').to.have.all.keys('1', '2', '3', '4');
            expect(response.body.data.effectiveDemonstrationsData['1']).to.be.an('array').that.has.length(1);
            expect(response.body.data.effectiveDemonstrationsData['2']).to.be.an('array').that.has.length(1);
            expect(response.body.data.effectiveDemonstrationsData['3']).to.be.an('array').that.has.length(1);
            expect(response.body.data.effectiveDemonstrationsData['4']).to.be.an('array').that.has.length(1);
        });
    });

    it('student-tasks: Attach student-specific skills', () => {
        cy.request('POST', '/cbl/student-tasks/save?format=json&include=Demonstration.DemonstrationSkills,Skills', {
            data: [{
                ID: 68,
                DemonstrationSkills: [
                    { SkillID: 1, TargetLevel: 9, DemonstratedLevel: null, EvidenceWeight: null },
                    { SkillID: 2, TargetLevel: 9, DemonstratedLevel: null },
                    { SkillID: 3, TargetLevel: 9 },
                    { SkillID: 4, TargetLevel: 9 },
                ]
            }]
        }).then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array').that.has.length(1);
            expect(response.body).property('message', null);
            expect(response.body).property('success', true);
            expect(response.body).property('failed').to.be.an('array').that.has.length(0);
            expect(response.body.data[0]).to.be.an('object').to.contain.keys('Demonstration', 'Skills');
            expect(response.body.data[0].Demonstration).to.be.an('object').that.has.property('DemonstrationSkills');
            expect(response.body.data[0].Demonstration.DemonstrationSkills).to.be.an('array').that.has.length(0);
            expect(response.body.data[0].Skills).to.be.an('array').that.has.length(4);
            expect(response.body.data[0].Skills[0]).to.be.an('object').that.has.property('ID', 1);
            expect(response.body.data[0].Skills[1]).to.be.an('object').that.has.property('ID', 2);
            expect(response.body.data[0].Skills[2]).to.be.an('object').that.has.property('ID', 3);
            expect(response.body.data[0].Skills[3]).to.be.an('object').that.has.property('ID', 4);
        });
    });

    it('student-tasks: Remove student-specific skills', () => {
        cy.request('POST', '/cbl/student-tasks/save?format=json&include=Demonstration.DemonstrationSkills,Skills', {
            data: [{
                ID: 68,
                DemonstrationSkills: [
                    { SkillID: 1, TargetLevel: 9, DemonstratedLevel: null, EvidenceWeight: null },
                    { SkillID: 2, TargetLevel: 9, DemonstratedLevel: null },
                    { SkillID: 3, TargetLevel: 9 },
                ]
            }]
        }).then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array').that.has.length(1);
            expect(response.body).property('message', null);
            expect(response.body).property('success', true);
            expect(response.body).property('failed').to.be.an('array').that.has.length(0);
            expect(response.body.data[0]).to.be.an('object').to.contain.keys('Demonstration', 'Skills');
            expect(response.body.data[0].Skills).to.be.an('array').that.has.length(3);
            expect(response.body.data[0].Skills[0]).to.be.an('object').that.has.property('ID', 1);
            expect(response.body.data[0].Skills[1]).to.be.an('object').that.has.property('ID', 2);
            expect(response.body.data[0].Skills[2]).to.be.an('object').that.has.property('ID', 3);
            expect(response.body.data[0].Demonstration).to.be.an('object').that.has.property('DemonstrationSkills');
            expect(response.body.data[0].Demonstration.DemonstrationSkills).to.be.an('array').that.has.length(0);
        });
    });

    it('student-tasks: Add ratings', () => {
        // add multiple to both student-level and task-level
        cy.request('POST', '/cbl/student-tasks/save?format=json&include=Demonstration.DemonstrationSkills,Skills', {
            data: [{
                ID: 68,
                DemonstrationSkills: [
                    { SkillID: 1, TargetLevel: 9, DemonstratedLevel: 5 },
                    { SkillID: 2, TargetLevel: 9, DemonstratedLevel: 6 },
                    { SkillID: 3, TargetLevel: 9, DemonstratedLevel: 7 },
                    { SkillID: 38, TargetLevel: 9, DemonstratedLevel: 8 },
                    { SkillID: 39, TargetLevel: 9, DemonstratedLevel: 9 },
                    { SkillID: 119, TargetLevel: 9, DemonstratedLevel: 10 },
                ]
            }]
        }).then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array').that.has.length(1);
            expect(response.body).property('message', null);
            expect(response.body).property('success', true);
            expect(response.body).property('failed').to.be.an('array').that.has.length(0);
            expect(response.body.data[0]).to.be.an('object').to.contain.keys('Demonstration', 'Skills');
            expect(response.body.data[0].Skills).to.be.an('array').that.has.length(3);
            expect(response.body.data[0].Skills[0]).to.be.an('object').that.has.property('ID', 1);
            expect(response.body.data[0].Skills[1]).to.be.an('object').that.has.property('ID', 2);
            expect(response.body.data[0].Skills[2]).to.be.an('object').that.has.property('ID', 3);
            expect(response.body.data[0].Demonstration).to.be.an('object').that.has.property('DemonstrationSkills');
            expect(response.body.data[0].Demonstration.DemonstrationSkills).to.be.an('array').that.has.length(6);
            expect(response.body.data[0].Demonstration.DemonstrationSkills[0]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].Demonstration.ID,
                SkillID: 1,
                TargetLevel: 9,
                DemonstratedLevel: 5,
                EvidenceWeight: 1,
            });
            expect(response.body.data[0].Demonstration.DemonstrationSkills[1]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].Demonstration.ID,
                SkillID: 2,
                TargetLevel: 9,
                DemonstratedLevel: 6,
                EvidenceWeight: 1,
            });
            expect(response.body.data[0].Demonstration.DemonstrationSkills[2]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].Demonstration.ID,
                SkillID: 3,
                TargetLevel: 9,
                DemonstratedLevel: 7,
                EvidenceWeight: 1,
            });
            expect(response.body.data[0].Demonstration.DemonstrationSkills[3]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].Demonstration.ID,
                SkillID: 38,
                TargetLevel: 9,
                DemonstratedLevel: 8,
                EvidenceWeight: 1,
            });
            expect(response.body.data[0].Demonstration.DemonstrationSkills[4]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].Demonstration.ID,
                SkillID: 39,
                TargetLevel: 9,
                DemonstratedLevel: 9,
                EvidenceWeight: 1,
            });
            expect(response.body.data[0].Demonstration.DemonstrationSkills[5]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].Demonstration.ID,
                SkillID: 119,
                TargetLevel: 9,
                DemonstratedLevel: 10,
                EvidenceWeight: 1,
            });
        });
    });

    it('student-tasks: Remove ratings', () => {
        // remove subset of both student-level and task-level added above
        cy.request('POST', '/cbl/student-tasks/save?format=json&include=Demonstration.DemonstrationSkills,Skills', {
            data: [{
                ID: 68,
                DemonstrationSkills: [
                    { SkillID: 1, TargetLevel: 9, DemonstratedLevel: 7 },
                    { SkillID: 2, TargetLevel: 9 }, // delete by having no rating
                    // { SkillID: 3, TargetLevel: 9, DemonstratedLevel: 7 }, // delete rating by omission
                    // { SkillID: 38, TargetLevel: 9, DemonstratedLevel: 8 }, // delete rating by omission
                    { SkillID: 39, TargetLevel: 9, DemonstratedLevel: 8 },
                    { SkillID: 119, TargetLevel: 9, DemonstratedLevel: null }, // delete by having null rating
                ]
            }]
        }).then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array').that.has.length(1);
            expect(response.body).property('message', null);
            expect(response.body).property('success', true);
            expect(response.body).property('failed').to.be.an('array').that.has.length(0);
            expect(response.body.data[0]).to.be.an('object').to.contain.keys('Demonstration', 'Skills');
            expect(response.body.data[0].Skills).to.be.an('array').that.has.length(2);
            expect(response.body.data[0].Skills[0]).to.be.an('object').that.has.property('ID', 1);
            expect(response.body.data[0].Skills[1]).to.be.an('object').that.has.property('ID', 2);
            expect(response.body.data[0].Demonstration).to.be.an('object').that.has.property('DemonstrationSkills');
            expect(response.body.data[0].Demonstration.DemonstrationSkills).to.be.an('array').that.has.length(2);
            expect(response.body.data[0].Demonstration.DemonstrationSkills[0]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].Demonstration.ID,
                SkillID: 1,
                TargetLevel: 9,
                DemonstratedLevel: 7,
                EvidenceWeight: 1,
            });
            expect(response.body.data[0].Demonstration.DemonstrationSkills[1]).to.be.an('object').to.include({
                Class: 'Slate\\CBL\\Demonstrations\\DemonstrationSkill',
                DemonstrationID: response.body.data[0].Demonstration.ID,
                SkillID: 39,
                TargetLevel: 9,
                DemonstratedLevel: 8,
                EvidenceWeight: 1,
            });
        });
    });
});