StartTest(function(t) {
    t.like(t.originalSetTimeout.toString(), 'native code', "2nd and subsequent tests in the shared sandbox group should have native `seTimeout` set as `originalSetTimeout`") 
})