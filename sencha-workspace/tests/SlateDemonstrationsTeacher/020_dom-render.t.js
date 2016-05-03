StartTest(function(t) {
    t.requireOk('SlateDemonstrationsTeacher.Application', function() {
        
        var teacherDashboard, studentsProgressGrid;
        
        t.it('Should render the student progress grid along with it\'s contents', function(t) {
            t.chain(
                { waitForCQ: 'slate-demonstrations-teacher-studentsprogressgrid'},
                
                function(next, el) {
                    studentsProgressGrid = el[0];
                    next();
                },
                
                function(next) {
                    t.selectorCountIs('th.cbl-grid-competency-name', studentsProgressGrid, 8, 'There are 8 competency rows');
                    t.selectorCountIs('th.cbl-grid-student-name', studentsProgressGrid, 20, 'There are 20 student columns');
                }
            )

        })
        
        t.it('Should render slate-cbl-student-dashboard', function(t) {
            t.chain(
                { waitForCQ : 'slate-demonstrations-teacher-dashboard' },
                
                function(next, el) {
                    teacherDashboard = el[0];
                }
            )

        })

    });
});