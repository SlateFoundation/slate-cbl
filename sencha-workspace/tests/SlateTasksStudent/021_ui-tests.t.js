StartTest(function(t) {
        t.requireOk('SlateTasksStudent.Application', function() {
        
        var tasktree, todolist;
        
        t.it('slate-tasktree tasks that have subtasks should expand and collapse on tab click', function(t) {
            
            t.chain(
                { waitForCQ: 'slate-tasktree'},
                
                function(next, el) {
                    tasktree = el[0];
                    next();
                },
                
                { click: '.slate-tasktree-nub.is-clickable' },
                
                function(next) {
                    t.hasCls('.slate-tasktree-item.has-subtasks', 'is-expanded', 'it expanded');
                    next();
                },
                
                { click: '.slate-tasktree-nub.is-clickable'},
                
                function(next) {
                    t.hasNotCls('.slate-tasktree-item.has-subtasks', 'is-expanded', 'it collapsed');
                }

            )

        });
        
        t.it('slate-tasktree combobox should be clickable', function(t) {

            t.chain(
                {
                    action: 'click',
                    target: '.x-form-trigger-default'
                }
            )

        });
        
        t.it('slate-todolist checkbox should be clickable', function(t) {
            
            t.chain(
                { waitForCQ: 'slate-todolist'},
                
                function(next, el) {
                    todolist = el[0];
                    next();
                },
                
                { click: '.slate-todolist-item-checkbox' }

            )

        });

    });
});