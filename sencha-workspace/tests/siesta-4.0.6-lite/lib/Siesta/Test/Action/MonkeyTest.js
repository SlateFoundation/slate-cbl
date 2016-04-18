/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Test.Action.MonkeyTest
@extends Siesta.Test.Action
@mixin Siesta.Test.Action.Role.HasTarget

This action can be included in a `t.chain` call with "monkeyTest" shortcut:

    t.chain(
        { monkeyTest   : '.someSelector' }
    )

This action will perform a {@link Siesta.Test.Browser#MouseDown MouseDown} on the provided {@link #target}. 

*/
Class('Siesta.Test.Action.MonkeyTest', {
    
    isa         : Siesta.Test.Action,
    
    does        : Siesta.Test.Action.Role.HasTarget,
        
    has : {
        requiredTestMethod  : 'monkeyTest',
        
        nbrInteractions     : 10,
        
        hasOwnAsyncFrame    : true
    },

    
    methods : {
        
        process : function () {
            this.test.monkeyTest(this.getTarget(), this.nbrInteractions, this.next);
        }
    }
});


Siesta.Test.ActionRegistry().registerAction('monkeyTest', Siesta.Test.Action.MonkeyTest)
Siesta.Test.ActionRegistry().registerAction('monkey', Siesta.Test.Action.MonkeyTest)
