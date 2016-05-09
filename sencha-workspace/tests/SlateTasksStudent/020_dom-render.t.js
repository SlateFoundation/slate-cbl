StartTest(function(t) {
    t.requireOk('SlateTasksStudent.Application', function() {
        
        var tasktree, todolist;
        
        t.it('Should render slate-tasktree along with it\'s contents', function(t) {
            
            t.chain(
                { waitForCQ: 'slate-tasktree'},
                
                function(next, el) {
                    tasktree = el[0];
                    next();
                },
                
                function(next) {
                    t.ok(tasktree, 'slate-tasktree panel is rendered');
                    t.selectorCountIs('.slate-tasktree-list', tasktree, 1, "There is 1 slate-tasktree-list");
                    t.selectorCountIs('.slate-tasktree-item', tasktree, 10, "There are 10 slate-tasktree-items");
                    t.contentLike(tasktree, 'Gravity Lab Report', '\'Gravity Lab Report\' task is there');
                }
            )

        })
        
        t.it('Should render slate-todolist along with it\'s contents', function(t) {
            
            t.chain(
                { waitForCQ: 'slate-todolist'},
                
                function(next, el) {
                    todolist = el[0];
                    next();
                },
                
                function() {
                    t.ok(todolist, 'slate-todolist panel is rendered');
                    t.selectorCountIs('.slate-todolist-list', todolist, 2, "There are 2 slate-todolist-list");
                    t.selectorCountIs('.slate-todolist-item', todolist, 7, "There are 7 slate-todolist-items");
                    t.contentLike(todolist, 'Research internships and apply', '\'Research internships and apply\' task is there');
                }
            )

        })

    });
});