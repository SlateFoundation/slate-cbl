describe('/cbl/student-competencies API', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        cy.loginAs('teacher');
    });

    it('Expected student competencies exist', () => {
        cy.request('/cbl/student-competencies?format=json').then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array');
            expect(response.body.data).to.have.length(64);
            expect(response.body.data[0]).to.include({
                ID: 64,
                Class: 'Slate\\CBL\\StudentCompetency',
                Created: 1546401845,
                CreatorID: 1,
                StudentID: 7,
                CompetencyID: 11,
                Level: 10,
                EnteredVia: 'graduation',
                BaselineRating: 9
            });

        });

        cy.request('/cbl/student-competencies/1?format=json&include=completion,effectiveDemonstrationsData').then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');

            expect(response.body).property('data').to.be.an('object');
            expect(response.body.data).to.include({
                ID: 1,
                Class: 'Slate\\CBL\\StudentCompetency',
                Created: 1546401845,
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
                Created: 1546401845,
                CreatorID: 3,
                Modified: null,
                ModifierID: null,
                DemonstrationID: 1,
                SkillID: 1,
                TargetLevel: 9,
                DemonstratedLevel: 9,
                Override: false,
                DemonstrationDate: 1546304460
            });
        });
    });

    it('Can change DemonstratedLevel on existing student task rating', () => {
        cy.request('POST', '/cbl/student-tasks/save?format=json&include=Demonstration.DemonstrationSkills', {
            data: [{
                ID: 1,
                DemonstrationSkills: [{
                    ID: 1,
                    SkillID: 1,
                    DemonstratedLevel: 10
                }]
            }]
        }).then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array').that.has.length(1);
            expect(response.body.data[0]).property('Demonstration').to.be.an('object');
            expect(response.body.data[0].Demonstration).property('DemonstrationSkills').to.be.an('array').that.has.length(1);
            expect(response.body.data[0].Demonstration.DemonstrationSkills[0]).to.be.an('object');
            expect(response.body.data[0].Demonstration.DemonstrationSkills[0]).to.include({
                ID: 1,
                SkillID: 1,
                DemonstratedLevel: 10,
                TargetLevel: 9,
                Override: 0
            });
        });
    });

    it('Validation prevents TargetLevel changes to existing StudentTask rating', () => {
        cy.request('POST', '/cbl/student-tasks/save?format=json&include=Demonstration.DemonstrationSkills', {
            data: [{
                ID: 1,
                DemonstrationSkills: [{
                    ID: 1,
                    SkillID: 1,
                    TargetLevel: 10,
                    DemonstratedLevel: 11
                }]
            }]
        }).then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array');
            expect(response.body).property('message', 'TargetLevel cannot be changed on existing records');
            expect(response.body).property('success', false);
            expect(response.body).property('failed').to.be.an('array').that.has.length(1);
            expect(response.body.failed[0]).to.be.an('object').that.has.all.keys('record', 'validationErrors');
            expect(response.body.failed[0].record).to.be.an('object');
            expect(response.body.failed[0].validationErrors).to.be.an('object').that.has.all.keys('Demonstration');
            expect(response.body.failed[0].validationErrors.Demonstration).to.be.an('object').that.has.all.keys('DemonstrationSkills');
            expect(response.body.failed[0].validationErrors.Demonstration.DemonstrationSkills).to.be.an('array').that.has.length(1);
            expect(response.body.failed[0].validationErrors.Demonstration.DemonstrationSkills[0]).to.be.an('object').that.has.property('TargetLevel', 'TargetLevel cannot be changed on existing records')

        });
    });

    it('Rating remains unchanged after invalid edit', () => {
        cy.request('/cbl/student-tasks/1?format=json&include=Demonstration.DemonstrationSkills').then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('object');
            expect(response.body.data).property('Demonstration').to.be.an('object');
            expect(response.body.data.Demonstration).property('DemonstrationSkills').to.be.an('array').that.has.length(1);
            expect(response.body.data.Demonstration.DemonstrationSkills[0]).to.be.an('object');
            expect(response.body.data.Demonstration.DemonstrationSkills[0]).to.include({
                ID: 1,
                SkillID: 1,
                DemonstratedLevel: 10,
                TargetLevel: 9,
                Override: false
            });
        });
    });
});