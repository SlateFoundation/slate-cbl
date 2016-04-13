describe('Recorded event model', function (t) {

    t.it('Should parse offsets correctly', function (t) {
        var model = new Siesta.Recorder.UI.Model.Action({
            offset : ''
        })

        t.isDeeply(model.parseOffset('10,10'), [10, 10]);
        t.isDeeply(model.parseOffset('10%,10'), ["10%", 10]);
        t.isDeeply(model.parseOffset('10,10%'), [10, "10%"]);
        t.isDeeply(model.parseOffset('10%,10%'), ["10%", "10%"]);
        t.isDeeply(model.parseOffset('10%-30,10%+4'), ["10%-30", "10%+4"]);
    })

    t.it('Should generate correct click step', function (t) {

        var model = new Siesta.Recorder.UI.Model.Action({
            action : 'click',
            target : [
                {
                    type   : 'css',
                    target : "body",
                    offset : [5, 5]
                }
            ]
        });

        t.isDeeply(model.asStep(), {
            action : 'click',
            target : "body",
            offset : [5, 5]
        })
    });

    t.it('Should generate correct type step', function (t) {

        var model = new Siesta.Recorder.UI.Model.Action({
            action : 'type',
            value  : 'thetext',
            target : [
                {
                    type   : 'css',
                    target : "body"
                }
            ]
        });

        t.isDeeply(model.asStep(), {
            action : 'type',
            text   : 'thetext'
        })
    });

    t.it('Should generate correct waitForMs step', function (t) {

        var model = new Siesta.Recorder.UI.Model.Action({
            action : 'waitForMs',
            value  : 100
        });

        t.isDeeply(model.asStep(), {
            waitForMs : 100
        })
    });

    t.it('Should generate correct moveCursor step', function (t) {

        var model = new Siesta.Recorder.UI.Model.Action({
            action : 'moveCursorTo',
            target : [
                {
                    type   : 'xy',
                    target : [10, 20]
                }
            ]
        });

        t.isDeeply(model.asStep(), {
            action : 'moveCursorTo',
            target     : [10, 20]
        });
    });
    t.it('Should generate correct screenshot step', function (t) {

        var model = new Siesta.Recorder.UI.Model.Action({
            action : 'screenshot',
            value  : 'filename'
        });

        t.isDeeply(model.asStep(), {
            screenshot : 'filename'
        });
    });
})