/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Class('Siesta.Result.SubTest', {
    
    isa : Siesta.Result,
    

    has : {
        // reference to a test it belongs to
        // SubTests result instances will be set as `results` for sub tests instances
        test            : null
    },
    
    
    methods : {
        
        isWorking : function () {
            return !this.test.isFinished()
        },
        
        
        toJSON : function () {
            var test            = this.test
            
            // a flag that test instance does not belongs to the current context
            // this only happens during self-testing
            // if this is the case, in IE, calling any method from the test context will throw exception
            // "can't execute script from freed context", so we avoid calling any methods on the test in such case
            // accessing properties is ok though
            var isCrossContext  = !(test instanceof Object)
            
            var report      = {
                type            : this.meta.name,
                name            : test.name,
                
                startDate       : test.startDate,
                endDate         : test.endDate || (new Date() - 0),
                
                passed          : isCrossContext ? null : test.isPassed()
            }
            
            // top level test
            if (!test.parent)   {
                report.automationElementId  = test.automationElementId
                report.url                  = test.url
                report.jUnitClass           = test.getJUnitClass()
                report.groups               = test.groups
            }
            
            if (test.specType)  report.bddSpecType  = test.specType
            
            var isFailed    = false
            var assertions  = []
            
            Joose.A.each(this.children, function (result) {
                if ((result instanceof Siesta.Result.Assertion) || (result instanceof Siesta.Result.Diagnostic) || (result instanceof Siesta.Result.SubTest)) {
                    var assertion   = result.toJSON()
                    
                    if (!assertion.passed && !assertion.isTodo) isFailed = true
                    
                    assertions.push(assertion)
                }
            })
            
            report.assertions       = assertions
            
            // see a comment above
            if (isCrossContext) {
                report.passed       = !(isFailed || test.failed || !test.endDate)
            }
            
            return report
        }
        
    }
})

