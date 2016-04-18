describe('Play single step', function (t) {
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

        function(next) {
            // Do not ignore recording synthetic events
            t.cq1('>>recorderpanel').getRecorder().ignoreSynthetic = false;

            next()
        },

        { click : ">>recorderpanel button[action=recorder-start]" },

        { click : "iframe -> button" },

        { waitForSelector : '.x-grid-cell:contains(.someclass)'},

        { click : ">>recorderpanel button[action=recorder-stop]" },

        { waitForEvent : ['iframe -> button', 'click'], trigger : { click : "recorderpanel => .icon-play-row" }},
        { waitForEvent : ['iframe -> button', 'click'], trigger : { click : "recorderpanel => .icon-play-from-row" }},

        { click : "recorderpanel => .icon-delete-row" },

        { waitForSelectorNotFound : '.x-grid-cell:contains(.someclass)'}
    );
})