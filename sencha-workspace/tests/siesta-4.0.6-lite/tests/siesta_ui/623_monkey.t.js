StartTest(function (t) {
    t.chain(
        { waitForCQ : 'viewport' },
        function (next) {
            Ext.Msg.hide();
            next();
        },
        { monkeyTest : '>>viewport', nbrInteractions : 21 }
    );
});