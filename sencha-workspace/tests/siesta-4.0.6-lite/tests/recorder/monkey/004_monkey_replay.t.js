describe('Should be able to successfully replay recorded actions', function (t) {

    // TODO investigate failures
    return;

    var rec = new t.global.Siesta.Recorder.ExtJS({
        window          : t.global,
        ignoreSynthetic : false
    })

    var monkeyActions, monkeyActionsJson;

    t.it('Recording monkeys', function (t) {

        rec.start();

        t.chain(
            { monkeyTest : document.body, nbrInteractions : 10 },

            function (next) {
                monkeyActions     = rec.getRecordedActionsAsSteps();
                monkeyActionsJson = JSON.stringify(monkeyActions);

                rec.getRecordedActions().forEach(function (action) {
                    t.diag(JSON.stringify(action.asStep()));
                });

                rec.stop();
                rec.clear();
                t.waitForPageLoad(next);
                t.global.location.reload();
            }
        );
    })

    t.it('Playback of actions and re-record', function (t) {
        rec.start();

        t.chain(
            t.getSubTest(function (t) {
                t.chain(monkeyActions);
            }),

            function () {
                t.pass('Replay completed successfully');

                t.isDeeply(rec.getRecordedActionsAsSteps(), JSON.parse(monkeyActionsJson), 'Should find same target on replay');

                if (t.getFailedAssertions().length > 0) {
                    t.fail('Replay failed: steps: ' + monkeyActionsJson)
                    "console" in window && console.log(monkeyActionsJson)
                }
            }
        )
    });
});
