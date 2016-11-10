StartTest(function (topTest) {
    var log     = []
    
    topTest.testGeneric({ doNotTranslate : true }, function (t) {
        
        t.beforeEach(function (t) {
            log.push(t)
        })
        
        t.beforeEach(function (t) {
            log.push(t)
        })
        
        t.afterEach(function (t) {
            log.push(t)
        })
        
        t.afterEach(function (t) {
            log.push(t)
        })
        
        t.it("Root->Spec1", function (t) {
            log.push(t)
            
            t.beforeEach(function (t) {
                log.push(t)
            })
            
            t.afterEach(function (t) {
                log.push(t)
            })
            
            t.it('Root->Spec1->Spec11', function (t) {
                log.push(t)
            })
        })
        
    }, function () {
//                    'SpecRoot-beforeEach1',
//                    'SpecRoot-beforeEach2',
//                    'Root->Spec1',
//                        'SpecRoot-beforeEach1',
//                        'SpecRoot-beforeEach2',
//                        'Spec1-beforeEach',
//                        'Root->Spec1->Spec11',
//                        'Spec1-afterEach',
//                        'SpecRoot-afterEach2',
//                        'SpecRoot-afterEach',
//                    'SpecRoot-afterEach2',
//                    'SpecRoot-afterEach',
        
        topTest.is(log[ 0 ], log[ 1 ], "Same test instance passed to top level two before each hooks")
        topTest.is(log[ 1 ], log[ 2 ], "... and its the instance created for the `Root->Spec1` block")
        
        topTest.is(log[ 3 ], log[ 4 ], "Same test instance passed to top level 2 before each hooks")
        topTest.is(log[ 4 ], log[ 5 ], "... and same instance passed to the `beforeEach` hooks of `Root->Spec1`")
        topTest.is(log[ 5 ], log[ 6 ], "... and its the instance created for the `Root->Spec1->Spec11` block")
        topTest.is(log[ 6 ], log[ 7 ], "... and same instance passed to the `afterEach` hooks of `Root->Spec1`")
        topTest.is(log[ 7 ], log[ 8 ], "... and same instance passed to the `afterEach` hooks of top level")
        topTest.is(log[ 8 ], log[ 9 ], "... and same instance passed to the `afterEach` hooks of top level")
        
        topTest.is(log[ 10 ], log[ 1 ], "Same test instance passed to top level two after each hooks")
        topTest.is(log[ 11 ], log[ 1 ], "Same test instance passed to top level two after each hooks")
    })
    // eof testGeneric
})    
