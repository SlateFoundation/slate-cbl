StartTest(function (outerTest) {

    outerTest.chain(
        function (NEXT) {
//    Lets say you have a 100x100 div1 (with overflow: hidden), inside of that div, you have 100x500 div2.
//    User tries to click on the div2. Siesta will try to click in the center of the div2,
//    which will be outside of the div1 and truncated by it. Test should wait and fail.
//    https://www.assembla.com/spaces/bryntum/tickets/1239#/activity/ticket:
            var flag;

            outerTest.testExtJS(
                {
                    doNotTranslate : true,
                    waitForTimeout : 300,
                    defaultTimeout : 300
                },
                function (t) {
                    t.it('Clicking in a hidden area of an element should fail the test after waiting', function (t) {
                        document.body.innerHTML =
                            '<div style="border:1px solid #ddd;width:100px;height:100px;overflow:hidden">' +
                            '<div style="width:500px;height:100px" id="inner">FOO</div>' +
                            '</div>';


                        outerTest.isntCalled('simulateMouseClick', t, 'The actual click method is not called')

                        t.chain(
                            { click : '#inner', offset : [101, 90] },

                            function () {
                                flag = true;
                            }
                        );
                    });
                },
                function (t) {
                    outerTest.notOk(t.isPassed(), 'Test marked as failed')
                    outerTest.notOk(flag, 'chain stopped at the click action')

                    NEXT()
                }
            );
        },
        function (NEXT) {

            outerTest.testExtJS(function (t) {

                t.it('Intentionally clicking outside an element should NOT issue a warning', function (t) {
                    var counter = 0

                    document.body.innerHTML =
                        '<div id="clickel" style="margin:10px;width:100px;height:100px;background:gray"></div>';

                    t.firesOk(document.body, 'click', 2)
                    t.wontFire(document.getElementById('clickel'), 'click')
                    t.isntCalled('warn', t);

                    t.chain(
                        { click : '#clickel', offset : ["100%+1", "100%"] },
                        { click : '#clickel', offset : [-5, "100%"] },

                        NEXT()
                    );
                });
            });
        }
    )
});

