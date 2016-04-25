StartTest(function(t) {
        t.requireOk('SlateTasksTeacher.Application', function() {
        
        var studentsgrid;
        
        t.it('slate-studentsgrid performance tasks that have subtasks should expand and collapse on row click', function(t) {
            
            t.chain(
                { waitForCQ: 'slate-studentsgrid'},
                
                function(next, el) {
                    studentsgrid = el[0];
                    next();
                },
                
                { click: '.slate-studentsgrid-row' },
                
                function(next) {
                    t.hasCls('.slate-studentsgrid-row', 'is-expanded', 'it expanded');
                    next();
                },
                
                { click: '.slate-studentsgrid-row'},
                
                function(next) {
                    t.hasNotCls('.slate-studentsgrid-row', 'is-expanded', 'it collapsed');
                }

            )

        });

    });
});