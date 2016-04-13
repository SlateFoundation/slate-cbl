StartTest(function (t) {
    var harness = t.getHarness(
        {
            viewDOM : false
        },
        [
            'testfiles/601_siesta_ui_passing.t.js'
        ]
    );

    var vp          = Siesta.Harness.Browser.UI.Viewport.prototype;
    var rerunHotKey = Harness.rerunHotKey;

    t.it('Should rerun test on special hotkey', function (t) {
        t.chain(
            { waitForRowsVisible : 'testgrid' },

            function(next) {
                var grid = t.cq1('testgrid');

                grid.selectTestFile(grid.store.getRoot().firstChild);
                next()
            },

            { type : rerunHotKey, target : 'body', options : { ctrlKey : true } },

            { waitForEvent : [ harness, 'testsuiteend'] },

            { type : rerunHotKey, target : 'body', options : { ctrlKey : true } },

            { waitForEvent : [ harness, 'testsuiteend'] }
        );
    });

    t.it('Should not rerun test without CTRL', function (t) {
        t.wontFire(harness, 'testsuitestart');

        t.chain(
            { waitForCQ : 'viewport' },

            { type : rerunHotKey, target : 'body'}
        );
    });
})
