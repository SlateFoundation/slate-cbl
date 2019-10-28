describe('/cbl/student-competencies API', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'teacher' user
    beforeEach(() => {
        cy.loginAs('teacher');
    });

    it('Validation prevents TargetLevel changes', () => {

        cy.request('/cbl/student-competencies?format=json').then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array');
            expect(response.body.data).to.have.length(38);
            expect(response.body.data[0]).to.include({
                ID: 38,
                Class: 'Slate\\CBL\\StudentCompetency',
                Created: 1570829655,
                CreatorID: 3,
                StudentID: 4,
                CompetencyID: 7,
                Level: 11,
                EnteredVia: 'graduation',
                BaselineRating: 10
            });

            cy.request('/cbl/student-competencies/1?format=json&include=completion,effectiveDemonstrationsData');
        }).then(response => {
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
                demonstrationsRequired: 12,
                growth: 2
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
                DemonstrationDate: 1570819947
            });

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
            });
        }).then(response => {
            expect(response).property('status').to.eq(200);
            expect(response).property('body').to.be.an('object');
            expect(response.body).property('data').to.be.an('array');
            expect(response.body.data).to.have.length(1);
            expect(response.body.data[0]).property('Demonstration').to.be.an('object');
            expect(response.body.data[0].Demonstration).property('DemonstrationSkills').to.be.an('array');
            expect(response.body.data[0].Demonstration.DemonstrationSkills).to.have.length(1);
            expect(response.body.data[0].Demonstration.DemonstrationSkills[0]).to.be.an('object');
            expect(response.body.data[0].Demonstration.DemonstrationSkills[0]).to.include({
                ID: 1,
                SkillID: 1,
                DemonstratedLevel: 11,
                TargetLevel: 9,
                Override: false,
                Removable: false
            });
        });
    });
});