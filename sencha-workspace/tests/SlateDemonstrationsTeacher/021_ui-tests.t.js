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
                
                { waitForCQ: 'slate-cbl-teacher-skill-overviewwindow' },
                
                function(next, el) {
                  overviewWindow = el[0];
                  t.ok(overviewWindow, 'Overviewwindow is here');  
                  next();
                },
                
                { click: 'combobox => .x-form-trigger'},
                
                { click: 'li.x-boundlist-item:contains("Conducting Research")' },
                
                { click: 'li.x-boundlist-item:contains("Manage the research process")' },
                
                function(next) {
                    t.contentLike(overviewWindow, 'I can establish and implement my own work plan for completing my research in a timely manner.', 'Clicking combo item changes data in window');
                }
            )
        })

    });
});