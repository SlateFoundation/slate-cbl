StartTest(function (t) {
    if (!('ErrorEvent' in window)) return
    
    t.getHarness(
        {
            viewDOM                     : false,
            failOnResourceLoadError     : true
        },
        [
            'testfiles/630_fail_for_404.t.js'
        ]
    );

    t.chain(
        { waitFor : 'rowsVisible', args : 'testgrid' },

        function(next) {
            var store       = t.cq1('testgrid').store;
            var testRecord  = store.getNodeById('testfiles/630_fail_for_404.t.js');

            t.waitForHarnessEvent('testsuiteend', function() {
                t.ok(testRecord.get('test').isFailed(), 'Should find failed tests if there is a missing preload');
            });
            
            Harness.launch([ testRecord.get('descriptor') ]);
        }
    );
})
