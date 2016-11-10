/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Test.Action.LongPress
@extends Siesta.Test.Action
@mixin Siesta.Test.Action.Role.HasTarget

This action can be included in the `t.chain` call with "click" shortcut:

    t.chain(
        {
            action      : 'longpress',
            target      : someDOMElement
        },
        // or
        {
            longpress   : someDOMElement
        }
    )

This action will perform a {@link Siesta.Test.SenchaTouch#longpress longpress} on the provided {@link #target}. 

*/
Class('Siesta.Test.Action.LongPress', {
    
    isa         : Siesta.Test.Action,
    
    does        : Siesta.Test.Action.Role.HasTarget,
        
    has : {
        requiredTestMethod  : 'longPress'
    },

    
    methods : {
        
        process : function () {
            this.test.longpress(this.getTarget(), this.next, null, this.options, this.offset)
        }
    }
});


Siesta.Test.ActionRegistry().registerAction('longpress', Siesta.Test.Action.LongPress)
