StartTest(function (t) {

    t.it('Event view', function (t) {
        var view = new Siesta.Recorder.UI.RecorderPanel({
            width        : 400,
            renderTo     : Ext.getBody(),
            test         : t,
            root         : {
                children : [
                    { action : 'click', target : [{ type : 'css', target : '#div' }] },
                    { action : 'waitForMs', value : 1000 },
                    { action : 'fn', value : "Ext.get(div).addCls('black');" }
                ]
            },
            domContainer : {
                highlightTarget : function () {
                },
                startInspection : function () {
                },
                clearHighlight  : function () {
                }
            }
        });

        t.chain(
            { dblclick : "recorderpanel => .siesta-recorderpanel-typecolumn:contains(waitForMs)" },

            { waitForSelectorAtCursor : 'input' },
            { waitFor : 100 },

            { type : "fn" },
            { click : ">>recorderpanel", offset : [10, '100%'] }
        );
    })
})