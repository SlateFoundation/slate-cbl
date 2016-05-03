StartTest(function(t) {
    t.requireOk('SlateTasksTeacher.Application', function() {
        
        var studentsgrid, 
            gridlegend,
            data,
            students,
            rows;
        
        t.it('Should render slate-studentsgrid along with it\'s contents', function(t) {
            
            t.chain(
                { waitForCQ: 'slate-studentsgrid'},
                
                function(next, el) {
                    studentsgrid = el[0],
                    data = studentsgrid.getData(),
                    students = data.students,
                    rows = data.rows;
                    next();
                },
                
                function(next) {
                    t.ok(studentsgrid, 'slate-studentsgrid is rendered');
                    t.ok(studentsgrid.getData(), 'studentsgrid data is here');
                    
                    t.is(Ext.isObject(data), true, 'studentsgrid.getData() returns an object');
                    t.is(Ext.isArray(students), true, 'data.students is an array');
                    t.is(Ext.isArray(rows), true, 'data.rows is an array');
                    
                    t.selectorCountIs('.slate-studentsgrid-colheader', studentsgrid, 22, "There are 21 columns");
                    t.selectorCountIs('.slate-studentsgrid-rowheader', studentsgrid, 5, "There are 5 rows");
                }
            )

        });
        
        t.it('Should render slate-gridlegend along with it\'s contents', function(t) {
            
            t.chain(
                { waitForCQ: 'slate-gridlegend'},
                
                function(next, el) {
                    gridlegend = el[0];
                    next();
                },
                
                function() {
                    t.ok(gridlegend, 'slate-gridlegend is rendered');
                }
            )

        });

    });
});