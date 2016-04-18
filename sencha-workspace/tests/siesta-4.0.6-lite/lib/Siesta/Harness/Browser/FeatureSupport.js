/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Singleton('Siesta.Harness.Browser.FeatureSupport', {
    
    has     : {
        supports    : Joose.I.Object,
        
        simulator   : null,
        
        tests       : {
            init        : [
                // "fn"s are called as methods of the "Siesta.Harness.Browser.FeatureSupport" singleton
                {
                    id : "mouseEnterLeave",
                    fn : function() {
                        var el = document.createElement("div");
                        return 'onmouseenter' in el && 'onmouseleave' in el;
                    }
                },
        
                {
                    id : "enterOnAnchorTriggersClick",
                    fn : function() {
                        var sim     = this.simulator,
                            E       = Siesta.Test.Simulate.KeyCodes().keys.ENTER,
                            result  = false;
                            
                        var anchor = $('<a href="foo" style="display:none">test me</a>');
                        $('body').append(anchor);
        
                        anchor.focus();
                        anchor.click(function(e) {
                            result = true;
                            return false;
                        });
                
                        sim.simulateEvent(anchor, 'keypress', { keyCode : E, charCode : 0 }, true);
                 
                        anchor.remove();
                        return result;
                    }
                },
        
                {
                    id : "canSimulateKeyCharacters",
                    fn : function() {
                        var sim     = this.simulator;
                        
                        var input   = $('<input class="siesta-hidden" type="text" />'),
                            A       = Siesta.Test.Simulate.KeyCodes().keys.A;
                            
                        $('body').append(input);
                        
                        input.focus();
                        sim.simulateEvent(input, 'keypress', { keyCode : A, charCode : A }, true);
                        sim.simulateEvent(input, 'textInput', { text : "A" }, true);
                
                        var result  = input.val() === 'A';
                        
                        input.remove();
                        
                        return result;
                    }
                },
        
                {
                    id : "canSimulateBackspace",
                    fn : function() {
                        var sim     = this.simulator;
                        
                        var input   = $('<input class="siesta-hidden" type="text" />'),
                            BS      = Siesta.Test.Simulate.KeyCodes().keys.BACKSPACE,
                            A       = Siesta.Test.Simulate.KeyCodes().keys.A;
                            
                        $('body').append(input);
                        
                        input.focus();
                        sim.simulateEvent(input, 'keypress', { keyCode : A, charCode : A }, true);
                        sim.simulateEvent(input, 'keypress', { keyCode : A, charCode : A }, true);
                        sim.simulateEvent(input, 'keypress', { keyCode : BS, charCode : BS }, true);
                        
                        var result  = input.val() === 'A';
                 
                        input.remove();
                        
                        return result;
                    }
                },

                {
                    id : "enterSubmitsForm",
                    fn : function() {
                        var sim     = this.simulator,
                            E       = Siesta.Test.Simulate.KeyCodes().keys.ENTER,
                            result  = false;

                        var form = $('<form method="post"><input type="text"/></form>');
                        var input = $(form).find('input');
                        $('body').append(form);

                        form[0].onsubmit = function(e) {
                            result = true;
                            return false;
                        };

                        input.focus();
                        sim.simulateEvent(input, 'keypress', { keyCode : E, charCode : 0 }, true);

                        form.remove();
                        return result;
                    }
                },
                // remove after https://bugzilla.mozilla.org/show_bug.cgi?id=959992 will be fixed
                {
                    id : "imageWithIdCreatesGlobalEnumerable",
                    fn : function () {
                        var img     = $('<img id="test_img_id"/>');
                        
                        $('body').append(img);
                        
                        var hasImgId    = false
                        
                        for (var i in window) {
                            if (i == 'test_img_id') hasImgId = true
                        }

                        img.remove();
                        
                        return hasImgId;
                    }
                },
                {
                    id  : 'TouchEvents',
                    fn  : function() {
                        return this.isEventSupported('touchend', window);
                    }
                },
                {
                    id  : 'PointerEvents',
                    fn  : function() {
                        return this.isEventSupported('pointerdown')
                    }
                },
                {
                    id  : 'MSPointerEvents',
                    fn  : function() {
                        return this.isEventSupported('mspointerdown')
                    }
                }
            ]
        }
        
    },
    
    methods     : {
        
        initialize : function() {
            var emptyFn = function() {},
                foo = Class({
                    does    : [
                        Siesta.Util.Role.CanGetType,
                        Siesta.Test.Simulate.Event,
                        Siesta.Test.Simulate.Mouse,
                        Siesta.Test.Simulate.Keyboard
                    ],
                
                    has     : {
                        global      : null
                    },
                
                    methods : {
                        focusOnClick        : emptyFn,
                        getElementAtCursor  : emptyFn,
                        fireEvent           : emptyFn,
                        addResult           : emptyFn,
                        isEventPrevented    : function() { return false; },
                        normalizeElement    : function(a) { return a[0]; },
                        findCenter          : function() { return [0,0]; },
                        valueIsArray        : function(arr) { return 'length' in arr; }
                    }
                });
            
            this.simulator = new foo({ global : window });
    
            for (var i = 0; i < this.tests.length; i++) {
                var test            = this.tests[i];
                var testId          = test.id;
                var detectorFn      = test.fn;
                
                // also save the results to "results" property - we'll use this in out own test suite
                // where we copy the feature testing results from the outer scope to inner
                this.supports[ testId ] = detectorFn.call(this);
            }
        },
        
        
        // from Modernizr
        isEventSupported: function (eventName, element) {
            var isSupported;
            
            if (!eventName) return false
            if (!element || typeof element === 'string') element = document.createElement(element || 'div');
    
            // Testing via the `in` operator is sufficient for modern browsers and IE.
            // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and
            // "resize", whereas `in` "catches" those.
            eventName       = 'on' + eventName;
            isSupported     = eventName in element;
    
            // Fallback technique for old Firefox - bit.ly/event-detection
            if (!isSupported) {
                if (!element.setAttribute) {
                    // Switch to generic element if it lacks `setAttribute`.
                    // It could be the `document`, `window`, or something else.
                    element = document.createElement('div');
                }
    
                element.setAttribute(eventName, '');
                isSupported = typeof element[ eventName ] === 'function';
        
                if (element[ eventName ] !== undefined ) {
                    // If property was created, "remove it" by setting value to `undefined`.
                    element[ eventName ] = undefined;
                }
                element.removeAttribute(eventName);
            }
    
            return isSupported;            
        }
        
    }
})
