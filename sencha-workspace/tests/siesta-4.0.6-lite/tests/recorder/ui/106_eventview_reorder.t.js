StartTest(function (t) {

    t.it('Re-ordering of steps should work', function (t) {
        var recorderPanel = new Siesta.Recorder.UI.RecorderPanel({
            width    : 600,
            height   : 300,
            renderTo : document.body,

            domContainer : {
                highlightTarget : function () {
                },
                startInspection : function () {
                },
                clearHighlight  : function () {
                }
            },

            root : {
                children : [
                    { action : 'drag', target : [{ type : 'css', target : "#div" }], by : [20, 20] },
                    { action : 'click', target : [{ type : 'css', target : "#div" }] }
                ]
            }
        });
        recorderPanel.attachTo(t);

        t.chain(
            { waitForRowsVisible : recorderPanel},
            {
                drag     : '.x-grid-cell:contains(drag)',
                to       : '.x-grid-cell:contains(click)',
                toOffset : ['50%', '80%']
            },

            function () {
                var rec = recorderPanel.store.first();

                t.is(rec.get('action'), 'click', 'Re-ordering happened correctly');
            }
        )
    })
})