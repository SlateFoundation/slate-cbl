describe('Drag tests', function (t) {


    t.it('Dragging < 3px should not count as drag, if mouseup el is or is within mousedown el', function (t) {
        document.body.innerHTML = '<div id="foo" style="width:10px;height:10px;position:absolute;top:0;left:0">bar</div>'
        var rec = new Siesta.Recorder.ExtJS({
            window          : t.global,
            ignoreSynthetic : false,
            recordOffsets   : false
        })

        rec.start();

        t.chain(
            { drag : [1, 1], to : [4, 4] },

            function () {
                var actions = rec.getRecordedActions();

                t.is(actions.length, 1);
                t.is(actions[0].action, 'click');
                t.isDeeply(actions[0].getTarget(), { type : 'css', target : '#foo', offset : t.any() });

                rec.stop();
            }
        )
    })


})
