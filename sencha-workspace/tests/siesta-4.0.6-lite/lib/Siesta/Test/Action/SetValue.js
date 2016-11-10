/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Test.Action.SetValue
@extends Siesta.Test.Action

Used to set value to an Ext.form.Field (text input, checkbox, radio button etc.) This action can be used in a `t.chain` call with the "setValue" shortcut:

    t.chain(
        {
            setValue    : 'Some text',
            target      : '.textInput'
        }
    )

This action will perform a {@link Siesta.Test.ExtJS#setValue setValue} call on the provided {@link #target}.

*/
Class('Siesta.Test.Action.SetValue', {
    
    isa         : Siesta.Test.Action,
    
    has : {
        /**
         * @cfg {Ext.Component/String/Function} A component instance or a component query to resolve, or a function, returning such. 
         */
        target              : null,
        
        setValue            : null,
        
        requiredTestMethod  : 'setValue'
    },

    
    methods : {
        
        process : function () {
            var target  = this.target;
            var test    = this.test;

            if (test.typeOf(target) === 'Function') target = target.call(test, this);

            test.setValue(target, this.setValue, this.next, null);
        }
    }
});


Siesta.Test.ActionRegistry().registerAction('setValue', Siesta.Test.Action.SetValue);
