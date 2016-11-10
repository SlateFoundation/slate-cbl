describe('Recorder monkey tests', function (t) {

    rec = new Siesta.Recorder.ExtJS({
        window          : t.global,
        ignoreSynthetic : false
    })

    rec.start();

    t.monkeyTest(document.body, 20);
})