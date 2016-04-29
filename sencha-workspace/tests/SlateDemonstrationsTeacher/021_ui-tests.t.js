StartTest(function(t) {
    t.requireOk('SlateDemonstrationsTeacher.Application', function() {
        
        var studentsProgressGrid;  
        
        t.it('Should have expandable rows on row click', function(t) {
            t.chain(
                { waitForCQ: 'slate-demonstrations-teacher-studentsprogressgrid'},
                
                { click: 'th.cbl-grid-competency-name'},
                
                function(next) {
                    t.hasCls('tr.cbl-grid-skills-row', 'is-expanded', 'The row expanded');
                    next();
                },
                
                { click: 'th.cbl-grid-competency-name' },
                
                function(next) {
                    t.hasNotCls('tr.cbl-grid-skills-row', 'is-expanded', 'The row collapsed');
                }
            )

        })
        
        t.it('Should open up overview window on individual cell click', function(t) {
            t.chain(
                { click: 'th.cbl-grid-competency-name'},
                
                { click: 'li.cbl-grid-demo.cbl-grid-demo-empty' },
                
                { waitForCQ: 'slate-cbl-teacher-skill-overviewwindow' }
            )
        })

    });
});