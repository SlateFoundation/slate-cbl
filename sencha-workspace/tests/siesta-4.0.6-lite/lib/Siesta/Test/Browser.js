/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.Browser
@extends Siesta.Test
@mixin Siesta.Test.Simulate.Event
@mixin Siesta.Test.TextSelection 
@mixin Siesta.Test.Simulate.Mouse
@mixin Siesta.Test.Simulate.Keyboard


A base class for testing a generic browser functionality. It has various DOM-related assertions, and is not optimized for any framework.

*/
Class('Siesta.Test.Browser', {
    
    isa         : Siesta.Test,
        
    does        : [
        Siesta.Util.Role.CanParseBrowser,
        Siesta.Test.Simulate.Event,
        Siesta.Test.Simulate.Mouse,
        Siesta.Test.Simulate.Touch,
        Siesta.Test.Simulate.Keyboard,
        Siesta.Test.Element,
        Siesta.Test.TextSelection
    ],

    has : {
        // this will be a shared array instance between all subtests
        // it should not be overwritten, instead modify individual elements:
        // NO: this.currentPosition = [ 1, 2 ]
        // YES: this.currentPosition[ 0 ] = 1
        // YES: this.currentPosition[ 1 ] = 2
        currentPosition         : {
           init : function () { return [ 0, 0 ]; }
        },
        
        forceDOMVisible         : false,
        isDOMForced             : false,
        
        browserInfo             : {
            lazy    : function () {
                return this.parseBrowser(window.navigator.userAgent)
            }
        },

        nextConfirmValue        : null,
        nextPromptReturnValue   : null,
        
        realAlert               : null,
        realConfirm             : null,
        realPrompt              : null,
        realPrint               : null,
        realOpen                : null,
        
        previousConfirm         : null,
        previousPrompt          : null,
        
//        blurListener            : null,
        restartOnBlur           : false,
        
        popups                  : Joose.I.Array
    },

    after : {
        cleanup : function () {
            this._global    = null
            
            this.realAlert  = this.realConfirm = this.realPrompt = this.realPrint = this.realOpen = null
            
            this.previousPrompt = this.previousConfirm = null
            
            this.blurListener   = null
            
            Joose.A.each(this.popups, function (handle) {
                if (!handle.popup.closed) handle.popup.close()
            })
            
            this.popups.length  = 0
            this.popups         = null
        }
    },

    methods : {
        
        onBeforeTestFinalize : function () {
            var global          = this.global

            // If expectAlertMessage(which overwrites the alert method) was called but no alert() call happened - fail the test
            if (global.alert.__EXPECTED_ALERT__) {
                this.fail(Siesta.Resource('Siesta.Test.Browser','alertMethodNotCalled'))
            }
            
            this.SUPERARG(arguments)
        },
        

        launch : function () {
            var emptyFn     = function () {};

            var me          = this
            var win         = this.global
            
            // top test
            if (!me.parent) {
                me.realAlert        = win.alert
                me.realConfirm      = win.confirm
                me.realPrompt       = win.prompt
                me.realPrint        = win.print
                me.realOpen         = win.open
                
                if (!me.harness.browserWindowHasFocus() && !$.browser.safari) me.onWindowBlur()
                
                // trying to focus the window (hopefully fixes the tab key issues)
                win.focus && win.focus()
                
//                win.addEventListener && win.addEventListener('blur', me.blurListener = function () {
//                    if ($.browser.mozilla && win.document.getElementsByTagName('iframe').length > 0)
//                        // this "waitFor" can be interrupted, but only by forceful test finalization, which
//                        // happens when test throws exception for example, so it fails anyway
//                        me.waitFor({
//                            method              : 0,
//                            suppressAssertion   : true,
//                            callback            : function () { me.onWindowBlur() }
//                        })
//                    else
//                        me.onWindowBlur()
//                })
            }
            
            // WARN: behavior when several sub-tests are running at the same time is not well-defined
            me.previousConfirm      = win.confirm
            me.previousPrompt       = win.prompt

            win.alert               = win.print = emptyFn;

            win.confirm = function () {
                var retVal                  = typeof me.nextConfirmValue === 'boolean' ? me.nextConfirmValue : true;

                me.nextConfirmValue         = null;

                return retVal;
            };

            win.prompt = function () {
                var retVal                  = me.nextPromptReturnValue || '';

                me.nextPromptReturnValue    = null;

                return retVal;
            };
            
            win.open = function (url) {
                var popup   = me.realOpen.apply(win, arguments)
                
                if (!popup) 
                    me.fail(Siesta.Resource('Siesta.Test.Browser','popupsDisabled', { url : url }))
                else {
                    me.popups.push({ url : url, popup : popup })
                }
                
                return popup
            }

            this.SUPERARG(arguments)
        },
        
        
        onTestFinalize : function () {
            var win         = this.global

            if (!this.parent) {
                win.confirm = this.previousConfirm;
                win.prompt  = this.previousPrompt;
                
                win.print   = this.realPrint
                win.alert   = this.realAlert
                win.open    = this.realOpen
            } else {
                win.confirm = this.realConfirm;
                win.prompt  = this.realPrompt;
                
                win.alert   = win.print = function () {}
            }
            
//            this.blurListener && win.removeEventListener('blur', this.blurListener)
//            
//            this.blurListener   = null
            
            this.SUPERARG(arguments)
        },
        
        
        onWindowBlur : function (arg1, arg2) {
//            var doc             = this.global.document
//            
//            // ignore the case when focus is moved inside of the child iframe
//            // IGNORE
//            if (!doc.hasFocus && doc.hasFocus()) return
//            
//            var slice           = Array.prototype.slice
//            
//            //                  convert from HTMLCollection to Array
//            var iframes         = slice.apply(doc.getElementsByTagName('iframe'))
//            
//            while (iframes.length) {
//                try {
//                    var innerDoc    = iframes[ 0 ].contentWindow.document
//                    
//                    if (innerDoc.hasFocus()) return
//                    
//                    iframes.push.apply(iframes, slice.apply(innerDoc.getElementsByTagName('iframe')))
//                } catch (e) {
//                }
//                
//                iframes.shift()
//            }
//            // EOF IGNORE
            
            if (this.restartOnBlur) 
                this.fireEvent('focuslost')
            else
                this.warn(Siesta.Resource('Siesta.Test.Browser').get('focusLostWarning', { url : this.url }))
        },

        
        $ : function () {
            var local$ = $.rebindWindowContext(this.global);
            return local$.apply(this.global, arguments);
        },


        isEventPrevented : function (event) {
            // our custom property - takes highest priority
            if (event.preventDefault && this.typeOf(event.preventDefault.$prevented) == 'Boolean') return event.preventDefault.$prevented

            // W3C standards property
            if (this.typeOf(event.defaultPrevented) == 'Boolean') return event.defaultPrevented
            
            return event.returnValue === false
        },
        
        
        // only called for the re-used contexts
        cleanupContextBeforeStart : function () {
            this.cleanupContextBeforeStartDom()
            
            this.SUPER()
        },
        
        
        cleanupContextBeforeStartDom : function () {
            var doc                 = this.global.document
            
            doc.body.innerHTML      = ''
        },
        
        
        getElementPageRect : function (el, $el) {
            $el             = $el || this.$(el)
            
            var offset      = $el.offset()
            
            return new Siesta.Util.Rect({
                left        : offset.left,
                top         : offset.top,
                width       : $el.outerWidth(),
                height      : $el.outerHeight()
            })
        },
        
        
        elementHasScroller : function (el, $el) {
            $el             = $el || this.$(el)
                
            var hasX        = el.scrollWidth != el.clientWidth && $el.css('overflow-x') != 'visible'
            var hasY        = el.scrollHeight != el.clientHeight && $el.css('overflow-y') != 'visible'
            
            return hasX || hasY ? { x : hasX, y : hasY } : false
        },
        
        
        hasForcedIframe : function () {
            return Boolean(
                (this.isDOMForced || this.forceDOMVisible) && (this.scopeProvider instanceof Scope.Provider.IFrame) && this.scopeProvider.iframe
            )
        },
        
        
        elementIsScrolledOut : function (el, offset) {
            var $el                 = this.$(el)
            
            var scrollableParents   = []
            var parent              = $el
            
            var body                = this.global.document.body
            
            while (parent = parent.parent(), parent.length && parent[ 0 ] != body) {
                var hasScroller     = this.elementHasScroller(parent[ 0 ], parent)
                
                if (hasScroller) scrollableParents.unshift({ hasScroller : hasScroller, $el : parent }) 
            }
            
            var $body               = this.$(body)
            var bodyOffset          = $body.offset()
            
            var currentRect         = new Siesta.Util.Rect({
                left        : bodyOffset.left + $body.scrollLeft(),
                top         : bodyOffset.top + $body.scrollTop(),

                // using height / width of the *screen* for BODY tag since it may have 0 height in some cases
                width       : this.$(this.global).width(),
                height      : this.$(this.global).height()
            })

            for (var i = 0; i < scrollableParents.length; i++) {
                var hasScroller     = scrollableParents[ i ].hasScroller
                var $parent         = scrollableParents[ i ].$el
                
                if (hasScroller && hasScroller.x)
                    currentRect     = currentRect.cropLeftRight(this.getElementPageRect($parent[ 0 ], $parent))
                    
                if (currentRect.isEmpty()) return true
                    
                if (hasScroller && hasScroller.y)
                    currentRect     = currentRect.cropTopBottom(this.getElementPageRect($parent[ 0 ], $parent))
                    
                if (currentRect.isEmpty()) return true
            }
            
            var elPageRect          = this.getElementPageRect($el[ 0 ], $el)
            var finalRect           = currentRect.intersect(elPageRect)
            
            if (finalRect.isEmpty()) return true
            
            offset                  = this.normalizeOffset(offset, $el)
            
            return !finalRect.contains(elPageRect.left + offset[ 0 ], elPageRect.top + offset[ 1 ])
        },
        
        
        // returns "true" if scrolling has actually occured
        scrollTargetIntoView : function (target, offset) {
            if (this.typeOf(target) != 'Array') {
                target          = this.normalizeElement(target, true, null, false);
                var isInside    = this.isOffsetInsideElementBox(target, offset);

                if (
                    target && this.isElementVisible(target) &&
                    // If element isn't visible, try to bring it into view
                    isInside && this.elementIsScrolledOut(target, offset)
                ) {
                    // Required to handle the case where the body is scrolled
                    target.scrollIntoView();

                    this.$(target).scrollintoview({ duration : 0 });

                    // If element is still out of view, try manually scrolling first scrollable parent found
                    if (this.elementIsScrolledOut(target, offset)) {
                        // Now we need to look up for first scrollable parent and make sure
                        // it's scrolled matching the target offset
                        var scrollableParent = $(target).closest(':scrollable')[0];

                        if (scrollableParent && offset) {

                            if (offset[0] > 0) {
                                scrollableParent.scrollLeft = Math.max(0, offset[0] - 1);
                            }

                            if (offset[1] > 0) {
                                scrollableParent.scrollTop = Math.max(0, offset[1] - 1);
                            }
                        }
                    }

                    return true
                }
            }
        },

        
        processSubTestConfig : function () {
            var res             = this.SUPERARG(arguments)
            var me              = this
            
            Joose.A.each([ 
                'currentPosition', 
                'actionDelay', 'afterActionDelay', 
                'dragDelay', 'moveCursorBetweenPoints', 'mouseMovePrecision', 'pathBatchSize', 'overEls',
                'realAlert', 'realConfirm', 'realPrompt', 'realPrint', 'realOpen', 'popups'
            ], function (name) {
                res[ name ]     = me[ name ]
            })
            
            res.simulateEventsWith  = me.getSimulateEventsWith()
            
            return res
        },
        
        
        // Normalizes the element to an HTML element. Every 'framework layer' will need to provide its own implementation
        // This implementation accepts either a CSS selector or an Array with xy coordinates.
        normalizeElement : function (el, allowMissing, shallow, detailed) {
            // Quick exit if already an element
            if (el && el.nodeName) return el;

            var matchingMultiple = false

            if (this.typeOf(el) === 'String') {
                // DOM query
                var origEl  = el;

                var wasAdjusted = this.adjustScope(el);

                var query   = this.$(el.indexOf('->') >= 0 ? el.split('->')[1] : el);

                if (wasAdjusted) this.resetScope();

                el          = query[ 0 ];
                matchingMultiple = query.length > 1
                
                if (!allowMissing && !el) {
                    var warning = Siesta.Resource('Siesta.Test.Browser','noDomElementFound') + ': ' + origEl

                    this.warn(warning);
                    throw warning;
                }
            }
            
            if (this.typeOf(el) == 'Array') el = this.elementFromPoint(el[ 0 ], el[ 1 ]);
            
            return detailed ? { el : el, matchingMultiple : matchingMultiple } : el;
        },
        
        
        // this method generally has the same semantic as the "normalizeElement", its being used in 
        // Siesta.Test.Action.Role.HasTarget to determine what to pass to next step
        //
        // on the browser level the only possibility is DOM element
        // but on ExtJS level user can also use ComponentQuery and next step need to receive the 
        // component instance
        normalizeActionTarget : function (el, allowMissing) {
            return this.normalizeElement(el, allowMissing);
        },

        
        
        // private
        getPathBetweenPoints: function (from, to) {
            if (
                typeof from[0] !== 'number' ||
                typeof from[1] !== 'number' ||
                typeof to[0] !== 'number'   ||
                typeof to[1] !== 'number'   ||
                isNaN(from[0])              ||
                isNaN(from[1])              ||
                isNaN(to[0])                ||
                isNaN(to[1]))
            {
                throw 'Incorrect arguments passed to getPathBetweenPoints';
            }

            var stops = [],
                x0 = Math.floor(from[0]),
                x1 = Math.floor(to[0]),
                y0 = Math.floor(from[1]),
                y1 = Math.floor(to[1]),
                dx = Math.abs(x1 - x0),
                dy = Math.abs(y1 - y0),
                sx, sy, err, e2;

            if (x0 < x1) {
                sx = 1;
            } else {
                sx = -1;
            }

            if (y0 < y1) {
                sy = 1;
            } else {
                sy = -1;
            }
            err = dx - dy;
            
            while (x0 !== x1 || y0 !== y1) {
                e2 = 2 * err;
                if (e2 > -dy) {
                    err = err - dy;
                    x0 = x0 + sx;
                }

                if (e2 < dx) {
                    err = err + dx;
                    y0 = y0 + sy;
                }
                stops.push([x0, y0]);
            }

            var last = stops[stops.length-1];

            if (stops.length > 0 && (last[0] !== to[0] || last[1] !== to[1])) {
                // the points of the path can be modified in the move mouse method - thus pushing a copy
                // of the original target
                stops.push(to.slice());
            }
            return stops;
        },

        
        randomBetween : function (min, max) {
            return Math.floor(min + (Math.random() * (max - min + 1)));
        },

        
        // private, deprecated
        valueIsArray : function(a) {
            return this.typeOf(a) == 'Array'
        },
        
        
        /**
         * This method will return the top-most DOM element at the specified coordinates from the test page. If
         * the resulting element is an iframe and `shallow` argument is not passed as `true`
         * it'll query the iframe for its element from the local point inside it.
         * 
         * @param {Number} x The X coordinate
         * @param {Number} y The Y coordinate
         * @param {Boolean} [shallow] Pass `true` to _not_ check the nested iframe if element at original coordinates is an iframe.
         * 
         * @return {HTMLElement} The top-most element at the specified position on the test page
         */
        elementFromPoint : function (x, y, shallow, fallbackEl, fullInfo) {
            var document    = this.global.document;
            var el          = document.elementFromPoint(x, y)
            
            // trying 2nd time if 1st attempt failed and returned null
            // this weird thing seems to be required sometimes for IE8 and may be for IE10
            if (!el) el     = document.elementFromPoint(x, y)
            
            // final fallback to the provided element or to the <body> element
            el              = el || fallbackEl || document.body;
            
            var localX      = x
            var localY      = y

            // If we found IFRAME and its not a `shallow` request, try to dig deeper
            if (el.nodeName.toUpperCase() == 'IFRAME' && !shallow) { 
                // if found iframe is loaded from different domain
                // just accessing its "el.contentWindow.document" property will throw exception
                try {
                    var iframeDoc       = el.contentWindow.document;
                    var offsetsToTop    = this.$(el).offset();
                    
                    localX              = x - offsetsToTop.left
                    localY              = y - offsetsToTop.top
        
                    var resolvedEl      = iframeDoc.elementFromPoint(localX, localY)
        
                    // again weird 2nd attempt for IE
                    if (!resolvedEl) resolvedEl = iframeDoc.elementFromPoint(localX, localY)
                    
                    resolvedEl          = resolvedEl || iframeDoc.body;
        
                    // Chrome reports 'HTML' in nested document.elementFromPoint calls which makes no sense
                    if (resolvedEl.nodeName.toUpperCase() === 'HTML') resolvedEl = iframeDoc.body;
        
                    el                  = resolvedEl;
                } catch (e) {
                    // digging deeper failed, restore the local coordinates
                    localX              = x
                    localY              = y
                }
            }
            
            return fullInfo ? {
                el          : el,
                localXY     : [ localX, localY ],
                globalXY    : [ x, y ]
            } : el
        },
        
        
        activeElement : function (notAllowBody, fallbackEl, elOrDoc) {
            var doc         = elOrDoc ? elOrDoc.ownerDocument || elOrDoc : this.global.document
            
            var focusedEl   = doc.activeElement;

            // 1. In IE10,11 it seems activeElement cannot be trusted as it sometimes returns an empty object with no properties.
            // Try to detect this case and use the fallback el 
            // 2. Sometimes receiving <body> from this method does not make sense either - use fallback el as well
            if (!focusedEl || !focusedEl.nodeName || !focusedEl.tagName || (focusedEl === doc.body && notAllowBody)) {
                focusedEl   = fallbackEl;
            }
            
            // For iframes, we need to grab the activeElement of the frame (if in the same domain)
            if ($(focusedEl).is('iframe')) {
                try {
                    if (focusedEl.contentDocument && focusedEl.contentDocument.body) {
                        focusedEl = this.activeElement(notAllowBody, fallbackEl, focusedEl.contentDocument)
                    }
                }
                catch(e) {}

            }
            
            return focusedEl || doc.body
        },

        
        /**
         * This method uses native `document.elementFromPoint()` and returns the DOM element under the current logical cursor 
         * position in the test. Note, that this method may work not 100% reliable in IE due to its bugs. In cases
         * when "document.elementFromPoint" can't find any element this method returns the &lt;body&gt; element.
         * 
         * @return {HTMLElement}
         */
        getElementAtCursor : function() {
            var xy          = this.currentPosition;
            
            return this.elementFromPoint(xy[0], xy[1]);
        },

        /**
         * This method will wait for the first browser `event`, fired by the provided `observable` and will then call the provided callback.
         * 
         * @param {Mixed} observable Any browser observable, window object, element instances, CSS selector.
         * @param {String} event The name of the event to wait for
         * @param {Function} callback The callback to call 
         * @param {Object} scope The scope for the callback
         * @param {Number} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForEvent : function (observable, event, callback, scope, timeout) {
            var eventFired      = false
            var R               = Siesta.Resource('Siesta.Test.Browser');

            this.addListenerToObservable(observable, event, function () { eventFired = true })
            
            return this.waitFor({
                method          : function() { return eventFired; }, 
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForEvent',
                description     : ' ' + R.get('waitForEvent') + ' "' + event + '" ' + R.get('event')
            });
        },

        
        addListenerToObservable : function (observable, event, listener, isSingle) {
            this.$(observable).bind(event, listener)
        },
        
        
        removeListenerFromObservable : function (observable, event, listener) {
            this.$(observable).unbind(event, listener)
        },
        
        
        /**
         * This assertion verifies the number of certain events fired by provided observable instance during provided period.
         * 
         * For example:
         *

    t.firesOk({
        observable      : store,
        events          : {
            update      : 1,
            add         : 2,
            datachanged : '> 1'
        },
        during          : function () {
            store.getAt(0).set('Foo', 'Bar');
            
            store.add({ FooBar : 'BazQuix' })
            store.add({ Foo : 'Baz' })
        },
        desc            : 'Correct events fired'
    })
    
    // or
    
    t.firesOk({
        observable      : store,
        events          : {
            update      : 1,
            add         : 2,
            datachanged : '>= 1'
        },
        during          : 1
    })
    
    store.getAt(0).set('Foo', 'Bar');
    
    store.add({ FooBar : 'BazQuix' })
    store.add({ Foo : 'Baz' })
    
         *
         * Normally this method accepts a single object with various options (as shown above), but also can be called in 2 additional shortcuts forms:
         * 

    // 1st form for multiple events
    t.firesOk(observable, { event1 : 1, event2 : '>1' }, description)
    
    // 2nd form for single event
    t.firesOk(observable, eventName, 1, description)
    t.firesOk(observable, eventName, '>1', description)

         * 
         * In both forms, `during` is assumed to be undefined and `description` is optional.
         * 
         * @param {Object} options An obect with the following properties:
         * @param {Ext.util.Observable/Ext.Element/HTMLElement} options.observable The observable instance that will fire events
         * @param {Object} options.events The object, properties of which corresponds to event names and values - to expected 
         * number of this event triggering. If value of some property is a number then exact that number of events is expected. If value
         * of some property is a string starting with one of the comparison operators like "\<", "\<=" etc and followed by the number
         * then Siesta will perform that comparison with the number of actualy fired events.
         * @param {Number/Function} [options.during] If provided as a number denotes the number of milliseconds during which
         * this assertion will "record" the events from observable, if provided as function - then this assertion will "record"
         * only events fired during execution of this function. If not provided at all - assertions are recorded until the end of
         * current test (or sub-test)  
         * @param {Function} [options.callback] A callback to call after this assertion has been checked. Only used if `during` value is provided. 
         * @param {String} [options.desc] A description for this assertion
         */
        firesOk: function (options, events, n, timeOut, func, desc, callback) {
            //                    |        backward compat arguments        | 
            var me              = this;
            var sourceLine      = me.getSourceLine();
            var R               = Siesta.Resource('Siesta.Test.Browser');
            var nbrArgs         = arguments.length
            var observable, during
            
            if (nbrArgs == 1) {
                observable      = options.observable
                events          = options.events
                during          = options.during
                desc            = options.desc || options.description
                callback        = options.callback
                
                timeOut         = this.typeOf(during) == 'Number' ? during : null
                func            = this.typeOf(during) == 'Function' ? during : null
                
            } else if (nbrArgs >= 5) {
                // old signature, backward compat
                observable      = options
                
                if (this.typeOf(events) == 'String') {
                    var obj         = {}
                    obj[ events ]   = n
                    
                    events          = obj
                }
            } else if (nbrArgs <= 3 && this.typeOf(events) == 'Object') {
                // shortcut form 1
                observable      = options
                desc            = n
            } else if (nbrArgs <= 4 && this.typeOf(events) == 'String') {
                // shortcut form 2
                observable      = options
                
                var obj         = {}
                obj[ events ]   = n
                events          = obj
                
                desc            = timeOut
                timeOut         = null
            } else
                throw new Error(R.get('unrecognizedSignature'))
            
            // start recording
            var counters    = {};
            var countFuncs  = {};

            Joose.O.each(events, function (expected, eventName) {
                counters[ eventName ]   = 0
                
                var countFunc   = countFuncs[ eventName ] = function () {
                    counters[ eventName ]++
                }
                
                me.addListenerToObservable(observable, eventName, countFunc);    
            })
            
            
            // stop recording and verify the results
            var stopRecording   = function () {
                Joose.O.each(events, function (expected, eventName) {
                    me.removeListenerFromObservable(observable, eventName, countFuncs[ eventName ]);
                    
                    var actualNumber    = counters[ eventName ]
    
                    if (me.verifyExpectedNumber(actualNumber, expected))
                        me.pass(desc, {
                            descTpl         : R.get('observableFired') + ' ' + actualNumber + ' `' + eventName + '` ' + R.get('events')
                        });
                    else
                        me.fail(desc, {
                            assertionName   : 'firesOk',
                            sourceLine      : sourceLine,
                            descTpl         : R.get('observableFiredOk') + ' `' + eventName + '` ' + R.get('events'),
                            got             : actualNumber,
                            gotDesc         : R.get('actualNbrEvents'),
                            need            : expected,
                            needDesc        : R.get('expectedNbrEvents')
                        });
                })
            }
            
            if (timeOut) {
                var async               = this.beginAsync(timeOut + 100);
                
                var originalSetTimeout  = this.originalSetTimeout;
    
                originalSetTimeout(function () {
                    me.endAsync(async);
                    
                    stopRecording()
    
                    me.processCallbackFromTest(callback);
                }, timeOut);
            } else if (func) {
                func()
                
                stopRecording()
                
                me.processCallbackFromTest(callback)
            } else {
                this.on('beforetestfinalizeearly', stopRecording)
            }
        },


        /**
         * This assertion passes if the observable fires the specified event exactly (n) times during the test execution.
         *
         * @param {Ext.util.Observable/Ext.Element/HTMLElement} observable The observable instance
         * @param {String} event The name of event
         * @param {Number} n The expected number of events to be fired
         * @param {String} [desc] The description of the assertion.
         */
        willFireNTimes: function (observable, event, n, desc, isGreaterEqual) {
            this.firesOk(observable, event, isGreaterEqual ? '>=' + n : n, desc)
        },
        
        
        getObjectWithExpectedEvents : function (event, expected) {
            var events      = {}
            
            if (this.typeOf(event) == 'Array') 
                Joose.A.each(event, function (eventName) {
                    events[ eventName ] = expected
                })
            else
                events[ event ]         = expected
                
            return events
        },
        
        
        /**
         * This assertion passes if the observable does not fire the specified event(s) after calling this method.
         * 
         * @param {Mixed} observable Any browser observable, window object, element instances, CSS selector.
         * @param {String/Array[String]} event The name of event or array of such
         * @param {String} [desc] The description of the assertion.
         */
        wontFire : function(observable, event, desc) {
            this.firesOk({
                observable      : observable,
                events          : this.getObjectWithExpectedEvents(event, 0), 
                desc            : desc
            });
        },

        /**
         * This assertion passes if the observable fires the specified event exactly once after calling this method.
         * 
         * @param {Mixed} observable Any browser observable, window object, element instances, CSS selector.
         * @param {String/Array[String]} event The name of event or array of such
         * @param {String} [desc] The description of the assertion.
         */
        firesOnce : function(observable, event, desc) {
            this.firesOk({
                observable      : observable,
                events          : this.getObjectWithExpectedEvents(event, 1), 
                desc            : desc
            });
        },

        /**
         * Alias for {@link #wontFire} method
         * 
         * @param {Mixed} observable Any browser observable, window object, element instances, CSS selector.
         * @param {String/Array[String]} event The name of event or array of such
         * @param {String} [desc] The description of the assertion.
         */
        isntFired : function() {
            this.wontFire.apply(this, arguments);
        },

        /**
         * This assertion passes if the observable fires the specified event at least `n` times after calling this method.
         * 
         * @param {Mixed} observable Any browser observable, window object, element instances, CSS selector.
         * @param {String} event The name of event
         * @param {Number} n The minimum number of events to be fired
         * @param {String} [desc] The description of the assertion.
         */
        firesAtLeastNTimes : function(observable, event, n, desc) {
            this.firesOk(observable, event, '>=' + n, desc);
        },
        
        

        
        /**
         * This assertion will verify that the observable fires the specified event and supplies the correct parameters to the listener function.
         * A checker method should be supplied that verifies the arguments passed to the listener function, and then returns true or false depending on the result.
         * If the event was never fired, this assertion fails. If the event is fired multiple times, all events will be checked, but 
         * only one pass/fail message will be reported.
         * 
         * For example:
         * 

    t.isFiredWithSignature(store, 'add', function (store, records, index) {
        return (store instanceof Ext.data.Store) && (records instanceof Array) && t.typeOf(index) == 'Number'
    })
 
         * @param {Ext.util.Observable/Siesta.Test.ActionTarget} observable Ext.util.Observable instance or target as specified by the {@link Siesta.Test.ActionTarget} rules with 
         * the only difference that component queries will be resolved till the component level, and not the DOM element.
         * @param {String} event The name of event
         * @param {Function} checkerFn A method that should verify each argument, and return true or false depending on the result.
         * @param {String} [desc] The description of the assertion.
         */
        isFiredWithSignature : function(observable, event, checkerFn, description) {
            var eventFired;
            var me              = this;
            var sourceLine      = me.getSourceLine();
            var R               = Siesta.Resource('Siesta.Test.ExtJS.Observable');

            var verifyFiredFn = function () {
                me.removeListenerFromObservable(observable, event, listener)

                if (!eventFired) {
                    me.fail(event + " " + R.get('isFiredWithSignatureNotFired'));
                }
            };
            
            me.on('beforetestfinalizeearly', verifyFiredFn);

            var listener = function () { 
                me.un('beforetestfinalizeearly', verifyFiredFn);
                
                var result = checkerFn.apply(me, arguments);

                if (!eventFired && result) {
                    me.pass(description || R.get('observableFired') + ' ' + event + ' ' + R.get('correctSignature'), {
                        sourceLine  : sourceLine
                    });
                }

                if (!result) {
                    me.fail(description || R.get('observableFired') + ' ' + event + ' ' + R.get('incorrectSignature'), {
                        sourceLine  : sourceLine
                    });
                    
                    // Don't spam the assertion grid with failure, one failure is enough
                    me.removeListenerFromObservable(observable, event, listener)
                }
                eventFired = true 
            };
            
            me.addListenerToObservable(observable, event, listener)
        },


        // This method accepts actionTargets as input (Dom node, string, CQ etc) and does a first normalization pass to get a DOM element.
        // After initial normalization it also tries to locate, the 'top' DOM node at the center of the first pass resulting DOM node.
        // This is the only element we can truly interact with in a real browser.
        // returns an object containing the element plus coordinates
        getNormalizedTopElementInfo : function (actionTarget, skipWarning, actionName, offset) {
            var localXY, globalXY, el;

            actionTarget    = actionTarget || this.currentPosition;
            
            var targetIsPoint   = this.typeOf(actionTarget) == 'Array'

            // First lets get a normal DOM element to work with
            if (targetIsPoint) {
                globalXY    = actionTarget;
                
                var info    = this.elementFromPoint(actionTarget[ 0 ], actionTarget[ 1 ], false, null, true);
                
                el          = info.el
                localXY     = info.localXY
            } else {
                el          = this.normalizeElement(actionTarget, skipWarning);
            }

            if (!el && skipWarning) {
                return;
            }

            // 1. If this element is not visible, something is wrong
            // 2. If element is visible but not reachable (scrolled out of view) this is also an invalid scenario (this check is skipped for IE)
            //    TODO needs further investigation, conflicting with starting a drag operation on an element that isn't visible until the cursor is above it

            // we don't need to this check if target is a coordinate point, because in this case element is reachable by definition
            if (!targetIsPoint) {
                var R       = Siesta.Resource('Siesta.Test.Browser');
                var message = 'getNormalizedTopElementInfo: ' + (actionName ? R.get('targetElementOfAction') + " [" + actionName + "]" : R.get('targetElementOfSomeAction')) +
                    " " + R.get('isNotVisible') + ": " + (el.id ? '#' + el.id : el)
                
                if (!this.isElementVisible(el)){
                    this.fail(message)
                    return;
                }
                else if (!skipWarning && this.isOffsetInsideElementBox(el, offset) && !this.elementIsTop(el, true, offset)) {
                    this.warn(message)
                }
            }

            var isOption = el && el.nodeName.toLowerCase() === 'option';

            if (isOption) {
                localXY = this.currentPosition.slice();
                globalXY = this.currentPosition.slice();
            }
            else if (!targetIsPoint) {
                var doc     = el.ownerDocument;
                var R       = Siesta.Resource('Siesta.Test.Browser');

                localXY     = this.getTargetCoordinate(el, true, offset)
                globalXY    = this.getTargetCoordinate(el, false, offset)

                // trying 2 times for IE
                el          = doc.elementFromPoint(localXY[ 0 ], localXY[ 1 ]) || doc.elementFromPoint(localXY[ 0 ], localXY[ 1 ]) || doc.body;

                if (!el) {
                    this.fail('getNormalizedTopElementInfo: ' + R.get('noElementFound') + ' [' + localXY + ']');
                    return; // No point going further
                }
            }

            return {
                el          : el,
                localXY     : localXY,
                globalXY    : globalXY,
                offset      : isOption ? [0,0] : this.getOffsetRelativeToEl(el, localXY)
            }
        },

        getOffsetRelativeToEl : function(el, point) {
            var box = this.getElementPageRect(el);

            return [ point[0] - box.left, point[1] - box.top ];
        },

        /**
         * This method will wait for the presence of the passed string.
         *
         * @param {String} text The text to wait for
         * @param {Function} callback The callback to call
         * @param {Object} scope The scope for the callback
         * @param {Number} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForTextPresent : function (text, callback, scope, timeout) {
            var R               = Siesta.Resource('Siesta.Test.Browser');

            return this.waitFor({
                method          : function () {
                    var body        = this.global.document.body
                    var selector    = ':contains(' + text + ')'
                    
                    return this.$(selector, body).length > 0 || this.$(body).is(selector); 
                },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForTextPresent',
                description     : ' ' + R.get('text') + ' "' + text + '" ' + R.get('toBePresent')
            });
        },

        /**
         * This method will wait for the absence of the passed string.
         *
         * @param {String} text The text to wait for
         * @param {Function} callback The callback to call
         * @param {Object} scope The scope for the callback
         * @param {Number} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForTextNotPresent : function (text, callback, scope, timeout) {
            var R               = Siesta.Resource('Siesta.Test.Browser');

            return this.waitFor({
                method          : function () { 
                    var body        = this.global.document.body
                    var selector    = ':contains(' + text + ')'
                    
                    return this.$(selector, body).length === 0 && !this.$(body).is(selector); 
                },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForTextNotPresent',
                description     : ' ' + R.get('text') + ' "' + text + '" ' + R.get('toNotBePresent')
            });
        },

        /**
         * Waits until the passed action target is detected. This can be a string such as a component query, CSS query or a composite query.
         *
         * @param {String/Siesta.Test.ActionTarget} target The target presence to wait for
         * @param {Function} callback The callback to call after the target has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForTarget : function(target, callback, scope, timeout, offset) {
            var me = this;
            var R  = Siesta.Resource('Siesta.Test.Browser');

            return this.waitFor({
                method          : function () {
                    var el      = me.normalizeElement(target, true, true, false, { offset : offset })

                    // If user is aiming outside the target, we'll *not* use the offset while
                    // detecting target presence since having a visible sized box will suffice
                    if (el && offset && me.isElementVisible(el) && !me.isOffsetInsideElementBox(el, offset)) {
                        return true;
                    }

                    return el && me.elementIsTop(el, true, offset)
                },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForTarget',
                description     : ' ' + R.get('target') + ' "' + target + '" ' + R.get('toAppear')
            });
        },

        /**
         * Sets a new size for the test iframe
         *
         * @param {Int} width The new width
         * @param {Int} height The new height
         */
        setWindowSize : function(width, height, callback) {
            this.scopeProvider.setViewportSize(width, height);

            callback && callback.call(this);
        },
        
        
        getJUnitClass : function () {
            var browserInfo         = this.getBrowserInfo()
            
            browserInfo             = browserInfo.name + browserInfo.version
            
            return browserInfo + ':' + this.SUPER()
        },

        
        // Returns true if the scope was adjusted to another frame for the target string
        adjustScope : function(target) {

            if (this.typeOf(target) == 'String') {
                var mainParts  = target.split('->');

                if (mainParts.length === 2) {
                    var frameEl = this.$(this.trimString(mainParts[ 0 ]))[ 0 ];

                    if (!frameEl || !frameEl.contentWindow) {
                        return false;
                    }

                    this._global    = this.global;
                    this.global     = frameEl.contentWindow;
                    
                    return true;
                }
            }

            return false;
        },

        
        resetScope : function() {
            this.global     = this._global || this.global;
            
            this._global    = null
        },
        
        
        // a stub method for the Lite package
        screenshot : function (options, callback) {
            this.diag("Command: `screenshot` skipped - not running in Standard Package")
            
            this.processCallbackFromTest(callback, [ 'skipped' ], this)
        },

        // a stub method for the Lite package
        screenshotElement : function (target, fileName, callback) {
            this.diag("Command: `screenshot` skipped - not running in Standard Package")
            
            this.processCallbackFromTest(callback, [ 'skipped' ], this)
        },
        
        /**
         * setUrl Opens the url provided (make sure you use the {@link Siesta.Harness.Browser#separateContext} option on the Harness when using this API method)
         *
         * @param {String} url The new url for current page
         * @param {Function} callback The callback to call after the page has been loaded
         * @param {Object} scope The scope for the callback
         */
        setUrl : function(url, callback, scope) {
            if (!url) throw 'Must provide a valid URL';

            var me = this;

            if (me.global.location.href !== url) {
                var baseUrl = this.scopeProvider.sourceURL || this.harness.baseUrl;
                var absURl  = this.harness.absolutizeURL(url, baseUrl);

                me.waitForPageLoad(callback, scope);
                me.global.location.href = absURl;
            } else {
                callback.call(scope || me);
            }
        },
        
        /**
         * Expects an alert message with the specified text to be shown during the test. If no alert is called,
         * or the text doesn't match, a failed assertion will be added.
         *
         * @param {String/RegExp} message The expected alert message or a regular expression to match
         * @param callback Only used internally when this method is called in a t.chain command
         */
        expectAlertMessage : function (message, callback) {
            var me          = this
            var global      = this.global
            var prevAlert   = global.alert

            global.alert = function (msg) {
                var passed      = me.typeOf(message) == 'RegExp' ? message.test(msg) : message == msg
                
                if (passed)
                    me.pass("Expected alert message has been shown")
                else
                    me.fail("Wrong alert message has been shown", {
                        assertionName       : 'expectAlertMessage',
                        got                 : msg,
                        gotDesc             : "Message shown",
                        need                : message,
                        needDesc            : "Expected message"
                    })
                    
                global.alert = prevAlert
            };
            
            global.alert.__EXPECTED_ALERT__ = true

            this.processCallbackFromTest(callback, null, this)
        },

        /**
         * Sets the confirm dialog return value for the next window.confirm() call.
         *
         * @param {Boolean} value The confirm dialog return value (true or false)
         * @param callback Only used internally when this method is called in a t.chain command
         * */
        setNextConfirmReturnValue : function (value, callback) {
            this.nextConfirmValue = value;

            this.processCallbackFromTest(callback, null, this)
        },

        /**
         * Sets the prompt dialog return value for the next window.prompt() call.
         *
         * @param {String} value The confirm dialog return value
         * @param callback Only used internally when this method is called in a t.chain command
         */
        setNextPromptReturnValue : function (value, callback) {
            this.nextPromptReturnValue = value;

            this.processCallbackFromTest(callback, null, this)
        },
        

        waitForAnimations : function(callback) {
            callback.call(this);
        },
        
        
        popupHasStartedLoading : function (popup, initialUrl) {
            if (String(initialUrl).toLowerCase() != 'about:blank' && popup.location.href == 'about:blank') return false
            
            return true
        },
        
        
        /**
         * Switches the target of all Siesta interactive commands (like "click/type" etc) to a different
         * window (usually a popup). You can use {@link #switchToMain} method to switch back to main window.
         * 
         * @param {String/RegExp/Object/Window/HTMLIFrameElement} [win] A new window which should be a target for all interactive commands.
         * If this argument is specified as `null` a first opened popup is used.
         * Can be specified as the:
         * 
         * - Window - A global window instance
         * - Object - Object with the following properties
         *      - url   : String/RegExp - The first popup, opened with matching url will be used 
         *      - title : String/RegExp - The first popup, opened with matching title will be used
         * - String - corresponds to the `title` property of the Object branch
         * 
         * @param {Function} callback Function to call once the switch has complete (will also wait until the target page 
         * completes loading)
         * 
         * @return {Window} Previously active window reference
         */
        switchTo : function (win, callback) {
            var me          = this
            
            // In Chrome, when popup for some url is just created, it has "url" set to "about:blank"
            // after some time the url is set to the original value and load process begins
            // this opens a race condition - one can not reliably predict when the popup has completed loading
            // doing our best
            this.waitFor({
                method              : function () {
                    for (var i = 0; i < me.popups.length; i++)
                        if (!me.popupHasStartedLoading(me.popups[ i ].popup, me.popups[ i ].url)) return false
                        
                    return true
                },
                suppressAssertion   : true,
                
                callback            : function () {
                    var found
                    
                    if (!win) {
                        Joose.A.each(this.popups, function (handle) {
                            if (!handle.popup.closed) { found = handle.popup;  return false }
                        })
                        
                        win  = found
                    }
                    
                    if (this.typeOf(win) == 'String') win = { title : win }
                    
                    if (this.typeOf(win) == 'Object') {
                        found           = null
                        var regexp      = win.title || win.url
                        
                        if (this.typeOf(regexp) == 'String') regexp = new RegExp('^' + this.escapeRegExp(regexp) + '$')
                        
                        Joose.A.each(this.popups, function (handle) {
                            var popup       = handle.popup
                            
                            if (!popup.closed)
                                if (
                                    win.url && regexp.test(popup.location.href)
                                    ||
                                    win.title && regexp.test(popup.document && popup.document.title || '')
                                ) {
                                    found = popup
                                    return false
                                }
                        })
                        
                        win  = found
                    }
                    
                    if (!win || win.self != win) {
                        this.fail("Can't resolve target win: " + win)
                        
                        this.processCallbackFromTest(callback, null, this)
                        
                        return
                    }
                    
                    this.global                 = win
//                    This has to be revised properly in the "context" branch, idea is, that we switch to popup's implementation
//                    of `setTimeout` for waiting, asyncing etc, because thats what really user expect
//                    however in IE test just hangs
//                    this.originalSetTimeout     = win.setTimeout
//                    this.originalClearTimeout   = win.clearTimeout
                    
                    this.waitFor({
                        suppressAssertion   : true,
                        method      :  function () {
                            return win.document && win.document.readyState == 'complete'
                        },
                        callback    : callback
                    })
                }
            })
            
            return this.global
        },
        
        
        /**
         * Switches all interactive commands back to main test window.
         * 
         * @param {Function} callback Function to call once the switch has complete.
         */
        switchToMain : function (callback) {
            this.switchTo(this.scopeProvider.scope, callback)
        },

        setCursorPosition : function(x, y, callback) {
            this.moveMouse(this.currentPosition, [x,y], null, null, 100000, false);

            callback && callback.call(this);
        },

        /**
         * Only useful along with {@link Siesta.Harness.Browser.separateContext separateContext} option
         *
         * Wait for the page load to occur and runs the callback. The callback will receive a "window" object.
         * Should be used when you are doing a redirect / refresh of the test page:
         *
         *      t.waitForPageLoad(function (window) {
         *          ...
         *      })
         *
         * Note, that method obviously must be called before the new page has completed loading, otherwise it will
         * wait indefinitely and fail (since there will be no page load). So, to avoid the race conditions, one
         * should always start waiting for page load *before* the action, that causes it.
         *
         * Consider the following example (where click on the `>> #loginPanel button` trigger a page redirect):

         // this code does not reliably - it contains a race condition
         // in Chrome, page refresh may happen too fast (even synchronously),
         // so, by the time the `waitForPageLoad` action will start, the page load event will already happen
         // and `waitForPageLoad` will wait indefinitely
         { click : '>> #loginPanel button' },
         { waitFor : 'PageLoad'}
         * &nbsp;

         // Need to start waiting first, and only then - click
         // we'll use "trigger" config of the `wait` action for that
         {
             waitFor     : 'PageLoad',
             trigger     : {
                 click : '>> #loginPanel button'
             }
         }
         // or, same action using function step:
         function (next) {
        t.waitForPageLoad(next)

        t.click('>> #loginPanel button', function () {})
    }

         *
         * @method
         * @member Siesta.Test.Browser
         */
        waitForPageLoad : function (callback, scope) {
            var me              = this

            var global          = this.global
            var unloaded        = false
            var description     = Siesta.Resource('Siesta.Test.More').get('pageToLoad');
            var onUnloadHandler = function () {
                global.removeEventListener('unload', onUnloadHandler)

                unloaded        = true
            }

            global.addEventListener('unload', onUnloadHandler)

            this.chain(
                {
                    description    : description,
                    waitFor : function () {
                        return unloaded || me.global.document.readyState != 'complete'
                    }},
                function (next) {
                    global.removeEventListener('unload', onUnloadHandler)

                    global          = null
                    onUnloadHandler = null

                    next()
                },
                {
                    description    : description,
                    waitFor : function () {
                        return me.global.document.readyState == 'complete'
                    }
                },
                { waitFor : 50 },
                function () {
                    me.processCallbackFromTest(callback, [ me.global ], scope || me)
                }
            )
        },


        /**
         * This method will just call the `setTimeout` method from the scope of the test page.
         *
         * Usually you don't need to use it - you can just call `setTimeout`, but if your test scripts resides in the
         * separate context, you need to use this method for `setTimeout` functionality. See documentation for {@link Siesta.Harness.Browser#separateContext separateContext}
         * option and <a href="#!/guide/cross_page_testing">Cross page testing</a> guide.
         *
         * @param {Function} func The function to call after specified `delay`
         * @param {Number} delay The time to wait (in ms) before calling the `func`
         * @return {Number} timeoutId The id of the timeout, can be passed to {@link #clearTimeout} to cancel the function execution.
         *
         * @method
         * @member Siesta.Test.Browser
         */
        setTimeout : function (func, delay) {
            var pageSetTimeout = this.global.setTimeout

            pageSetTimeout(func, delay)
        },


        /**
         * This method will just call the `clearTimeout` method from the scope of the test page.
         *
         * Usually you don't need to use it - you can just call `clearTimeout`, but if your test scripts resides in the
         * separate context, you need to use this method for `clearTimeout` functionality. See documentation for {@link Siesta.Harness.Browser#separateContext separateContext}
         * option and <a href="#!/guide/cross_page_testing">Cross page testing</a> guide.
         *
         * @param {Number} timeoutId The id of the timeout, recevied from the {@link #setTimeout} call
         *
         * @method
         * @member Siesta.Test.Browser
         */
        clearTimeout : function (id) {
            var pageClearTimeout = this.global.clearTimeout

            pageClearTimeout(id)
        }
    }
});
