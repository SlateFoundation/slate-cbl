/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 @class Siesta.Test.Simulate.Mouse

 This is a mixin, providing the mouse events simulation functionality.
 */

//        Copyright (c) 2011 John Resig, http://jquery.com/

//        Permission is hereby granted, free of charge, to any person obtaining
//        a copy of this software and associated documentation files (the
//        "Software"), to deal in the Software without restriction, including
//        without limitation the rights to use, copy, modify, merge, publish,
//        distribute, sublicense, and/or sell copies of the Software, and to
//        permit persons to whom the Software is furnished to do so, subject to
//        the following conditions:

//        The above copyright notice and this permission notice shall be
//        included in all copies or substantial portions of the Software.

//        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
//        EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//        NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
//        LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
//        OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
//        WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


Role('Siesta.Test.Simulate.Mouse', {

    requires        : [
        'simulateEvent', 'getSimulateEventsWith', 'normalizeElement', 'isTextInput'
    ],

    has: {
        /**
         * @cfg {Int} dragDelay The delay between individual drag events (mousemove)
         */
        dragDelay                       : 25,

        /**
         *  @cfg {Boolean} moveCursorBetweenPoints True to move the mouse cursor between for example two clicks on 
         *  separate elements (for better visual experience)
         */
        moveCursorBetweenPoints         : true,

        pathBatchSize                   : $.browser.msie ? 10 : 5,
        
        mouseMovePrecision              : 1,
        
        enableUnreachableClickWarning   : true,

        autoScrollElementsIntoView      : true,

        overEls                         : Joose.I.Array,
        
        delayAfterScrollIntoView        : 200,
        
        mouseState                      : 'up'
    },


    after : {
        cleanup : function () {
            this.overEls        = null
        }
    },


    methods: {
        // private
        createMouseEvent: function (type, options, el) {
            var event;
            var global      = this.global

            options         = $.extend({
                bubbles     : !/(ms)?(mouse|pointer)enter/i.test(type) && !/(ms)?(mouse|pointer)leave/i.test(type),
                cancelable  : !/(ms)?(mouse|pointer)move/i.test(type),
                view        : global,
                detail      : 0,

                screenX     : 0,
                screenY     : 0,

                ctrlKey     : false,
                altKey      : false,
                shiftKey    : false,
                metaKey     : false,

                button          : 0,
                relatedTarget   : undefined

            }, options);

            if (!("clientX" in options) || !("clientY" in options)) {
                var center  = this.findCenter(el);

                options     = $.extend({
                    clientX: center[0],
                    clientY: center[1]
                }, options);
            }

            // Not supported in IE
            if ("screenX" in window) {
                options = $.extend(options, {
                    screenX: global.screenX + options.clientX,
                    screenY: global.screenY + options.clientY
                });
            }

            var doc         = el.ownerDocument;

            // use W3C standard when available and allowed by "simulateEventsWith" option
            if (doc.createEvent && this.getSimulateEventsWith() == 'dispatchEvent') {
                var isPointer   = type.match(/^(ms)?pointer/i)

                event           = doc.createEvent(isPointer ? (isPointer[ 1 ] ? 'MS' : '') + 'PointerEvent' : 'MouseEvents');

                event[ isPointer ? 'initPointerEvent' : 'initMouseEvent' ](
                    type, options.bubbles, options.cancelable, options.view, options.detail,
                    options.screenX, options.screenY, options.clientX, options.clientY,
                    options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
                    options.button, options.relatedTarget || doc.documentElement,
                    // the following extra args are used in the "initPointerEvent"
                    // offsetX, offsetY
                    null, null,
                    // width, height
                    null, null,
                    // pressure, rotation
                    null, null,
                    // tiltX, tiltY
                    null, null,
                    // pointerId
                    null,
                    // pointerType
                    // NOTE: this has to be set to "mouse" (IE11) or 4 (IE10, 11) because otherwise
                    // ExtJS5 blocks the event
                    // need to investigate what happens in SenchaTouch
                    4,//'mouse',
                    // timestamp, isPrimary
                    null, null
                );


            } else if (doc.createEventObject) {
                event       = doc.createEventObject();

                $.extend(event, options);

                event.button = { 0: 1, 1: 4, 2: 2 }[ event.button ] || event.button;
            }

            // Mouse over is used in some certain edge cases which interfer with this tracking
            if (type !== 'mouseover' && type !== 'mouseout') {
                var elWindow    = doc.defaultView || doc.parentWindow;
                var cursorX     = options.clientX;
                var cursorY     = options.clientY;

                // Potentially we're interacting with an element inside a nested frame, which means the coordinates are local to that frame
                if (elWindow !== global) {
                    var offsets = this.$(elWindow.frameElement).offset();

                    cursorX     += offsets.left;
                    cursorY     += offsets.top;
                }

                if (!options.doNotUpdateCurrentPosition) {
                    this.currentPosition[ 0 ]   = cursorX;
                    this.currentPosition[ 1 ]   = cursorY;
                }
            }

            return event;
        },


        /**
         * This method will simulate a mouse move to an xy-coordinate or an element (the center of it)
         *
         * @param {Siesta.Test.ActionTarget} target Target point to move the mouse to.
         * @param {Function} [callback] To run this method async, provide a callback method to be called after the operation is completed.
         * @param {Object} [scope] the scope for the callback
         * @param {Array} [offset] An X,Y offset relative to the target. Example: [20, 20] for 20px or ["50%", "50%"] to click in the center.
         */
        moveMouseTo : function(target, callback, scope, offset, waitForTarget) {
            if (!target) {
                throw 'Trying to call moveMouseTo without a target';
            }

            // TODO this method should also accept an options object, so user can for example hold CTRL key during mouse operation
//            options.clientX = options.clientX != null ? options.clientX : data.xy[0];
//            options.clientY = options.clientY != null ? options.clientY : data.xy[1];

            if (waitForTarget !== false) {
                this.waitForTargetAndSyncMousePosition(target, offset, function() {
                    this.afterMouseInteraction();
                    callback.call(scope || this);
                }, [], false);
            } else {
                // skip warning about clicking in an unreachable point of the element at this step
                // when mouse position is not yet updated
                // potentially the element will become reachable when the mouse is moved to the required point
                var data        = this.getNormalizedTopElementInfo(target, true, 'moveMouseTo', offset);

                if (data) {
                    this.syncCursor(data.globalXY, callback || function() {});
                } else {
                    // No point in continuing
                    callback && callback.call(scope || this);
                }
            }
        },


        /**
         * Alias for moveMouseTo, this method will simulate a mouse move to an xy-coordinate or an element (the center of it)
         * @param {Siesta.Test.ActionTarget} target Target point to move the mouse to.
         * @param {Function} [callback] To run this method async, provide a callback method to be called after the operation is completed.
         * @param {Object} [scope] the scope for the callback
         * @param {Array} [offset] An X,Y offset relative to the target. Example: [20, 20] for 20px or ["50%", "50%"] to click in the center.
         */
        moveCursorTo : function(target, callback, scope, offset) {
            this.moveMouseTo.apply(this, arguments);
        },

        /**
         * This method will simulate a mouse move by an x a y delta amount
         * @param {Array} delta The delta x and y distance to move, e.g. [20, 20] for 20px down/right, or [0, 10] for just 10px down.
         * @param {Function} [callback] To run this method async, provide a callback method to be called after the operation is completed.
         * @param {Object} [scope] the scope for the callback
         */
        moveMouseBy : function(delta, callback, scope) {
            this.moveCursorBy.apply(this, arguments);
        },

        /**
         * This method will simulate a mouse move by an x and y delta amount
         * @param {Array} delta The delta x and y distance to move, e.g. [20, 20] for 20px down/right, or [0, -10] for 10px up.
         * @param {Function} [callback] To run this method async, provide a callback method to be called after the operation is completed.
         * @param {Object} [scope] the scope for the callback
         */
        moveCursorBy : function(delta, callback, scope) {
            if (!delta) {
                throw 'Trying to call moveCursorBy without relative distances';
            }

            // Normalize target
            var target = [this.currentPosition[0] + delta[0], this.currentPosition[1] + delta[1]];

            this.moveMouse(this.currentPosition, target, callback, scope);
        },

        // private
        moveMouse : function (xy, xy2, callback, scope, pathBatchSize, async, options, mouseMovePrecision) {
            var me          = this

            this.movePointerTemplate({
                xy              : xy,
                xy2             : xy2,
                callback        : callback,
                scope           : scope,
                options         : options || {},

                overEls         : this.overEls,
                interval        : async !== false ? this.dragDelay : 0,
                callbackDelay   : async !== false ? 50 : 0,
                pathBatchSize   : pathBatchSize || me.pathBatchSize,
                mouseMovePrecision : mouseMovePrecision || me.mouseMovePrecision,

                onVoidOverEls   : function () {
                    return me.overEls  = []
                },

                onPointerEnter  : function (el, options, suppressLog) {
                    me.simulateEvent(el, "mouseenter", options, suppressLog)
                },

                onPointerLeave  : function (el, options, suppressLog) {
                    me.simulateEvent(el, "mouseleave", options, suppressLog)
                },

                onPointerOver   : function (el, options, suppressLog) {
                    me.simulateEvent(el, "mouseover", options, suppressLog)
                },

                onPointerOut    : function (el, options, suppressLog) {
                    me.simulateEvent(el, "mouseout", options, suppressLog)
                },

                onPointerMove   : function (el, options, suppressLog) {
                    me.simulateEvent(el, "mousemove", options, suppressLog)
                }
            })
        },
        
        
        nodeIsUnloaded : function (el) {
            try {
                el && el.tagName
                
                var doc     = el.ownerDocument
                var win     = doc && (doc.defaultView || doc.parentWindow)
                
                return !Boolean(win)
            } catch (e) {
                // exception here probably means the "lastOverEl" is from freed context (unloaded page)
                // access to such elements throws exceptions in IE
                el          = null
                
                return true
            }
        },


        // xy, xy2, overEls, callback, scope, pathBatchSize, interval, callbackDelay, options,
        // onPointerEnter, onPointerLeave, onPointerOver, onPointerOut, onPointerMove
        movePointerTemplate: function (args) {
            var document    = this.global.document,
                me          = this,
                overEls     = args.overEls,
                // Remember last visited element, since a previous action may have changed the DOM
                // which possibly should trigger a mouseout event
                lastOverEl  = overEls[ overEls.length - 1 ];
                
            if (lastOverEl && this.nodeIsUnloaded(lastOverEl)) {
                lastOverEl  = null
                overEls     = args.onVoidOverEls()
            }
            
            // always simulate drag with 1px precision
            var mouseMovePrecision  = me.mouseState == 'down' ? 1 : args.mouseMovePrecision || me.mouseMovePrecision
            var pathBatchSize       = Math.max(args.pathBatchSize, mouseMovePrecision)
            var options             = args.options || {}

            var path        = this.getPathBetweenPoints(args.xy, args.xy2);

            var supports    = Siesta.Harness.Browser.FeatureSupport().supports

            var queue       = new Siesta.Util.Queue({
                deferer         : this.originalSetTimeout,
                deferClearer    : this.originalClearTimeout,

                interval        : args.interval,
                callbackDelay   : args.callbackDelay,

                observeTest     : this,

                processor       : function (data, index) {
                    var fromIndex   = data.sourceIndex,
                        toIndex     = data.targetIndex;
                        
//                    console.log("from index: %s, to index: %s", fromIndex, toIndex)
                        
                    // replace 0 with 1 to avoid infinite loop
                    var delta       = Math.min(toIndex - fromIndex, mouseMovePrecision) || 1

                    for (var j = fromIndex; j <= toIndex; j += delta) {
                        var point       = path[ j ];
                        
//                        console.log("point : " + point)
                        
                        var x           = point[ 0 ]
                        var y           = point[ 1 ]
                        var targetEl    = me.elementFromPoint(x, y);

                        // Might get null here if moving over a non-initialized frame (seen in Chrome)
                        if (targetEl) {

                            if (targetEl.ownerDocument !== document) {
                                var win = targetEl.ownerDocument.defaultView || targetEl.ownerDocument.parentWindow;

                                var offsetsToTopWindow = me.$(win.frameElement).offset();

                                x       -= offsetsToTopWindow.left;
                                y       -= offsetsToTopWindow.top;
                            }

                            if (targetEl !== lastOverEl) {
                                for (var i = overEls.length - 1; i >= 0; i--) {
                                    var el = overEls[ i ];
                                    
                                    if (me.nodeIsUnloaded(el))
                                        overEls.splice(i, 1);
                                    else
                                        if (el !== targetEl && me.$(el).has(targetEl).length === 0) {
                                            if (supports.mouseEnterLeave) {
                                                args.onPointerLeave(el, $.extend({ clientX: x, clientY: y, relatedTarget : targetEl}, options))
                                            }
                                            overEls.splice(i, 1);
                                        }
                                }

                                if (lastOverEl) {
                                    args.onPointerOut(lastOverEl, $.extend({ clientX: x, clientY: y, relatedTarget : targetEl}, options))
                                }

                                if (supports.mouseEnterLeave && jQuery.inArray(targetEl, overEls) == -1) {
                                    var els                 = []
                                    var docEl               = targetEl.ownerDocument.documentElement

                                    var mouseEnterEl        = targetEl

                                    // collecting all the els for which to fire the "mouseenter" event, strictly speaking these can be any elements
                                    // (because of absolute positioning) but in most cases it will be just parent elements
                                    while (mouseEnterEl && mouseEnterEl != docEl) {
                                        els.unshift(mouseEnterEl)
                                        mouseEnterEl        = mouseEnterEl.parentNode
                                    }

                                    for (var i = 0; i < els.length; i++) {
                                        if (jQuery.inArray(els[ i ], overEls) == -1) {
                                            args.onPointerEnter(els[ i ], $.extend({ clientX: x, clientY: y, relatedTarget : lastOverEl}, options))

                                            overEls.push(els[ i ]);
                                        }
                                    }
                                }

                                args.onPointerOver(targetEl, $.extend({ clientX: x, clientY: y, relatedTarget : lastOverEl}, options))

                                lastOverEl = targetEl;
                            }

                            args.onPointerMove(targetEl, $.extend({ clientX: x, clientY: y }, options), j < toIndex)
                        }
                        // eof (targetEl)
                    }
                    // eof for
                }
            });

            for (var i = 0, l = path.length; i < l; i += pathBatchSize) {
                queue.addStep({
                    sourceIndex       : i,
                    targetIndex       : Math.min(i + pathBatchSize - 1, path.length - 1)
                });
            }

            var async2       = this.beginAsync()

            queue.run(function () {
                me.endAsync(async2);

                me.processCallbackFromTest(args.callback, null, args.scope || me)
            })
        },

        // This method is called before mouse interactions (the "method" param, along with its "args") to assure that target is visible and reachable.
        // It also handles cases where the target is moved or made unreachable while the cursor is moving towards it.
        // In such unusual cases, a wait is added and the method calls itself to start over
        waitForTargetAndSyncMousePosition : function(target, offset, method, args, waitForTargetTop, syncMousePosition) {
            var originalXY;
            var targetIsNotAPoint                   = this.typeOf(target) != 'Array';
            var oldSuppressPassedWaitForAssertion   = this.suppressPassedWaitForAssertion;
            
            this.suppressPassedWaitForAssertion     = true;

            this.chain(
                { waitForAnimations : [] },

                // Initial wait for target to be
                // 1. in the dom,
                // 2. visible
                targetIsNotAPoint && { waitForElementVisible : target },

                targetIsNotAPoint && this.autoScrollElementsIntoView 
                    ? 
                function (next) {
                    if (this.scrollTargetIntoView(target, offset) === true)
                        // this "waitFor" has been added because of Ext6 behaviour (see https://www.assembla.com/spaces/bryntum/tickets/2211#/activity/ticket:)
                        // Ext6 listens to scroll event on grid view and sets the "pointer-event : none" on the grid view el in the handler
                        // Problem happens during click.
                        // Seems, depending from browser engine, "scroll" event may be fired after slight delay, already after the "mousedown"
                        // even has been fired, then, with "pointer-events" none on grid view, grid container becomes a top element
                        // and further `mouseup` and `click` happens on it, instead of original element
                        // the "pointer-event" style is reset back in the another ExtJS handler, which is buffered for 100ms
                        // so we need to wait > 100ms, waiting for 200ms
                        // potential race condition
                        this.waitFor(this.delayAfterScrollIntoView, next)
                    else
                        next()
                }
                    :
                null,
                    
                function (next) {
                    var data    = this.getNormalizedTopElementInfo(target, true, method.toString(), offset);

                    originalXY  = data.globalXY;

                    if (this.moveCursorBetweenPoints && syncMousePosition !== false) {
                        this.syncCursor(originalXY, next);
                    } else {
                        next();
                    }
                },

                // After moving cursor, we again wait as something might have changed in the while we moved the cursor
                waitForTargetTop !== false && targetIsNotAPoint && function (next) {
                    this.waitForTarget(target, next, this, null, offset);
                },

                function(next) {
                    var data = this.getNormalizedTopElementInfo(target, true, method.toString(), offset);
                    var newXY = data && data.globalXY;

                    // If target has moved or disappeared, start over after a short wait
                    if (targetIsNotAPoint && (!data || originalXY[0] !== newXY[0] || originalXY[1] !== newXY[1])){
                        this.diag(Siesta.Resource('Siesta.Test.Browser','targetMoved'));

                        this.waitFor(100, function() {
                            this.waitForTargetAndSyncMousePosition(target, offset, method, args, waitForTargetTop, syncMousePosition);
                        });
                    } else {
                        this.suppressPassedWaitForAssertion = oldSuppressPassedWaitForAssertion;

                        // Here we're done - call original method
                        method.apply(this, args);
                    }
                }
            )
        },

        // Check if the mouse interaction triggered a DOM update causing the last interacted element to be removed from the DOM
        // In this case we should simulate a new 'mouseover' event on whatever appeared under the cursor.
        afterMouseInteraction : function() {
            var overEls         = this.overEls,
                lastOverEl      = overEls[ overEls.length - 1 ]

            // URL might have changed, then ignore
            if (!this.global.document.body) return;

            if (lastOverEl) {
                if (this.nodeIsUnloaded(lastOverEl)) {
                    lastOverEl  = null
                    this.overEls = []
                    
                    // after page reload we want to simulate the `mouseover` 
                    // for the element appeared at the current cursor position
                    this.mouseOver(this.currentPosition);
                } else {
                    var doc     = lastOverEl.ownerDocument;

                    if (!$.contains(lastOverEl, doc.body)) 
                        this.mouseOver(this.currentPosition);
                }
            }
        },


        // el - the target
        // callback
        // scope
        // options for the events emitted
        // actionName (string) - "rightClick", "click" or "doubleClick"
        // offset
        // performTargetCheck, true to waitFor target appearing - false to avoid
        genericMouseClick : function (el, callback, scope, options, actionName, offset, performTargetCheck) {
            if (jQuery.isFunction(el)) {
                scope       = callback;
                callback    = el;
                el          = null;
            }

            el              = el || this.currentPosition

            if (performTargetCheck !== false && callback) {
                this.waitForTargetAndSyncMousePosition(el, offset, this.genericMouseClick, [el, callback, scope, options, actionName, offset, false]);
                return;
            }

            options         = options || {};

            // skip warning about clicking in an unreachable point of the element at this step
            // when mouse position is not yet updated
            // potentially the element will become reachable when the mouse is moved to the required point
            var data        = this.getNormalizedTopElementInfo(el, true, actionName, offset);
            
            if (!data) {
                // No point in continuing
                callback && callback.call(scope || this);
                return;
            }

            // marking data as preliminary, indicating that it should be updated before the click
            data.originalEl     = el
            data.method         = actionName
            data.offset         = offset

            options.clientX = options.clientX != null ? options.clientX : data.localXY[ 0 ];
            options.clientY = options.clientY != null ? options.clientY : data.localXY[ 1 ];

            this[ actionName ](data, callback, scope, options);
        },

        /**
         * This method will simulate a mouse click in the center of the specified DOM/Ext element,
         * or at current cursor position if no target is provided.
         *
         * Note, that it will first calculate the centeral point of the specified element and then
         * will pick the top-most DOM element from that point. For example, if you will provide a grid row as the `el`,
         * then click will happen on top of the central cell, and then will bubble to the row itself.
         * In most cases this is the desired behavior.
         *
         * The following events will be fired, in order:  `mouseover`, `mousedown`, `mouseup`, `click`
         *
         * Example:
         *
         *      t.click(t.getFirstRow(grid), function () { ... })
         *
         * The 1st argument for this method can be omitted. In this case, Siesta will use the current cursor position:
         *
         *      t.click(function () { ... })
         *
         * @param {Siesta.Test.ActionTarget} [el] One of the {@link Siesta.Test.ActionTarget} values to convert to DOM element
         * @param {Function} [callback] A function to call after click.
         * @param {Object} [scope] The scope for the callback
         * @param {Object} [options] Any options to use for the simulated DOM event
         * @param {Array} [offset] An X,Y offset relative to the target. Example: [20, 20] for 20px or ["50%", "100%-2"] to click in the center horizontally and 2px from the bottom edge.
         */
        click: function (el, callback, scope, options, offset, waitForTarget) {
            this.genericMouseClick(el, callback, scope, options, 'simulateMouseClick', offset, waitForTarget)
        },


        /**
         * This method will simulate a mouse right click in the center of the specified DOM/Ext element,
         * or at current cursor position if no target is provided.
         *
         * Note, that it will first calculate the centeral point of the specified element and then
         * will pick the top-most DOM element from that point. For example, if you will provide a grid row as the `el`,
         * then click will happen on top of the central cell, and then will bubble to the row itself.
         * In most cases this is the desired behavior.
         *
         * The following events will be fired, in order:  `mouseover`, `mousedown`, `mouseup`, `contextmenu`
         *
         * Example:
         *
         *      t.click(t.getFirstRow(grid), function () { ... })
         *
         * The 1st argument for this method can be omitted. In this case, Siesta will use the current cursor position:
         *
         *      t.click(function () { ... })
         *
         * @param {Siesta.Test.ActionTarget} [el] One of the {@link Siesta.Test.ActionTarget} values to convert to DOM element
         * @param {Function} [callback] A function to call after click.
         * @param {Object} [scope] The scope for the callback
         * @param {Object} [options] Any options to use for the simulated DOM event
         * @param {Array} [offset] An X,Y offset relative to the target. Example: [20, 20] for 20px or ["50%", "100%-2"] to click in the center horizontally and 2px from the bottom edge.
         */
        rightClick: function (el, callback, scope, options, offset, waitForTarget) {
            this.genericMouseClick(el, callback, scope, options, 'simulateRightClick', offset, waitForTarget)
        },


        /**
         * This method will simulate a mouse double click in the center of the specified DOM/Ext element,
         * or at current cursor position if no target is provided.
         *
         * Note, that it will first calculate the centeral point of the specified element and then
         * will pick the top-most DOM element from that point. For example, if you will provide a grid row as the `el`,
         * then click will happen on top of the central cell, and then will bubble to the row itself.
         * In most cases this is the desired behavior.
         *
         * The following events will be fired, in order:  `mouseover`, `mousedown`, `mouseup`, `click`, `mousedown`, `mouseup`, `click`, `dblclick`
         *
         * Example:
         *
         *      t.click(t.getFirstRow(grid), function () { ... })
         *
         * The 1st argument for this method can be omitted. In this case, Siesta will use the current cursor position:
         *
         *      t.click(function () { ... })
         *
         * @param {Siesta.Test.ActionTarget} [el] One of the {@link Siesta.Test.ActionTarget} values to convert to DOM element
         * @param {Function} [callback] A function to call after click.
         * @param {Object} [scope] The scope for the callback
         * @param {Object} [options] Any options to use for the simulated DOM event
         * @param {Array} [offset] An X,Y offset relative to the target. Example: [20, 20] for 20px or ["50%", "100%-2"] to click in the center horizontally and 2px from the bottom edge.
         */
        doubleClick: function (el, callback, scope, options, offset, waitForTarget) {
            this.genericMouseClick(el, callback, scope, options, 'simulateDoubleClick', offset, waitForTarget)
        },

        /**
         * This method will simulate a mousedown event in the center of the specified DOM element,
         * or at current cursor position if no target is provided.
         *
         * @param {Siesta.Test.ActionTarget} el
         * @param {Object} options any extra options used to configure the DOM event
         * @param {Array} [offset] An X,Y offset relative to the target. Example: [20, 20] for 20px or ["50%", "100%-2"] to click in the center horizontally and 2px from the bottom edge.
         * @param {Function} [callback] A function to call after mousedown.
         * @param {Object} [scope] The scope for the callback
         */
        mouseDown: function (el, options, offset, callback, scope, performTargetCheck) {
            this.genericMouseClick(el, callback, scope, options, 'simulateMouseDown', offset, performTargetCheck);
        },

        simulateMouseDown: function (clickInfo, callback, scope, options) {
            this.processMouseClickSteps(
                clickInfo,
                callback,
                scope,
                options,
                [
                    { event : "mousedown", focus : true }
                ]
            );
        },

        /**
         * This method will simulate a mousedown event in the center of the specified DOM element,
         * or at current cursor position if no target is provided.
         *
         * @param {Siesta.Test.ActionTarget} el
         * @param {Object} options any extra options used to configure the DOM event
         * @param {Array} [offset] An X,Y offset relative to the target. Example: [20, 20] for 20px or ["50%", "100%-2"] to click in the center horizontally and 2px from the bottom edge.
         */
        mouseUp: function (el, options, offset) {
            var info        = this.getNormalizedTopElementInfo(el, true, 'mouseUp', offset);

            if (!info) return;

            options         = options || {}

            options.clientX = options.clientX != null ? options.clientX : info.localXY[0];
            options.clientY = options.clientY != null ? options.clientY : info.localXY[1];

            el              = info.el || el;

            this.simulateEvent(el, 'mouseup', options);
        },

        /**
         * This method will simulate a mouseover event in the center of the specified DOM element.
         *
         * @param {Siesta.Test.ActionTarget} el
         * @param {Object} options any extra options used to configure the DOM event
         */
        mouseOver: function (el, options) {
            var info        = this.getNormalizedTopElementInfo(el, true);

            if (!info) return;

            options         = options || {}

            options.clientX = options.clientX != null ? options.clientX : info.localXY[0];
            options.clientY = options.clientY != null ? options.clientY : info.localXY[1];

            this.simulateEvent(el, 'mouseover', options);
        },

        /**
         * This method will simulate a mouseout event in the center of the specified DOM element.
         *
         * @param {Siesta.Test.ActionTarget} el
         * @param {Object} options any extra options used to configure the DOM event
         */
        mouseOut: function (el, options) {
            var info        = this.getNormalizedTopElementInfo(el, true);

            if (!info) return;

            options         = options || {}

            options.clientX = options.clientX != null ? options.clientX : info.localXY[0];
            options.clientY = options.clientY != null ? options.clientY : info.localXY[1];

            this.simulateEvent(el, 'mouseout', options);
        },


        processMouseClickSteps : function (clickInfo, callback, scope, options, steps) {
            // trying to get the top element again, enabling the warning if needed
            // do it here and not in the `genericMouseClick` method to allow scenario
            // when target element appears when mouse moves to the click point
            if (clickInfo.originalEl && this.enableUnreachableClickWarning) {
                this.getNormalizedTopElementInfo(clickInfo.originalEl, false, clickInfo.method, clickInfo.offset)
            }

            var me          = this

            var x           = clickInfo.globalXY[ 0 ]
            var y           = clickInfo.globalXY[ 1 ]
            var isOption    = clickInfo.el.nodeName.toLowerCase() === 'option';

            var doc         = me.global.document
            
            var prevScrollTop   = doc.body.scrollTop

            // re-evaluate the target el - it might have changed while we were syncing the cursor position
            var target      = isOption ? clickInfo.el : me.elementFromPoint(x, y, false, clickInfo.el)

            var targetHasChanged    = false

            var queue       = new Siesta.Util.Queue({
                deferer         : this.originalSetTimeout,
                deferClearer    : this.originalClearTimeout,

                interval        : callback ? 10 : 0,
                callbackDelay   : me.afterActionDelay,

                observeTest     : this,

                processor       : function (data) {
                    // XXX this has to be investigated more deeply (notably the <body> vs <html> scrolling, etc)
                    // - When simulating events browser performs weird scrolls on the document.
                    // Seems it tries to make the point of simulated event visible on the screen.
                    // This is native browser behavior over of our control.
                    // Thing is, when the document is scrolled, `elementFromPoint` returns different
                    // element for the same point. Because of that the logic for clicks is vulnerable.
                    // Scenario is - "mousedown" (or may be "mouseup") is simulated, scroll position changes
                    // futher "click" event happens on different element
                    
                    // body can be absent if the doubleclick happens on the anchor and page is reloaded in the middle 
                    // of double click
                    var delta       = doc.body ? doc.body.scrollTop - prevScrollTop : 0
                    var el          = isOption ? target : me.elementFromPoint(x, y - delta, false, target)

                    if (!isOption && data.recaptureTarget) { target = el; targetHasChanged = false }

                    // The "click" event should be canceled if "mousedown/up" happened on different elements,
                    // _unless_ these elements has parent/child relationship
                    if (!isOption && el != target && !($.contains(el, target) || $.contains(target, el))) targetHasChanged = true

                    if (targetHasChanged && data.cancelIfTargetChanged) return

                    var event = me.simulateEvent(el, data.event, options, data.suppressLog);
                    
                    if (event.type == 'mousedown') 
                        me.mouseState    = 'down'
                    else
                        if (event.type == 'mouseup')
                            me.mouseState    = 'up'

                    if (data.focus) me.mimicFocusOnMouseDown(el, event)
                }
            })

            Joose.A.each(steps, function (step) { queue.addStep(step) })

            var async   = me.beginAsync();

            queue.run(function () {
                me.endAsync(async);

                me.afterMouseInteraction();

                me.processCallbackFromTest(callback, null, scope || me)
            })
        },


        // private
        simulateMouseClick: function (clickInfo, callback, scope, options) {
            this.processMouseClickSteps(
                clickInfo,
                callback,
                scope,
                options,
                [
                    { event : "mousedown", suppressLog : true, focus : true },
                    { event : "mouseup", suppressLog : true },
                    { event : "click", suppressLog : false, cancelIfTargetChanged : true }
                ]
            )
        },

        // private
        simulateRightClick: function (clickInfo, callback, scope, options) {
            // Mac doesn't fire mouseup when right clicking
            var isMac = navigator.platform.indexOf('Mac') > -1;

            options         = options || {};
            options.button  = 2;

            this.processMouseClickSteps(
                clickInfo,
                callback,
                scope,
                options,
                [
                    { event : "mousedown", suppressLog : false, focus : true }
                ].concat(isMac ? [] :
                    [{ event : "mouseup", suppressLog : true }]
                ).concat(
                    [{ event : "contextmenu", suppressLog : false }]
                )
            )
        },

        // private
        simulateDoubleClick: function (clickInfo, callback, scope, options) {
            this.processMouseClickSteps(
                clickInfo,
                callback,
                scope,
                options,
                [
                    { event : "mousedown", suppressLog : false, focus : true },
                    { event : "mouseup", suppressLog : true },
                    { event : "click", suppressLog : false, cancelIfTargetChanged : true },
                    { event : "mousedown", suppressLog : false, recaptureTarget : true, focus : true },
                    { event : "mouseup", suppressLog : true },
                    { event : "click", suppressLog : true, cancelIfTargetChanged : true },
                    { event : "dblclick", suppressLog : false, cancelIfTargetChanged : true }
                ]
            )
        },

        // private
        syncCursor : function(toXY, callback, args) {
            var me          = this
            var fromXY      = this.currentPosition;

            args            = args || [];

            if (toXY[0] !== fromXY[0] || toXY[1] !== fromXY[1]) {

                this.moveMouse(fromXY, toXY, function() {
                    callback && callback.apply(me, args);
                });
            } else
            // already aligned
                callback && callback.apply(this, args);
        },


        /**
         * This method will simulate a drag and drop operation between either two points or two DOM elements.
         * The following events will be fired, in order:  `mouseover`, `mousedown`, `mousemove` (along the mouse path), `mouseup`
         *
         * @deprecated This method is deprecated in favor of {@link #dragTo} and {@link #dragBy} methods
         * @param {Siesta.Test.ActionTarget} source Either an element, or [x,y] as the drag starting point
         * @param {Siesta.Test.ActionTarget} [target] Either an element, or [x,y] as the drag end point
         * @param {Array} [delta] the amount to drag from the source coordinate, expressed as [x,y]. [50, 10] will drag 50px to the right and 10px down.
         * @param {Function} [callback] To run this method async, provide a callback method to be called after the drag operation is completed.
         * @param {Object} [scope] the scope for the callback
         * @param {Object} options any extra options used to configure the DOM event
         */
        drag: function (source, target, delta, callback, scope, options) {
            if (!source) {
                throw 'No drag source defined';
            }

            if (target) {
                this.dragTo(source, target, callback, scope, options);
            } else {
                this.dragBy(source, delta, callback, scope, options);
            }
        },

        /**
         * This method will simulate a drag and drop operation between either two points or two DOM elements.
         * The following events will be fired, in order:  `mouseover`, `mousedown`, `mousemove` (along the mouse path), `mouseup`
         *
         * @param {Siesta.Test.ActionTarget} source {@link Siesta.Test.ActionTarget} value for the drag starting point
         * @param {Siesta.Test.ActionTarget} target {@link Siesta.Test.ActionTarget} value for the drag end point
         * @param {Function} [callback] To run this method async, provide a callback method to be called after the drag operation is completed.
         * @param {Object} [scope] the scope for the callback
         * @param {Object} options any extra options used to configure the DOM event
         * @param {Boolean} dragOnly true to skip the mouseup and not finish the drop operation.
         * @param {Array} [sourceOffset] An X,Y offset relative to the source. Example: [20, 20] for 20px or ["50%", "100%-2"] to click in the center horizontally and 2px from the bottom edge.
         * @param {Array} [targetOffset] An X,Y offset relative to the target. Example: [20, 20] for 20px or ["50%", "100%-2"] to click in the center horizontally and 2px from the bottom edge.
         */
        dragTo : function (source, target, callback, scope, options, dragOnly, sourceOffset, targetOffset, performTargetCheck) {
            if (!target) throw 'No drag target defined';

            source              = source || this.currentPosition;
            options             = options || {};

            if (performTargetCheck !== false && callback) {
                this.waitForTargetAndSyncMousePosition(source, sourceOffset, this.dragTo, [source, target, callback, scope, options, dragOnly, sourceOffset, targetOffset, false]);
                return;
            }

            // normalize source and target
            var sourceContext   = this.getNormalizedTopElementInfo(source, true, 'dragTo: Source', sourceOffset);
            var targetContext   = this.getNormalizedTopElementInfo(target, false, 'dragTo: Target', targetOffset);

            if (!targetContext) {
                this.processCallbackFromTest(callback, null, scope || this);
                return;
            }

            this.simulateDrag(sourceContext.globalXY, targetContext.globalXY, function() {
                this.afterMouseInteraction();

                callback.call(scope || this);
            }, null, options, dragOnly);
        },

        /**
         * This method will simulate a drag and drop operation from a point (or DOM element) and move by a delta.
         * The following events will be fired, in order:  `mouseover`, `mousedown`, `mousemove` (along the mouse path), `mouseup`
         *
         * @param {Siesta.Test.ActionTarget} source {@link Siesta.Test.ActionTarget} value as the drag starting point
         * @param {Array} delta The amount to drag from the source coordinate, expressed as [x,y]. E.g. [50, 10] will drag 50px to the right and 10px down.
         * @param {Function} [callback] To run this method async, provide a callback method to be called after the drag operation is completed.
         * @param {Object} [scope] the scope for the callback
         * @param {Object} options any extra options used to configure the DOM event
         * @param {Boolean} dragOnly true to skip the mouseup and not finish the drop operation.
         * @param {Array} [offset] An X,Y offset relative to the target. Example: [20, 20] for 20px or ["50%", "100%-2"] to click in the center horizontally and 2px from the bottom edge.
         */
        dragBy : function (source, delta, callback, scope, options, dragOnly, offset, performTargetCheck) {
            if (!delta) throw 'No drag delta defined';

            source              = source || this.currentPosition;

            if (performTargetCheck !== false && callback) {
                this.waitForTargetAndSyncMousePosition(source, offset, this.dragBy, [source, delta, callback, scope, options, dragOnly, offset, false]);
                return;
            }

            var sourceContext   = this.getNormalizedTopElementInfo(source, true, 'dragBy: Source', offset);

            if (!sourceContext) {
                // No target found, abort.
                callback && callback.call(scope || this);
                return;
            }
            var sourceXY        = sourceContext.globalXY;
            var targetXY        = [ sourceXY[0] + delta[0], sourceXY[1] + delta[1] ];

            this.simulateDrag(sourceXY, targetXY, function() {
                this.afterMouseInteraction();

                callback.call(scope || this);
            }, null, options, dragOnly);
        },

        // private
        simulateDrag: function (sourceXY, targetXY, callback, scope, options, dragOnly) {
            var me          = this
            options         = options || {};

            // For drag operations we should always use the top level document.elementFromPoint
            var source      = me.elementFromPoint(sourceXY[0], sourceXY[1], false);
            var target      = me.elementFromPoint(targetXY[0], targetXY[1], false);

            var queue       = new Siesta.Util.Queue({
                deferer         : this.originalSetTimeout,
                deferClearer    : this.originalClearTimeout,

                interval        : me.dragDelay,
                callbackDelay   : me.afterActionDelay,

                observeTest     : this
            });

            queue.addStep({
                processor : function () {
                    me.simulateEvent(source, "mouseover", $.extend({ clientX: sourceXY[0], clientY: sourceXY[1]}, options));
                }
            });

            queue.addStep({
                processor : function () {
                    // Fetch source el again since the mouseover might trigger another element to go visible.
                    source  = me.elementFromPoint(sourceXY[0], sourceXY[1], false, source);
                    me.simulateEvent(source, "mouseover", $.extend({ clientX: sourceXY[0], clientY: sourceXY[1]}, options));
                }
            });

            queue.addStep({
                processor : function () {
                    var event = me.simulateEvent(source, "mousedown", $.extend({ clientX: sourceXY[0], clientY: sourceXY[1]}, options));

                    me.mimicFocusOnMouseDown(source, event);
                }
            });

            queue.addStep({
                isAsync     : true,

                processor   : function (data) {
                    me.moveMouse(sourceXY, targetXY, data.next, this, null, true, options, 1);
                }
            });

            var el;

            queue.addStep({
                processor : function () {
                    el      = me.elementFromPoint(targetXY[0], targetXY[1], false);
                    me.simulateEvent(el, 'mouseover', $.extend({ clientX: targetXY[0], clientY: targetXY[1] }, options));
                }
            });

            if (!dragOnly) {
                queue.addStep({
                    processor : function () {
                        me.simulateEvent(el, 'mouseup', $.extend({ clientX: targetXY[0], clientY: targetXY[1] }, options));
                    }
                });

                queue.addStep({
                    processor : function () {
                        if (el && (el === source || $.contains(source, el))) {
                            me.simulateEvent(source, 'click', $.extend({ clientX: targetXY[0], clientY: targetXY[1] }, options));
                        }
                    }
                });
            }


            var async       = this.beginAsync();

            queue.run(function () {
                me.endAsync(async)

                me.processCallbackFromTest(callback, null, scope || me)
            });
        },

        mimicFocusOnMouseDown : function (el, mouseDownEvent) {

            // only do focus if `mousedown` event is not prevented by outside world
            if (this.isEventPrevented(mouseDownEvent)) return;

            // if we've clicked text input element just do regular focus
            if (this.isElementFocusable(el)) {
                this.focus(el, true)
                return
            }

            var doc         = el.ownerDocument
            var win         = doc.defaultView || doc.parentWindow
            var body        = doc.body

            if (!body) return;

            // otherwise focus the nearest parent with non-null `tabIndex` attribute
            // as an edge case an "<html> element can be clicked
            while (el && el != body && el != doc) {
                // IE-specific: don't look up the parent nodes when clicked an element with "unselectable" attribute set to "on"
                // and do not focus the body
                // "unselectable" attr should not be used to determine focusability state
                if ($.browser.msie && el.getAttribute('unselectable') == 'on') return

                if (this.isElementFocusable(el)) {
                    this.focus(el, true)
                    return
                }

                el          = el.parentNode
            }

            // focus body as the last resort to trigger the "blur" event on the currently focused element
            this.focus(body || doc.documentElement, true)
        }
    }
});
