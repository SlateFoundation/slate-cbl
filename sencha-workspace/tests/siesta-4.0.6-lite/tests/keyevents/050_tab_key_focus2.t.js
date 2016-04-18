StartTest(function(t) {
    if ($.browser.msie) t.isTodo = true
    
    // see https://code.google.com/p/selenium/issues/detail?id=4801
    // also https://support.saucelabs.com/customer/en/portal/private/cases/31771
    var isFocused       = $.browser.safari && t.harness.isAutomated 
            ? 
        function (sel) { return $(sel)[ 0 ] == document.activeElement } 
            : 
        function (sel) { return $(sel).is(":focus") }
    
    t.testBrowser(function (t) {
        document.body.innerHTML = 
            '<input tabindex=3 id="one" type="text" value="one">' + 
            '<input tabindex=2 id="two" type="password" value="two">' + 
            '<textarea tabindex=1 id="three">three</textarea>' + 
            '<input id="four" value="four">'

        t.chain(
            { waitFor : 500 },
            
            function(next) {
                t.focus($('#three')[ 0 ])
                t.ok(isFocused("#three"), 'Field 3 focused');
                next();
            },
            
            { type  : '[TAB]' },

            function(next) {
                t.ok(isFocused("#two"), 'Field 2 focused');
                next();
            },
            
            { type  : '[TAB]' },
            
            function(next) {
                t.ok(isFocused("#one"), 'Field 1 focused');
                next();
            },
            
            { type  : '[TAB]' },

            function(next) {
                t.ok(isFocused("#four"), 'Field 4 focused');
                next();
            },
            
            { type  : '[TAB]' },
            
            function(next) {
                t.notOk(isFocused("#one"), 'Field 1 not focused');
                t.notOk(isFocused("#two"), 'Field 2 not focused');
                t.notOk(isFocused("#three"), 'Field 3 not focused');
                t.notOk(isFocused("#four"), 'Field 4 not focused');

                t.is(document.activeElement, document.body, 'Body focused');
            }
        )
    });
});

