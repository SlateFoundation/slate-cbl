/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Class('Siesta', {
    /*PKGVERSION*/VERSION : '4.0.6',

    // "my" should been named "static"
    my : {
        
        has : {
            config          : null,
            activeHarness   : null
        },
        
        methods : {
        
            getConfigForTestScript : function (text) {
                try {
                    eval(text)
                    
                    return this.config
                } catch (e) {
                    return null
                }
            },
            
            
            StartTest : function (arg1, arg2) {
                if (typeof arg1 == 'object') 
                    this.config = arg1
                else if (typeof arg2 == 'object')
                    this.config = arg2
                else
                    this.config = null
            }
        }
    }
})

// fake StartTest function to extract test configs
if (typeof StartTest == 'undefined') StartTest = Siesta.StartTest
if (typeof startTest == 'undefined') startTest = Siesta.StartTest
if (typeof describe == 'undefined') describe = Siesta.StartTest

// from MDN
// this polyfill is required by Ext, since Ext adds it to own context and after that assumes every function
// used as a callback has "bind" method
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs       = Array.prototype.slice.call(arguments, 1),
            fToBind     = this,
            fNOP        = function () {},
            fBound      = function () {
                return fToBind.apply(
                    this instanceof fNOP ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments))
                );
            };

        fNOP.prototype      = this.prototype;
        fBound.prototype    = new fNOP();

        return fBound;
    };
}