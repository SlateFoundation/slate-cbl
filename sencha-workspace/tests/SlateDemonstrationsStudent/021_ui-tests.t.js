StartTest(function(t) {
    t.requireOk('SlateDemonstrationsStudent.Application', function() {
        
        var overviewWindow;      
        
        t.it('Should render student-dashboard and have clickable UI under competency panel', function(t) {
            t.chain(
                { waitForCQ: 'slate-cbl-student-competencycard' },
                
                { click: '.cbl-skill-demo'},
                
                { waitForCQ: 'slate-cbl-student-skill-overviewwindow' },
                
                function(next, el) {
                    overviewWindow = el[0];
                    t.ok(overviewWindow, 'Overviewwindow is here');
                    next();
                },
                
                { click: 'combobox => .x-form-trigger' },
                
                { click: 'li.x-boundlist-item:contains("Assess point of view")' },
                
                function(next) {
                    t.contentLike(overviewWindow, 'I can assess how point of view or purpose shapes the content and style of a text.', 'Clicking combo item changes data in window');
                    next();
                },
                
                { click: '.x-tool-close'},
                
                { waitForComponentNotVisible: function() {
                    return [overviewWindow, function(el) {
                      t.destroysOk(el, 'window was closed');  
                    }]
                }}
            )
        })

    });
});