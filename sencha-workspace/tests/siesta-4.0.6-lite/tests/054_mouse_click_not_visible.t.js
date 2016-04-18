StartTest(function(topTest) {
    
    topTest.testExtJS({
        doNotTranslate  : true,
        defaultTimeout  : 300,
        waitForTimeout  : 300
    },function (t) {

        Ext.getBody().appendChild(Ext.DomHelper.createDom({
            id          : 'test',
            style       : 'display:none',
            text        : 'some content'
        }))

        t.chain(
            {
                action      : 'click',
                target      : '#test'
            }
        )
    }, function (test) {

        topTest.is(test.getAssertionCount(), 2, "Failed waitForElementVisible and 1 failed chain step due to timeout")
        
        topTest.notok(test.results.itemAt(1).isPassed(), "And this result is a failing assertion")

        topTest.it('child test assertions', function(t) {

            for (var i = 0; i < test.results.children.length; i++) {
                topTest.diag(test.results.children[i])
            }
        })
    });
});

