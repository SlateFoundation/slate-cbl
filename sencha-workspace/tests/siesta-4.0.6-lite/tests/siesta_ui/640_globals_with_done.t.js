StartTest(function (t) {
    t.getHarness(
        {
            needDone                : true,
            autoCheckGlobals        : true
        },
        [
            'testfiles/640_globals_with_done.t.js'
        ]
    );

    t.chain(
        { waitFor : 'rowsVisible', args : 'testgrid' },

        function(next) {
            var store       = t.cq1('testgrid').store;
            var testRecord  = store.getNodeById('testfiles/640_globals_with_done.t.js');

            t.waitForHarnessEvent('testsuiteend', function() {
                t.ok(testRecord.get('test').isFailed(), 'Should find failed tests because of unexpected global');
            });
            
            Harness.launch([ testRecord.get('descriptor') ]);
        }
    );
})
