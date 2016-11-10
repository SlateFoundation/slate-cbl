/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Test.Action.SetUrl
@extends Siesta.Test.Action

Used to set the URL of the test page. The url must be on the same domain as Siesta itself.

    t.chain(
        { setUrl      : 'www.yourdomain.com' }
    )

This action will perform a {@link Siesta.Test.Browser#setUrl setUrl} call using the provided {@link #value}.

*/
Class('Siesta.Test.Action.SetUrl', {
    
    isa         : Siesta.Test.Action,
    
    has : {
        /**
         * @cfg {String} The URL to navigate to
         */
        value              : null,
        setUrl             : null,

        requiredTestMethod  : 'setUrl'
    },

    
    methods : {
        
        process : function () {
            var value   = this.setUrl || this.value;
            var test    = this.test;

            test.setUrl(value, this.next);
        }
    }
});


Siesta.Test.ActionRegistry().registerAction('setUrl', Siesta.Test.Action.SetUrl);
