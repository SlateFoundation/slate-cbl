const csvtojson = require('csvtojson');

describe('CBL / Exports / Ratings', () => {
    let exportedRows;

    before(() => {
        cy.resetDatabase();
    });

    it('Download data from CSV export endpoint', () => {
        cy.loginAs('admin');

        cy.request({
            url: '/exports/slate-cbl/demonstrations',
            qs: {
                students: 'group:class_of_2020'
            }
        }).then(({ headers, body }) => {
            expect(headers).to.have.property('content-type', 'text/csv; charset=utf-8');
            return csvtojson().fromString(body);
        }).then(rows => {
            expect(rows).to.be.an('array').and.have.length(566);

            // save to variable declared in global scope of suite
            exportedRows = rows;
        });
    });

    it('Has expected column headers', () => {
        expect(exportedRows[0]).to.be.an('object').and.have.all.keys(
            'Demonstration Skill ID',
            'Demonstration ID',
            'Student Task ID',
            'Teacher ID',
            'Teacher Username',
            'Teacher Name',
            'StudentID',
            'Student Number',
            'Student Username',
            'Student Name',
            'Experience Type',
            'Course Code',
            'Section Code',
            'Experience Name',
            'Task Title',
            'Artifact URL',
            'Competency',
            'Skill',
            'Created',
            'Modified',
            'Rating',
            'Portfolio',
            'Term Title',
            'Term Handle'
        );
    });

    it('Has expected counts of different ratings and portfolios', () => {
        const ratingsCount = {}, portfoliosCount = {};

        for (const row of exportedRows) {
            // count rating
            if (!(row['Rating'] in ratingsCount)) {
                ratingsCount[row['Rating']] = 0;
            }

            ratingsCount[row['Rating']]++;

            // count portfolio
            if (!(row['Portfolio'] in portfoliosCount)) {
                portfoliosCount[row['Portfolio']] = 0;
            }

            portfoliosCount[row['Portfolio']]++;
        }

        expect(ratingsCount).to.contain({
            '1': 4,
            '4': 1,
            '5': 17,
            '6': 59,
            '7': 73,
            '8': 63,
            '9': 116,
            '10': 62,
            '11': 44,
            '12': 4,
            'M': 89,
            'O': 34
        });

        expect(portfoliosCount).to.contain({
            '9': 348,
            '10': 120,
            '11': 98
        });
    });
});
