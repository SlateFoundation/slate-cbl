StartTest(function (t) {
    t.expectGlobal('FAIL')

    t.it('Monkey should not interact with the target=_blank anchor els', function (t) {
        
        t.chain(
            {
                monkey              : document.body,
                nbrInteractions     : 10
            },
            function() {
                t.notOk(window.FAIL, "No click should be registered")
            }
        )
    });
});
