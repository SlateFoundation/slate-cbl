StartTest(function (outer) {

    outer.it("Siesta.Test creation", function (t) {

        t.testGeneric(
            {
                doNotTranslate : true
            },
            function (t) {
                t.diag('Diag message')

                t.pass('Pass description')
                t.fail('Fail description')

                t.ok(true, 'True is ok')
                t.is(null, undefined, 'Null is undefined')

                t.done()
            },
            function (test) {
                t.is(test.results.length, 6, '6 results were created - 5 assertions + 1 summary')

                t.is(test.getAssertionCount(), 4, 'There were 4 assertions')

                t.isaOk(test.results.itemAt(0), Siesta.Result.Diagnostic, 'Very 1st result is a diagnostic message')
                t.isaOk(test.results.itemAt(1), Siesta.Result.Assertion, '2nd results is an assertion')
            }
        )
    })

    outer.it("Siesta.Test should be considered failed if an error happens", function (t) {
        var spy;

        t.testGeneric(
            {
                doNotTranslate  : true,
                transparentEx   : false
            },
            function (subTest) {
                spy = t.spyOn(subTest, 'failWithException').and.callThrough()

                throw 'foo'
            },
            function (test) {
                t.expect(spy).toHaveBeenCalled();
                
                t.notOk(test.isPassed(), 'Test should be failed');

                t.is(test.getAssertionCount(), 1, 'There was 1 assertion')

                t.isaOk(test.results.itemAt(0), Siesta.Result.Assertion, '1st results is an assertion')
            }
        )
    })
    
    
    outer.it("Should be possible to exit the test", function (t) {

        t.testGeneric(
            {
                transparentEx   : false
            },
            function (t) {
                t.exit()
                
                t.fail("fail")
            },
            function (test) {
                t.ok(test.isPassed(), 'Test should be passed');

                t.is(test.getAssertionCount(), 0, 'There`s 0 assertion')
            }
        )
    })
    
    
    outer.it("Should be possible to exit the test from the chain", function (t) {

        t.testGeneric(
            {
                transparentEx   : false
            },
            function (t) {
                t.chain(
                    function (next) {
                        next()
                    },
                    function (next) {
                        t.exit()
                        
                        next()
                    },
                    function (next) {
                        t.pass()
                    }
                )
            },
            function (test) {
                t.ok(test.isPassed(), 'Test should be passed');

                t.is(test.getAssertionCount(), 0, 'There`s 0 assertion')
            }
        )
    })
    
    
    outer.it("Should be possible to exit and mark the test as failed", function (t) {

        t.testGeneric(
            {
                transparentEx   : false,
                doNotTranslate  : true
            },
            function (t) {
                t.chain(
                    function (next) {
                        next()
                    },
                    function (next) {
                        t.exit("failure")
                        
                        next()
                    },
                    function (next) {
                        t.pass()
                    }
                )
            },
            function (test) {
                t.ok(test.isFailed(), 'Test should be failed');

                t.is(test.getAssertionCount(), 1, 'There`s 1 assertion')
            }
        )
    })
})