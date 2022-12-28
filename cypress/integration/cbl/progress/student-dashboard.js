describe('CBL / Progress / Student Dashboard', () => {

    // load sample database before tests
    before(() => {
        cy.resetDatabase();
    });

    // authenticate as 'student' user
    beforeEach(() => {
        cy.loginAs('student2');
        cy.intercept('GET', '/cbl/content-areas?(\\?*)').as('getContentAreas');
    });

    it('View single demonstration rubric as student', () => {

        // open student demonstrations dashboard
        cy.visit('/cbl/dashboards/demonstrations/student');

        // verify student redirect
        cy.location('hash').should('eq', '#me');
        cy.get('.slate-appcontainer-bodyWrap .slate-placeholder')
            .contains('Select a content area to load demonstrations dashboard');

        // click the 'Rubric' selector
        cy.extGet('slate-cbl-contentareaselector')
            .click();

        // wait for options to load
        cy.wait('@getContentAreas');

        // verify and click first element of picker dropdown
        cy.extGet('slate-cbl-contentareaselector', { component: true })
            .then(selector => selector.getPicker().el.dom)
            .contains('.x-boundlist-item', 'Health and Wellness')
            .click();

        // verify content loads
        cy.get('.slate-demonstrations-student-competenciessummary span')
            .contains('Health and Wellness');

        // verify recent progress feed
        cy.get('.slate-tasks-student-recentactivity tbody tr .level-col > div').should('have.length', 17).should(($ratingCells) => {
            expect($ratingCells[0]).to.have.class('cbl-level-9').and.have.descendants('.fa-check');
            expect($ratingCells[1]).to.have.class('cbl-level-9').and.have.descendants('.fa-check');
            expect($ratingCells[2]).to.have.class('cbl-level-9').and.have.descendants('.fa-check');
            expect($ratingCells[3]).to.have.class('cbl-level-9').and.have.descendants('.fa-check');
            expect($ratingCells[4]).to.have.class('cbl-level-9').and.have.descendants('.fa-check');
            expect($ratingCells[5]).to.have.class('cbl-level-9').and.have.text('M');
            expect($ratingCells[6]).to.have.class('cbl-level-9').and.have.text('M');
            expect($ratingCells[7]).to.have.class('cbl-level-9').and.have.text('M');
            expect($ratingCells[8]).to.have.class('cbl-level-9').and.have.text('M');
            expect($ratingCells[9]).to.have.class('cbl-level-9').and.have.text('M');
            expect($ratingCells[10]).to.have.class('cbl-level-9').and.have.descendants('.fa-check');
            expect($ratingCells[11]).to.have.class('cbl-level-9').and.have.descendants('.fa-check');
            expect($ratingCells[12]).to.have.class('cbl-level-9').and.have.text('8');
            expect($ratingCells[13]).to.have.class('cbl-level-9').and.have.text('7');
            expect($ratingCells[14]).to.have.class('cbl-level-9').and.have.text('7');
            expect($ratingCells[15]).to.have.class('cbl-level-9').and.have.text('7');
            expect($ratingCells[16]).to.have.class('cbl-level-9').and.have.text('7');
        });

        // verify skill renderings for HW.1
        cy.get('.slate-demonstrations-student-competencycard[data-competency="12"]').should('have.class', 'cbl-level-9');
        cy.get('.cbl-skill[data-skill="HW.1.1"]').within(() => {
            cy.get('.cbl-skill-complete-indicator').should('have.class', 'is-checked');
            cy.get('.cbl-skill-demo').should('have.length', 2).should(($skillCells) => {
                expect($skillCells[0]).to.have.text('7');
                expect($skillCells[1]).to.have.text('8');
            });
        });
        cy.get('.cbl-skill[data-skill="HW.1.2"').within(() => {
            cy.get('.cbl-skill-complete-indicator').should('have.class', 'is-checked');
            cy.get('.cbl-skill-demo').should('have.length', 2).should(($skillCells) => {
                expect($skillCells[0]).to.have.text('7');
                expect($skillCells[1]).to.have.class('cbl-skill-override')
                    .and.have.attr('title', '[Overridden]')
                    .and.have.descendants('.fa-check');
            });
        });
        cy.get('.cbl-skill[data-skill="HW.1.3"').within(() => {
            cy.get('.cbl-skill-complete-indicator').should('have.class', 'is-checked');
            cy.get('.cbl-skill-demo').should('have.length', 2).should(($skillCells) => {
                expect($skillCells[0]).to.have.text('7');
                expect($skillCells[1]).to.have.class('cbl-skill-override')
                    .and.have.attr('title', '[Overridden]')
                    .and.have.descendants('.fa-check');
            });
        });
        cy.get('.cbl-skill[data-skill="HW.1.4"').within(() => {
            cy.get('.cbl-skill-complete-indicator').should('not.have.class', 'is-checked');
            cy.get('.cbl-skill-demo').should('have.length', 2).should(($skillCells) => {
                expect($skillCells[0]).to.have.text('7');
                expect($skillCells[1]).to.have.class('cbl-skill-demo-empty');
            });
        });

        // verify skill renderings for HW.2
        cy.get('.slate-demonstrations-student-competencycard[data-competency="13"]').should('have.class', 'cbl-level-9');
        cy.get('.cbl-skill[data-skill="HW.2.1"]').within(() => {
            cy.get('.cbl-skill-complete-indicator').should('have.class', 'is-checked');
            cy.get('.cbl-skill-demo').should('have.length', 1).should(($skillCells) => {
                expect($skillCells[0]).to.have.class('cbl-skill-override')
                    .and.have.attr('title', '[Overridden]')
                    .and.have.descendants('.fa-check');
            });
        });
        cy.get('.cbl-skill[data-skill="HW.2.2"').within(() => {
            cy.get('.cbl-skill-complete-indicator').should('have.class', 'is-checked');
            cy.get('.cbl-skill-demo').should('have.length', 1).should(($skillCells) => {
                expect($skillCells[0]).to.have.class('cbl-skill-override')
                    .and.have.attr('title', '[Overridden]')
                    .and.have.descendants('.fa-check');
            });
        });
        cy.get('.cbl-skill[data-skill="HW.2.3"').within(() => {
            cy.get('.cbl-skill-complete-indicator').should('not.have.class', 'is-checked');
            cy.get('.cbl-skill-demo').should('have.length', 2).should(($skillCells) => {
                expect($skillCells[0]).have.class('cbl-skill-demo-missed')
                    .and.have.text('M');
                expect($skillCells[1]).to.have.class('cbl-skill-demo-empty');
            });
        });
        cy.get('.cbl-skill[data-skill="HW.2.4"').within(() => {
            cy.get('.cbl-skill-complete-indicator').should('not.have.class', 'is-checked');
            cy.get('.cbl-skill-demo').should('have.length', 2).should(($skillCells) => {
                expect($skillCells[0]).have.class('cbl-skill-demo-missed')
                    .and.have.text('M');
                expect($skillCells[1]).to.have.class('cbl-skill-demo-empty');
            });
        });
        cy.get('.cbl-skill[data-skill="HW.2.5"').within(() => {
            cy.get('.cbl-skill-complete-indicator').should('not.have.class', 'is-checked');
            cy.get('.cbl-skill-demo').should('have.length', 2).should(($skillCells) => {
                expect($skillCells[0]).have.class('cbl-skill-demo-missed')
                    .and.have.text('M');
                expect($skillCells[1]).to.have.class('cbl-skill-demo-empty');
            });
        });

        // verify skill renderings for HW.3
        cy.get('.slate-demonstrations-student-competencycard[data-competency="14"]').should('have.class', 'cbl-level-9');
        cy.get('.cbl-skill[data-skill="HW.3.1"]').within(() => {
            cy.get('.cbl-skill-complete-indicator').should('have.class', 'is-checked');
            cy.get('.cbl-skill-demo').should('have.length', 1).should(($skillCells) => {
                expect($skillCells[0]).to.have.class('cbl-skill-override')
                    .and.have.attr('title', '[Overridden]')
                    .and.have.descendants('.fa-check');
            });
        });
        cy.get('.cbl-skill[data-skill="HW.3.2"').within(() => {
            cy.get('.cbl-skill-complete-indicator').should('have.class', 'is-checked');
            cy.get('.cbl-skill-demo').should('have.length', 1).should(($skillCells) => {
                expect($skillCells[0]).to.have.class('cbl-skill-override')
                    .and.have.attr('title', '[Overridden]')
                    .and.have.descendants('.fa-check');
            });
        });
        cy.get('.cbl-skill[data-skill="HW.3.3"').within(() => {
            cy.get('.cbl-skill-complete-indicator').should('have.class', 'is-checked');
            cy.get('.cbl-skill-demo').should('have.length', 1).should(($skillCells) => {
                expect($skillCells[0]).to.have.class('cbl-skill-override')
                    .and.have.attr('title', '[Overridden]')
                    .and.have.descendants('.fa-check');
            });
        });
        cy.get('.cbl-skill[data-skill="HW.3.4"').within(() => {
            cy.get('.cbl-skill-complete-indicator').should('not.have.class', 'is-checked');
            cy.get('.cbl-skill-demo').should('have.length', 2).should(($skillCells) => {
                expect($skillCells[0]).to.have.class('cbl-skill-demo-empty');
                expect($skillCells[1]).to.have.class('cbl-skill-demo-empty');
            });
        });
    });
});