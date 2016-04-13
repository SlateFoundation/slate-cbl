/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Test.Action.Click
@extends Siesta.Test.Action
@mixin Siesta.Test.Action.Role.HasTarget

This action can be included in the `t.chain` call with "click" shortcut:

    t.chain(
        {
            action      : 'click',
            target      : someDOMElement,
            options     : { shiftKey : true } // Optionally hold shiftkey
        },
        // or
        {
            click       : someDOMElement,
            options     : { shiftKey : true } // Optionally hold shiftkey
        }
    )

This action will perform a {@link Siesta.Test.Browser#click click} on the provided {@link #target}. 

*/
Class('Siesta.Test.Action.Click', {
    
    isa         : Siesta.Test.Action,
    
    does        : Siesta.Test.Action.Role.HasTarget,
        
    has : {
        requiredTestMethod  : 'click'
    },

    methods : {
        
        process : function () {
            this.test.click(this.getTarget(), this.next, null, this.options, this.offset, this.waitForTarget);
        }
    }
});


Siesta.Test.ActionRegistry().registerAction('click', Siesta.Test.Action.Click);
