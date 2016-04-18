describe('If mousedown changes the target, the resulting "merged" click action should still target mousedown target', function (t) {


    document.body.innerHTML = '<div id="foo" style="width:100px;height:100px;position:absolute;top:0;left:0;background:#777"><div id="bar" style="display:none;width:100px;height:100px;position:absolute;top:0;left:0;background: #F00;"></div></div>'
    var rec                 = new Siesta.Recorder.ExtJS({
        window          : t.global,
        ignoreSynthetic : false
    })

    rec.start();

    $('#foo')[0].addEventListener('mousedown', function () {
        $('#bar')[0].style.display = 'block';
    })

    t.chain(
        { click : '#foo' },

        function () {
            var actions = rec.getRecordedActions();

            t.is(actions.length, 1);
            t.is(actions[0].action, 'click');
            t.isDeeply(actions[0].getTarget(), { type : 'css', target : '#foo', offset : [50, 50] });

            rec.stop();
        }
    )

})
