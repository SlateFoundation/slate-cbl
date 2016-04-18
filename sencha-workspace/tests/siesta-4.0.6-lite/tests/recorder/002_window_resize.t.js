describe('Recorder monkey tests', function (t) {

    var rec = new Siesta.Recorder.ExtJS({
        window          : t.global
    })

    rec.start();

    t.waitForEvent(rec, 'actionadd', function() {
        var actions = rec.getRecordedActions();

        t.expect(actions.length).toBe(1);
        t.expect(actions[0].action).toBe('setWindowSize');
        t.isDeeply(actions[0].value, [200, 300]);
    })

    t.setWindowSize(200, 300);

})