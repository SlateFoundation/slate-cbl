describe('We should force recording exact offset if clicked target cannot be resolved by using center point', function (t) {

    t.it('basic html', function (t) {
        t.$('body').html(
            '<div id="behind" style="background:#aaa;position:absolute;top:30px;left:30px;height:50px;width:50px"></div>' +
            '<div id="front"  style="background:#000;position:absolute;top:30px;left:30px;height:40px;width:40px;z-index:2"></div>'
        );

        var rec = new Siesta.Recorder.ExtJS({
            window          : t.global,
            ignoreSynthetic : false,
            recordOffsets   : false
        })

        rec.start();

        t.chain(
            { click : '#behind', offset : [45, 45] },

            function (next) {
                var actions = rec.getRecordedActions();

                t.is(actions.length, 1);
                t.is(actions[0].action, 'click');
                t.isDeeply(actions[0].getTarget(), { type : 'css', target : '#behind', offset : [45, 45] });

                rec.stop();
            }
        )
    });

    t.it('Ext component', function (t) {
        document.body.innerHTML = '<div id="front" style="background:#000;position:absolute;top:10px;left:0;height:40px;width:140px;z-index:2"></div>';
        new Ext.Button({
            renderTo : document.body,
            text     : 'clickme'
        });

        var rec                 = new Siesta.Recorder.ExtJS({
            window          : t.global,
            ignoreSynthetic : false,
            recordOffsets   : false
        })

        rec.start();

        t.chain(
            { click : '>>button[text=clickme]', offset : [10, 5] },

            function (next) {
                var actions = rec.getRecordedActions();

                t.is(actions.length, 1);
                t.is(actions[0].action, 'click');
                t.isDeeply(actions[0].getTarget(), { type : 'cq', target : 'button[text=clickme]', offset : [10, 5] });

                rec.stop();
            }
        )
    });
});
