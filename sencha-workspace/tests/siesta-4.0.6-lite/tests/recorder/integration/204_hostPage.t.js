describe('Using host page when recording then playing test back', function (t) {
    t.expectGlobal("0")
    
    t.getHarness([
        {
            hostPageUrl : '../testpages/testpage1.html',
            url         : 'testfiles/601_siesta_ui_passing.t.js'
        }
    ]);

    t.chain(
        { dblclick : "testgrid => table.x-grid-item:nth-child(1) .x-grid-cell:nth-child(2)" },

        { click : ">>button[action=toggle-recorder]" },

        function (next) {
            // Do not ignore recording synthetic events
            t.cq1('>>recorderpanel').getRecorder().ignoreSynthetic = false;

            next()
        },

        { click : ">>recorderpanel button[action=recorder-start]" },

        { click : "iframe -> button" },

        { click : ">>recorderpanel button[action=recorder-play]" },

        { waitForEvent : [ Harness, 'testsuiteend' ]},

        function() {
            // View should still have one record in it
            t.expect(t.cq1('>>recorderpanel').store.getCount()).toBe(1);
        }
    );
})