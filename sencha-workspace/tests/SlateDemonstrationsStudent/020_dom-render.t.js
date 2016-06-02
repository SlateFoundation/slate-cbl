StartTest(function(t) {
    t.requireOk('SlateDemonstrationsStudent.Application', function() {
        
        var recentProgressPanel, studentDashboard, competencyCards;
        
        t.it('Should render the recent progress panel along with it\'s contents', function(t) {
            t.chain(
                { waitForCQ: 'slate-demonstrations-student-recentprogress' },
                
                function(next, el) {
                    recentProgressPanel = el[0],
                    next();
                },
                
                { waitForMs: 2000 },
                
                function(next) {
                    t.ok(recentProgressPanel, 'slate-demonstrations-student-recentprogress is here');
                    t.is(recentProgressPanel.loadStatus, 'loaded', 'Progress loaded');
                    t.selectorCountIs('td.scoring-domain-col', recentProgressPanel, 10, 'There are 10 columns for scoring domains');
                    t.selectorCountIs('td.level-col', recentProgressPanel, 10, 'There are 10 columns for levels');
                }
            )
        })
        
        t.it('Should render slate-demonstrations-student-dashboard', function(t) {
            t.chain(
                { waitForCQ : 'slate-demonstrations-student-dashboard' },
                
                function(next, el) {
                    studentDashboard = el[0];
                    next();
                },
                
                { waitForCQ: 'slate-demonstrations-student-competencycard' },
                
                function(next, el) {
                    competencyCards = el;
                    next();  
                },
                
                function(next) {
                    t.ok(studentDashboard, 'slate-demonstrations-student-dashboard is here');
                    t.is(competencyCards.length, 8, 'There are 8 competency panels');
                    t.is(studentDashboard.competenciesStatus, 'loaded', 'Competencies loaded');
                }
            )
        })

    });
});