describe('Event view add step', function (t) {
    t.getHarness([
        'testfiles/601_siesta_ui_passing.t.js'
    ]);

    t.chain(
        { click : '>>[action=toggle-recorder]'},

        { click : ">>[action=recorder-add-step]" },

        function(next) {
            t.expect(t.cq1('recorderpanel').store.getCount()).toEqual(1);

            next()
        },
        { click : "recorderpanel => .x-tree-view" },

        { waitForTarget : 'recorderpanel => .x-grid-cell:contains(click)'}
    );
})