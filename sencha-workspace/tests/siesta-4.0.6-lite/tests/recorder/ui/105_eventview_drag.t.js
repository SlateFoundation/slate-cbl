StartTest(function (t) {
    t.describe('Function step should work', function (t) {
        document.body.innerHTML = '<div id="div">BAR</div><div id="div2">BAR2</div>'

        var recorderPanel = new Siesta.Recorder.UI.RecorderPanel({
            width    : 600,
            height   : 200,
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
                    {
                        action   : 'drag',
                        target   : [{ type : 'css', target : "#div" }],
                        toTarget : [{ type : 'xy', target : [20, 20] }]
                    }
                ]
            }
        });
        recorderPanel.attachTo(t);

        t.chain(
            { waitForRowsVisible : recorderPanel },

            function () {
                var editing = recorderPanel.editing
                editing.startEdit(0, 2);

                var rec     = recorderPanel.store.first();
                var dragEditorPanel = editing.getActiveEditor().field.getPicker();

                t.isInstanceOf(editing.getActiveEditor().field, Siesta.Recorder.UI.Editor.DragTarget, 'Formpanel found for drag action');

                dragEditorPanel.down('targeteditor[name=target]').setValue('#div2');
                dragEditorPanel.down('textfield[name=by]').setValue('10,11%');

                editing.getActiveEditor().field.applyValues();

                t.isDeeply(rec.getTarget(), { type : 'user', target : '#div2' });
                t.isDeeplyStrict(rec.get('by'), [10, "11%"]);
                t.notOk(rec.get('to'));
            }
        )
    })


    t.it('verify steps', function (t) {
        var drag = new Siesta.Recorder.UI.Model.Action(
            { action : 'drag', target : [{ type : 'css', target : "#div" }], by : [20, 20] }
        );

        var drag2 = new Siesta.Recorder.UI.Model.Action(
            { action : 'drag', target : [{ type : 'css', target : "#div" }], to : [30, 30] }
        );

        t.isDeeply(drag.asStep(),
            {
                action : 'drag',
                target : '#div',
                by     : [20, 20]
            }
        );

        t.isDeeply(drag2.asStep(),
            {
                action : 'drag',
                target : '#div',
                to     : [30, 30]
            }
        )
    });
})