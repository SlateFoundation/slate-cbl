StartTest(function(t) {

    // need to use own subscribe function, can't use Ext because of bug
    // can't use jquery because it uses different subscription method (see "simulateEventsWith")
    t.it('Should wait for target before typing', function (t) {
        setTimeout(function() {
            document.body.innerHTML = '<input id="field1" type="text"/>'
        }, 400);

        t.chain(
            { type: 'f', target : '#field1' },

            function (next) {
                t.is(field1.value, "f")
            }
        )
    });
});

