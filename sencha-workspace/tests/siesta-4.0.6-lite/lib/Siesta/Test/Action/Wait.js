/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Test.Action.Wait
@extends Siesta.Test.Action

This action can be included in the `t.chain` call with "wait" or "delay" shortcuts:

    t.chain(
        {
            action      : 'wait',   // or "delay"
            delay       : 1000      // 1 second
        }
    )

Alternatively, for convenience, this action can be included in the chain using "waitFor" config (the "action" property can be omitted):

    t.chain(
        {
            waitFor     : 'selector',           // or any other waitFor* method name
            args        : [ '.x-grid-row' ]     // an array of arguments for the specified method
        }
    )
    
    t.chain(
        {
            waitFor     : 'rowsVisible',        // or any other waitFor* method name
            args        : [ grid ]              // an array of arguments for the specified method
        }
    )
    
    t.chain(
        {
            waitFor     : 'waitForRowsVisible', // full method name is also ok
            args        : grid                  // a single value will be converted to array automatically
        }
    )
    
In the latter case, this action will perform a call to the one of the `waitFor*` methods of the test instance.
The name of the method is computed by prepending the uppercased value of `waitFor` config with the string "waitFor" 
(unless it doesn't already start with "waitFor").
The arguments for method call can be provided as the "args" array. Any non-array value for "args" will be converted to an array with one element.
* **Note**, that this action will provide a `callback`, `scope`, and `timeout` arguments for `waitFor*` methods - you should not specify them. 


As a special case, the value of `waitFor` config can be a Number or Function - that will trigger the call to {@link Siesta.Test#waitFor} method with provided value:

    t.chain(
        {
            waitFor     : 500
        },
        // same as
        {
            waitFor     : '',
            args        : [ 500 ] 
        },
        {
            waitFor     : function () { return document.body.className.match(/someClass/) }
        }
    )

*/
Class('Siesta.Test.Action.Wait', {
    
    isa         : Siesta.Test.Action,
    
    has : {
        /**
         * @cfg {Number} delay
         * 
         * A number of milliseconds to wait before continuing.
         */
        delay           : 1000,
        
        /**
         * @cfg {Number} timeout
         * 
         * The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value. 
         */
        timeout         : null,

        /**
         * @cfg {Array/Function} args
         * 
         * The array of arguments to pass to waitForXXX method. You should omit the 3 last parameters: callback, scope, timeout. Any non-array value will be converted to 
         * a single-value array. Can be also a function, returning either an array of a single value, which will be converted to array.
         * Function will be called using test instance as a "this" scope.
         * If you need to pass a function, as an argument, wrap in the array. Compare: 
    {
        waitFor : 'SomeCondition',
        // will be called when processing the action, should return an array of arguments
        args    : function () {} 
    }
    
    {
        waitFor : 'SomeCondition',
        // won't be called, instead will be passed as 1st argument
        args    : [ function () {} ] 
    }
         *  
         */
        args            : Joose.I.Array,

        /**
         * @cfg {String} waitFor
         * 
         * The name of the `waitFor` method to call. You can omit the leading "waitFor":
         * 

    t.chain(
        {
            waitFor     : 'selector',
            ...
        },
        // same as
        {
            waitFor     : 'waitForSelector',
            ...
        }
    )
         * 
         */
        waitFor         : null,
        
        
        /**
         * @cfg {Object/Function} trigger 
         * 
         * A config object for the action that should trigger the waiting condition. Can be also a regular function to execute. 
         * An action or function will be executed right *after* the waiting has started, to avoid the race conditions. 
         * 
         * To illustrate, imagine, when clicking on some button, new data package will be loaded and some event `dataloaded` 
         * will be fired. We want to wait for that event. Usually, you will write this as the following action steps, in the `chain` method:
         * 

    t.chain(
        { click : '.someButton' },
        { waitFor : 'Event', args : [ someDataStorage, 'dataload' ] },
        ...
    )

         * However, imagine loading mechanism implements caching, and sometimes loading happens *synchronously*. In this case,
         * the `dataload` event will be also fired synchronously, right during the "onclick" handler of the button. Then, we'll start
         * waiting for that event (which has already been fired) and the `waitFor` action will fail.
         * 
         * To avoid this race condition, we need to first start waiting for the event, and only then - perform a click:
         * 

    t.chain(
        function (next) {
            t.waitForEvent(someDataStorage, 'dataload', next);
            
            t.click('.someButton', function () {})
        },
        ...
    )

         * or, using `trigger` config:

    t.chain(
        { 
            waitFor : 'Event', 
            args    : [ someDataStorage, 'dataload' ],
            trigger : { click : '.someButton' } 
        },
        ...
    )

         */
        trigger         : null,

        hasOwnAsyncFrame    : true,
        description         : '' // used internally to have custom wait messages that don't produce noise in the UI (chain step automatically adds a t.pass with 'desc')
    },

    
    methods : {
        
        process : function () {
            var waitFor     = this.waitFor;
            var test        = this.test

            if (test.typeOf(waitFor) === 'Number' || test.typeOf(waitFor) === 'Function') {
                // Caller supplied a function returning true when done waiting or
                // a number of milliseconds to wait for.
                this.args   = [ waitFor ];
                waitFor     = '';
            }
            
            if (waitFor == null) {
                this.args   = [ this.delay ];
                waitFor     = '';
            }
            
            // special case for { waitForFn : function () {} }" - we consider the function here
            // not a function which should return an array with arguments for the "waitFor" method
            // (which is a usual behavior for { someMehthod : function () {} } ), but the `waitFor` checker function itself
            if (test.typeOf(this.args) === "Function" && waitFor != 'waitForFn') {
                this.args   = this.args.call(test, this);
            }
            
            if (test.typeOf(this.args) !== "Array") {
                this.args   = [ this.args ];
            }

            // also allow full method names
            waitFor         = waitFor.replace(/^waitFor/, '')
            var methodName  = 'waitFor' + Joose.S.uppercaseFirst(waitFor);
            
            if (!test[ methodName ]){
                throw Siesta.Resource("Siesta.Test.Action.Wait", 'missingMethodText') + methodName;
            }
            
            // If using simple waitFor statement, use the object notation to be able to pass a description
            // which gives better debugging help than "Waited too long for condition to be fulfilled".
            if (methodName === 'waitFor') {
                test.waitFor({
                    method          : this.args[ 0 ],
                    callback        : this.next,
                    scope           : test,
                    timeout         : this.timeout || test.waitForTimeout,
                    description     : this.description || this.desc || ''
                });
            } else {
                test[ methodName ].apply(test, this.args.concat(this.next, test, this.timeout || test.waitForTimeout));
            }
            
            var trigger     = this.trigger
            
            if (trigger) {
                if (test.typeOf(trigger) == 'Function') 
                    trigger.call(test, test)
                else {
                    if (!(trigger instanceof Siesta.Test.Action)) {
                        trigger.next        = function () {}
                        trigger.test        = this.test
                        
                        trigger             = Siesta.Test.ActionRegistry().create(trigger, test)
                    }
                    
                    trigger.process()
                }
            }
            
        }
    }
});

Joose.A.each([ 'wait', 'waitFor', 'delay' ], function(name) {
    Siesta.Test.ActionRegistry().registerAction(name, Siesta.Test.Action.Wait);
});