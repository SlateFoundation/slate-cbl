describe('Admin login test', () => {

    // reset database before tests
    before(() => {
        const studioContainer = Cypress.env('STUDIO_CONTAINER');

        if (studioContainer) {
            cy.exec(`echo 'DROP DATABASE IF EXISTS \`default\`;' | docker exec -i ${studioContainer} hab pkg exec core/mysql mysql -u root -h 127.0.0.1`);
        }
    });

    it('Register and set up profile', () => {
        cy.visit('/register');

        cy.focused()
            .should('have.attr', 'name', 'FirstName')
            .type('Fname')
            .tab()
        ;

        cy.focused()
            .should('have.attr', 'name', 'LastName')
            .type('Lname')
            .tab()
        ;

        cy.focused()
            .should('have.attr', 'name', 'Email')
            .type('email@example.org')
            .tab()
        ;

        cy.focused()
            .should('have.attr', 'name', 'Username')
            .type('zerocool')
            .tab()
        ;

        cy.focused()
            .should('have.attr', 'name', 'Password')
            .type('password123')
            .tab()
        ;

        cy.focused()
            .should('have.attr', 'name', 'PasswordConfirm')
            .type('password1234{enter}')
        ;

        cy.location('pathname').should('eq', '/register');

        cy.get('.error');

        cy.focused()
            .should('have.attr', 'name', 'FirstName')
            .tab()
            .tab()
            .tab()
            .tab()
            .tab()
            .type('password123{enter}')
        ;

        cy.contains('Fill out your profile').click();

        // upload same photo twice
        cy.upload_file('photo.jpg', 'image/jpeg', 'input[type=file]');
        cy.contains('Upload New Photo').click();
        cy.upload_file('photo.jpg', 'image/jpeg', 'input[type=file]');
        cy.contains('Upload New Photo').click();

        cy.get('.available-photos .photo-item').first()
            .should('have.class', 'current')
            .next('.photo-item')
            .should('not.have.class', 'current')
                .find('a')
                    .should('have.attr', 'title', 'Make Default')
                .click()
        ;

        cy.get('.available-photos .photo-item').first()
            .should('not.have.class', 'current')
            .find('a')
                .should('have.attr', 'title', 'Make Default')
            .parents('.photo-item')
            .next('.photo-item')
                .should('have.class', 'current')
                .find('img')
                    .should('have.attr', 'src', '/thumbnail/2/96x96/cropped')
                    .should('have.prop', 'width', 48)
                    .should('have.prop', 'height', 48)
        ;

        // edit profile
        cy.get('input[name=Location]')
            .type('Philadelphia, PA')
            .tab()
        ;

        cy.focused()
            .should('have.attr', 'name', 'About')
            .type('Meow')
            .tab()
        ;

        cy.focused()
        .should('contain', 'Markdown')
            // Update Template?
            // .should('have.attr', 'target', '_blank')
            .tab()
        ;

        cy.focused()
            .should('contain', 'Save Profile')
            .tab()
        ;

        cy.focused()
            .should('have.attr', 'name', 'Email')
            .type('email@example.com')
            .tab()
        ;

        cy.focused()
            .should('have.attr', 'name', 'Phone')
            .type('(123) 456-7890{enter}')
        ;

        cy.location('pathname').should('eq', '/profile');
        cy.location('search').should('eq', '?status=saved');

        // verify profile display page
        cy.visit('/profile/view');
        cy.location('pathname').should('eq', '/people/zerocool');
        cy.get('.header-title').should('contain', 'Fname Lname');
        cy.get('.display-photo-link').should('have.attr', 'href', '/media/open/2');
        cy.get('.about-bio').should('contain', 'Meow');

        // verify profile API data
        cy.request('/profile?format=json').its('body.data').then(data => {
            expect(data).to.have.property('ID', 1);
            expect(data).to.have.property('Class', 'Emergence\\People\\User');
            expect(data).to.have.property('FirstName', 'Fname');
            expect(data).to.have.property('LastName', 'Lname');
            expect(data).to.have.property('Location', 'Philadelphia, PA');
            expect(data).to.have.property('About', 'Meow');
            expect(data).to.have.property('PrimaryPhotoID', 2);
            expect(data).to.have.property('Username', 'zerocool');
            expect(data).to.have.property('AccountLevel', 'User');
        });
    });
});