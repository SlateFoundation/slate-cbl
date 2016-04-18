/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.Element

This is a mixin, with helper methods for testing functionality relating to DOM elements. This mixin is consumed by {@link Siesta.Test}

*/
Role('Siesta.Test.Element', {

    requires    : [
        'typeOf',
        'chain',
        'normalizeElement'
    ],
    
    has : {
        allowMonkeyToClickOnAnchors     : false,
        
        allowedCharacters               : function () {
            return {
                // does not include TAB by purpose, because our "TAB" simulation is not perfect
                // Also exclude BACKSPACE since it navigates the page
                special     : 'ENTER/ESCAPE/PAGE-UP/PAGE-DOWN/END/HOME/UP/RIGHT/DOWN/LEFT/INSERT/DELETE',
                // does not inlcude * because Ext fails on typing it
                punctuation : '.,/()[]{}\\"\'`~!?@#$%^&_=+-',
                normal      : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
            }
        }
    },

    methods : {

        /**
         * Utility method which returns the center of a passed element. The coordinates are by default relative to the
         * containing document of the element (so for example if the element is inside of the nested iframe, coordinates
         * will be "local" to that iframe element). To get coordinates relative to the test iframe ("global" coordinates),
         * pass `local` as `false`.
         *
         * @param {Siesta.Test.ActionTarget} el The element to find the center of.
         * @param {Boolean} [local] Pass `true` means coordinates are relative to the containing document. This is the default value.
         * Pass `false` to make sure the coordinates are global to the test window.
         *
         * @return {Array} The array first element of which is the `x` coordinate and 2nd - `y`
         */
        findCenter : function (target, local) {
            return this.getTargetCoordinate(target, local);
        },


        normalizeOffset : function (offset, $el) {
            var parts;

            if (this.typeOf(offset) == 'Function') offset = offset.call(this)

            offset              = offset && offset.slice() || [ '50%', '50%' ];

            if (typeof (offset[ 0 ]) === 'string') {
                parts           = offset[ 0 ].split('%');
                offset[ 0 ]     = parseInt(offset[ 0 ].match(/\d+/)[ 0 ], 10) * ($el.outerWidth() - 1) / 100;

                if (parts[ 1 ]) {
                    offset[ 0 ] += parseInt(parts[ 1 ]);
                }

                offset[ 0 ]     = Math.round(offset[ 0 ])
            }

            if (typeof (offset[ 1 ]) === 'string') {
                parts           = offset[ 1 ].split('%');
                offset[ 1 ]     = parseInt(offset[ 1 ].match(/\d+/)[ 0 ], 10) * ($el.outerHeight() - 1) / 100;

                if (parts[ 1 ]) {
                    offset[ 1 ] += parseInt(parts[ 1 ]);
                }

                offset[ 1 ]     = Math.round(offset[ 1 ])
            }

            return offset
        },


        getTargetCoordinate : function (target, local, offset) {
            var normalizedEl    = this.normalizeElement(target),
                $normalizedEl   = this.$(normalizedEl),
                bodyOffset      = $normalizedEl.offset(),
                elDoc           = normalizedEl.ownerDocument,
                $doc            = this.$(elDoc),
                xy              = [ bodyOffset.left - $doc.scrollLeft(), bodyOffset.top - $doc.scrollTop() ];

            offset              = this.normalizeOffset(offset, $normalizedEl)

            xy[ 0 ]             += offset[ 0 ];
            xy[ 1 ]             += offset[ 1 ];

            if (local === false) {
                var elWindow    = elDoc.defaultView || elDoc.parentWindow;

                // Potentially we're interacting with an element inside a nested frame, which means the coordinates are local to that frame
                if (elWindow !== this.global) {
                    var offsetsToTop    = this.$(elWindow.frameElement).offset();

                    xy[ 0 ]     += offsetsToTop.left;
                    xy[ 1 ]     += offsetsToTop.top;
                }
            }

            return xy;
        },

        /**
         * Returns true if the element is visible, checking jQuery :visible selector + style visibility value.
         *
         * @param {Siesta.Test.ActionTarget} el The element
         * @return {Boolean}
         */
        isElementVisible : function(el) {
            el          = this.normalizeElement(el);

            // Workaround for OPTION elements which don't behave like normal DOM elements. jQuery always consider them invisible.
            // Decide based on visibility of the parent SELECT node
            if (el && el.nodeName.toLowerCase() === 'option') {
                el = this.$(el).closest('select')[0];
            }

            if (el) {
                try {
                    // Jquery :visible doesn't handle SVG/VML, so manual check
                    // accessing to `this.global.SVGElement` throws exceptions for popups in IE 9
                    if (window.SVGElement && el instanceof this.global.SVGElement) 
                        return el.style.display !== 'none' && el.style.visibility !== 'hidden'
                } catch (e) {
                }

                // Jquery :visible doesn't take visibility into account
                return this.$(el).is(':visible') && (!el.style || el.style.visibility !== 'hidden')
            }

            return false
        },

        /**
         * Passes if the innerHTML of the passed element contains the text passed
         *
         * @param {Siesta.Test.ActionTarget} el The element to query
         * @param {String} text The text to match
         * @param {String} [description] The description for the assertion
         */
        contentLike : function(el, text, description) {
            el = this.normalizeElement(el);

            this.like(el.innerHTML, text, description);
        },

        /**
         * Passes if the innerHTML of the passed element does not contain the text passed
         *
         * @param {Siesta.Test.ActionTarget} el The element to query
         * @param {String} text The text to match
         * @param {String} [description] The description for the assertion
         */
        contentNotLike : function(el, text, description) {
            el = this.normalizeElement(el);

            this.unlike(el.innerHTML, text, description);
        },

        /**
         * Waits until the innerHTML of the passed element contains the text passed
         *
         * @param {Siesta.Test.ActionTarget} el The element to query
         * @param {String} text The text to match
         * @param {Function} callback The callback to call after the CSS selector has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForContentLike : function(el, text, callback, scope, timeout) {
            var R = Siesta.Resource('Siesta.Test.Element');

            el = this.normalizeElement(el);

            return this.waitFor({
                method          : function() { return el.innerHTML.match(text); },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForContentLike',
                description     : ' ' + R.get('elementContent') + ' "' + text + '" ' + R.get('toAppear')
            });
        },

        /**
         * Waits until the innerHTML of the passed element does not contain the text passed
         *
         * @param {Siesta.Test.ActionTarget} el The element to query
         * @param {String} text The text to match
         * @param {Function} callback The callback to call after the CSS selector has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForContentNotLike : function(el, text, callback, scope, timeout) {
            var R = Siesta.Resource('Siesta.Test.Element');

            el = this.normalizeElement(el);

            return this.waitFor({
                method          : function() { return !el.innerHTML.match(text); },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForContentNotLike',
                description     : ' ' + R.get('elementContent') + ' "' + text + '" ' + R.get('toDisappear')
            });
        },
        
        
        getRandomTypeString : function (length) {
            var allowedCharacters   = this.allowedCharacters
            
            var special     = allowedCharacters.special.split('/')
            var punctuation = allowedCharacters.punctuation
            var normal      = allowedCharacters.normal
            
            var total       = special.length + punctuation.length + normal.length
            
            var str         = ''
            
            for (var i = 0; i < length; i++) {
                var index       = this.randomBetween(0, total - 1)
                
                if (index < normal.length) 
                    str     += normal.substr(index, 1)
                else {
                    index   -= normal.length
                    
                    if (index < punctuation.length) 
                        str     += punctuation.substr(index, 1)
                    else {
                        index   -= punctuation.length
                        
                        str     += '[' + special[ index ] + ']'
                    }
                }
            }
            
            return str
        },

        /**
         * Performs clicks, double clicks, right clicks and drags at random coordinates within the passed target.
         * While doing all these random actions it also tracks the number of exceptions thrown and reports a failure
         * if there was any. Otherwise it reports a passed assertion.
         *
         * Use this assertion to "stress-test" your component, making sure it will work correctly in various unexpected
         * interaction scenarious.
         *
         * Note that as a special case, when this method is provided with the document's &lt;body&gt; element,
         * it will test the whole browser viewport.
         *
         * @param {Siesta.Test.ActionTarget} el The element to upon which to unleash the "monkey".
         * @param {Int} nbrInteractions The number of random interactions to perform.
         * @param {String} [description] The description for the assertion
         * @param {Function} callback The callback to call after all actions are completed
         * @param {Object} scope The scope for the callback
         */
        monkeyTest : function(el, nbrInteractions, description, callback, scope) {
            el              = this.normalizeElement(el, false, true);

            this.suppressPassedWaitForAssertion = true;

            if (typeof nbrInteractions === 'function') {
                callback    = nbrInteractions;
                scope       = description;
                description = '';
            } else if (typeof description === 'function') {
                callback    = description;
                description = '';
            }

            nbrInteractions = typeof nbrInteractions === 'number' ? nbrInteractions : 30;

            var global      = this.global
            var isBody      = el == global.document.body

            var me          = this,
                offset      = me.$(el).offset(),
                right       = offset.left + me.$(isBody ? global : el).width(),
                bottom      = offset.top + me.$(isBody ? global : el).height();

            var actionLog   = []
            var R           = Siesta.Resource('Siesta.Test.Element');

            var queue       = new Siesta.Util.Queue({
                deferer         : me.originalSetTimeout,
                deferClearer    : me.originalClearTimeout,

                interval        : 50,

                observeTest     : this,

                processor   : function (data) {
                    if (me.nbrExceptions || me.failed) {
                        me.warn(R.get('monkeyActionLog') + ":" + JSON2.stringify(actionLog))
                        // do not continue if the test has detected an exception thrown
                        queue.abort()
                    } else {
                        var async       = me.beginAsync(null, function (test) {
                            test.fail(R.get('monkeyException'))
                            me.warn(R.get('monkeyActionLog') + ":" + JSON.stringify(actionLog))

                            return true
                        });

                        var next        = data.next

                        data.next       = function () {
                            me.endAsync(async)

                            next()
                        }

                        data.action(data)
                    }
                }
            });

            var dummy       = []
            dummy.length    = nbrInteractions
            
            var ignoreActionOnAnchor      = function (data, i) {
                var target      = me.normalizeElement(data.dragFrom || data.xy)
                
                // do not click on <a> elements, unless those
                // w/o `href' or with #hash-style hrefs
                if (
                    target &&
                    (target.tagName.toLowerCase() == 'a' || $(target).closest('a').length > 0)
//                    &&
//                    target.href && target.getAttribute('target') == '_blank'
                ) {
                    actionLog[ data.logIndex ]  = null
                    if (data.isDouble) actionLog[ data.logIndex - 1 ]  = null
                    
                    data.next()
                    
                    return true
                } else
                    return false
            }
            
            Joose.A.each(dummy, function (value, i) {
                var xy = [ me.randomBetween(offset.left, right), me.randomBetween(offset.top, bottom) ];

                switch (me.randomBetween(0, 4)) {
                    case 0:
                        actionLog.push({
                            'click' : xy
                        })

                        // Inject waitForSelector : 'body' to make sure we always have a body
                        queue.addAsyncStep({
                            action          : function (data) {
                                me.waitForSelector('body', data.next);
                            }
                        });

                        queue.addAsyncStep({
                            action          : function (data) {
                                if (!ignoreActionOnAnchor(data)) me.click(data.xy, data.next)
                            },
                            xy              : xy,
                            logIndex        : actionLog.length - 1
                        });
                    break;

                    case 1:
                        actionLog.push({
                            'doubleclick'   : xy
                        })

                        // Inject waitForSelector : 'body' to make sure we always have a body
                        queue.addAsyncStep({
                            action          : function (data) {
                                me.waitForSelector('body', data.next);
                            }
                        });

                        queue.addAsyncStep({
                            action          : function (data) {
                                if (!ignoreActionOnAnchor(data)) me.doubleClick(data.xy, data.next)
                            },
                            xy              : xy,
                            logIndex        : actionLog.length - 1
                        });
                    break;

                    case 2:
                        // Make sure right-clicking can be done on this platform (just do 'click' on mobile devices)
                        if ("oncontextmenu" in window) {
                            actionLog.push({
                                'rightclick'    : xy
                            })
                        } else {
                            actionLog.push({
                                'click'    : xy
                            })
                        }

                        // Inject waitForSelector : 'body' to make sure we always have a body
                        queue.addAsyncStep({
                            action          : function (data) {
                                me.waitForSelector('body', data.next);
                            }
                        });

                        queue.addAsyncStep({
                            action          : function (data) {
                                if ("oncontextmenu" in window) {
                                    me.rightClick(data.xy, data.next)
                                } else {
                                    if (!ignoreActionOnAnchor(data)) me.click(data.xy, data.next)
                                }
                            },
                            xy              : xy
                        });
                    break;

                    case 3:
                        var dragTo      = [ me.randomBetween(offset.left, right), me.randomBetween(offset.top, bottom) ]

                        actionLog.push({
                            action  : 'drag',
                            target  : xy,
                            to      : dragTo
                        })

                        // Inject waitForSelector : 'body' to make sure we always have a body
                        queue.addAsyncStep({
                            action          : function (data) {
                                me.waitForSelector('body', data.next);
                            }
                        });

                        queue.addAsyncStep({
                            action          : function (data) {
                                if (!ignoreActionOnAnchor(data)) {
                                    me.drag(data.dragFrom, data.dragTo, null, data.next)
                                }
                            },
                            dragFrom        : xy,
                            dragTo          : dragTo
                        });
                    break;

                    case 4:
                        var text = me.getRandomTypeString(15)

                        actionLog.push({
                            'click' : xy
                        })
                        actionLog.push({
                            'type'  : text
                        })

                        // Inject waitForSelector : 'body' to make sure we always have a body
                        queue.addAsyncStep({
                            action          : function (data) {
                                me.waitForSelector('body', data.next);
                            }
                        });
                        
                        // First click somewhere then type
                        queue.addAsyncStep({
                            action          : function (data) {
                                if (!ignoreActionOnAnchor(data)) {
                                    me.click(data.xy, function () {
                                        me.waitForSelector('body', function () {
                                            me.type(null, text, data.next)
                                        });
                                    })
                                }
                            },
                            xy              : xy,
                            logIndex        : actionLog.length - 1,
                            isDouble        : true
                        });
                        break;
                }
            })

            var checkerActivated    = false

            var assertionChecker    = function () {
                checkerActivated    = true

                if (me.nbrExceptions) me.warn(R.get('monkeyActionLog') + ":" + JSON.stringify(actionLog))

                me.is(me.nbrExceptions, 0, description || R.get('monkeyNoExceptions'));
            }

            this.on('beforetestfinalizeearly', assertionChecker)

            queue.run(function () {
                if (!checkerActivated) {
                    me.un('beforetestfinalizeearly', assertionChecker)

                    assertionChecker()
                }

                this.suppressPassedWaitForAssertion = false;

                me.processCallbackFromTest(callback, [actionLog], scope || me)
            });
        },

        /**
         * Passes if the element has the supplied CSS classname
         *
         * @param {Siesta.Test.ActionTarget} el The element to query
         * @param {String} cls The class name to check for
         * @param {String} [description] The description for the assertion
         */
        hasCls : function (el, cls, description) {
            var R           = Siesta.Resource('Siesta.Test.Element');

            el              = this.normalizeElement(el);

            if (this.$(el).hasClass(cls)) {
                this.pass(description, {
                    descTpl     : R.get('elementHasClass') + ' {cls}',
                    cls         : cls
                });
            } else {
                this.fail(description, {
                    assertionName   : 'hasCls',

                    got             : el.className,
                    gotDesc         : R.get('elementClasses'),
                    need            : cls,
                    needDesc        : R.get('needClass')
                })
            }
        },


        /**
         * Passes if the element does not have the supplied CSS classname
         *
         * @param {Siesta.Test.ActionTarget} el The element to query
         * @param {String} cls The class name to check for
         * @param {String} [description] The description for the assertion
         */
        hasNotCls : function (el, cls, description) {
            var R           = Siesta.Resource('Siesta.Test.Element');

            el              = this.normalizeElement(el);

            if (!this.$(el).hasClass(cls)) {
                this.pass(description, {
                    descTpl         : R.get('elementHasNoClass') + ' {cls}',
                    cls             : cls
                });
            } else {
                this.fail(description, {
                    assertionName   : 'hasNotCls',
                    got             : el.className,
                    gotDesc         : R.get('elementClasses'),
                    annotation      : R.get('elementHasClass') + ' [' + cls + ']'
                })
            }
        },

        /**
         * Passes if the element has the supplied style value
         *
         * @param {Siesta.Test.ActionTarget} el The element to query
         * @param {String} property The style property to check for
         * @param {String} value The style value to check for
         * @param {String} [description] The description for the assertion
         */
        hasStyle : function (el, property, value, description) {
            var R           = Siesta.Resource('Siesta.Test.Element');

            el              = this.normalizeElement(el);

            if (this.$(el).css(property) === value) {
                this.pass(description, {
                    descTpl         : R.get('hasStyleDescTpl'),
                    value           : value,
                    property        : property
                });
            } else {
                this.fail(description, {
                    assertionName   : 'hasStyle',
                    got             : this.$(el).css(property),
                    gotDesc         : R.get('elementStyles'),
                    need            : value,
                    needDesc        :  R.get('needStyle')
                });
            }
        },


        /**
         * Passes if the element does not have the supplied style value
         *
         * @param {Siesta.Test.ActionTarget} el The element to query
         * @param {String} property The style property to check for
         * @param {String} value The style value to check for
         * @param {String} [description] The description for the assertion
         */
        hasNotStyle : function (el, property, value, description) {
            var R           = Siesta.Resource('Siesta.Test.Element');

            el              = this.normalizeElement(el);

            if (this.$(el).css(property) !== value) {
                this.pass(description, {
                    descTpl         : R.get('hasNotStyleDescTpl'),
                    value           : value,
                    property        : property
                });
            } else {
                this.fail(description, {
                    assertionName   : 'hasNotStyle',
                    got             : el.style.toString(),
                    gotDesc         : R.get('elementStyles'),
                    annotation      : R.get('hasTheStyle') + ' [' + property + ']'
                });
            }
        },

        /**
         * Waits for a certain CSS selector to be found at the passed XY coordinate, and calls the callback when found.
         * The callback will receive the element from the passed XY coordinates.
         *
         * @param {Array} xy The x and y coordinates to query
         * @param {String} selector The CSS selector to check for
         * @param {Function} callback The callback to call after the CSS selector has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test#waitForTimeout} value.
         */
        waitForSelectorAt : function(xy, selector, callback, scope, timeout) {
            var R           = Siesta.Resource('Siesta.Test.Element');

            if (!selector) throw R.get('noCssSelector');

            var me      = this

            return this.waitFor({
                method          : function() {
                    var el = me.elementFromPoint(xy[0], xy[1], true);

                    if (el && me.$(el).is(selector)) return el;
                },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForSelectorAt',
                description     : ' ' + R.get('selector') + ' "' + selector + '" ' + R.get('toAppearAt') + ': [' + xy.toString() + ']'
            });
        },

        /**
         * Waits for a certain CSS selector to be found at current cursor position, and calls the callback when found.
         * The callback will receive the element found.
         *
         * @param {String} selector The CSS selector to check for
         * @param {Function} callback The callback to call after the CSS selector has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test#waitForTimeout} value.
         */
        waitForSelectorAtCursor : function(selector, callback, scope, timeout) {
            return this.waitForSelectorAt(this.currentPosition, selector, callback, scope, timeout);
        },

        /**
         * Waits for a certain CSS selector to be found in the DOM, and then calls the callback supplied.
         * The callback will receive the results of jQuery selector.
         *
         * @param {String} selector The CSS selector to check for
         * @param {Siesta.Test.ActionTarget} root (optional) The root element in which to detect the selector.
         * @param {Function} callback The callback to call after the CSS selector has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test#waitForTimeout} value.
         */
        waitForSelector : function(selector, root, callback, scope, timeout) {
            var R           = Siesta.Resource('Siesta.Test.Element');
            var me          = this;

            if (!selector) throw R.get('noCssSelector');

            if (jQuery.isFunction(root)) {
                timeout     = scope;
                scope       = callback;
                callback    = root;
                root        = null;
            }

            if (root) root  = this.normalizeElement(root);

            return this.waitFor({
                method          : function() {
                    var result = me.$(selector, root);
                    if (result.length > 0) return result;
                },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForSelector',
                description     : ' ' + R.get('selector') + ' "' + selector + '" ' + R.get('toAppear')
            });
        },


        /**
         * Waits till all the CSS selectors from the provided array to be found in the DOM, and then calls the callback supplied.
         *
         * @param {Array[String]} selectors The array of CSS selectors to check for
         * @param {Siesta.Test.ActionTarget} root (optional) The root element in which to detect the selector.
         * @param {Function} callback The callback to call after the CSS selector has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test#waitForTimeout} value.
         */
        waitForSelectors : function(selectors, root, callback, scope, timeout) {
            var R           = Siesta.Resource('Siesta.Test.Element');

            if (selectors.length < 1) throw R.get('waitForSelectorsBadInput');

            if (jQuery.isFunction(root)) {
                timeout     = scope;
                scope       = callback;
                callback    = root;
                root        = null;
            }

            if (root) root  = this.normalizeElement(root);

            var me          = this

            return this.waitFor({
                method          :  function () {
                    var allPresent  = true

                    Joose.A.each(selectors, function (selector) {
                        if (me.$(selector, root).length === 0) {
                            allPresent = false
                            // stop iteration
                            return false
                        }
                    })

                    return allPresent
                },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForSelectors',
                description     : ' ' + R.get('selectors') + ' "' + selectors + '" ' + R.get('toAppear')
            });
        },



        /**
         * Waits for a certain CSS selector to not be found in the DOM, and then calls the callback supplied.
         *
         * @param {String} selector The CSS selector to check for
         * @param {Siesta.Test.ActionTarget} root (optional) The root element in which to detect the selector.
         * @param {Function} callback The callback to call after the CSS selector has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test#waitForTimeout} value.
         */
        waitForSelectorNotFound : function(selector, root, callback, scope, timeout) {
            var R           = Siesta.Resource('Siesta.Test.Element');
            var me          = this;

            if (!selector) throw 'A CSS selector must be supplied';

            if (jQuery.isFunction(root)) {
                timeout     = scope;
                scope       = callback;
                callback    = root;
                root        = null;
            }

            if (root) root  = this.normalizeElement(root);

            return this.waitFor({
                method          : function() { return me.$(selector, root).length === 0; },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForSelectorNotFound',
                description     : ' ' + R.get('selector') + ' "' + selector + '" ' + R.get('toDisappear')
            });
        },


        /**
         * Waits until the passed element becomes "visible" in the DOM and calls the provided callback.
         * Please note, that "visible" means element will just have a DOM node, and still may be hidden by another visible element.
         *
         * The callback will receive the passed element as the 1st argument.
         *
         * See also {@link #waitForElementTop} method.
         *
         * @param {Siesta.Test.ActionTarget} el The element to look for.
         * @param {Function} callback The callback to call after the CSS selector has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForElementVisible : function(el, callback, scope, timeout) {
            var R       = Siesta.Resource('Siesta.Test.Element');

            return this.waitFor({
                method          : function() {
                    var normalized = this.normalizeElement(el, true);

                    if (normalized && this.isElementVisible(normalized)) return normalized;
                },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForElementVisible',
                description     : ' ' + R.get('element') + ' "' + el.toString() + '" ' + R.get('toAppear')
            });
        },

        /**
         * Waits until the passed element is becomes not "visible" in the DOM and call the provided callback.
         * Please note, that "visible" means element will just have a DOM node, and still may be hidden by another visible element.
         *
         * The callback will receive the passed element as the 1st argument.
         *
         * See also {@link #waitForElementNotTop} method.
         *
         * @param {Siesta.Test.ActionTarget} el The element to look for.
         * @param {Function} callback The callback to call after the CSS selector has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForElementNotVisible : function(el, callback, scope, timeout) {
            el          = this.normalizeElement(el);

            var R       = Siesta.Resource('Siesta.Test.Element');
            var me      = this;

            return this.waitFor({
                method          : function() { return !me.isElementVisible(el) && el; },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForElementNotVisible',
                description     :  ' ' + R.get('element') + ' "' + el.toString() +  '" ' + R.get('toDisappear')
            });
        },


        /**
         * Waits until the passed element is the 'top' element in the DOM and call the provided callback.
         *
         * The callback will receive the passed element as the 1st argument.
         *
         * @param {Siesta.Test.ActionTarget} el The element to look for.
         * @param {Function} callback The callback to call
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForElementTop : function(el, callback, scope, timeout) {
            var R       = Siesta.Resource('Siesta.Test.Element');

            return this.waitFor({
                method          : function() {
                    var normalized = this.normalizeElement(el, true);

                    if (normalized && this.elementIsTop(normalized, true)) {
                        return normalized;
                    }
                },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForElementTop',
                description     : ' ' + R.get('element') + ' "' + el.toString() + '" ' + R.get('toBeTopEl')
            });
        },

        /**
         * Waits until the passed element is not the 'top' element in the DOM and calls the provided callback with the element found.
         *
         * The callback will receive the actual top element.
         *
         * @param {Siesta.Test.ActionTarget} el The element to look for.
         * @param {Function} callback The callback to call
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForElementNotTop : function(el, callback, scope, timeout) {
            el          = this.normalizeElement(el);

            var R       = Siesta.Resource('Siesta.Test.Element');
            var me      = this

            return this.waitFor({
                method          : function() {
                    if (!me.elementIsTop(el, true)) {
                        var center = me.findCenter(el);
                        return me.elementFromPoint(center[0], center[1], true);
                    }
                },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForElementNotTop',
                description     : ' ' + R.get('element') + ' "' + el.toString() + '" ' + R.get('toNotBeTopEl')
            });
        },

        /**
         * Passes if the element is visible.
         * @param {Siesta.Test.ActionTarget} el The element
         * @param {String} [description] The description for the assertion
         */
        elementIsVisible : function(el, description) {
            el = this.normalizeElement(el, false, false, false, { ignoreNonVisible : false });
            this.ok(this.isElementVisible(el), description);
        },

        /**
         * Passes if the element is not visible.
         * @param {Siesta.Test.ActionTarget} el The element
         * @param {String} [description] The description for the assertion
         */
        elementIsNotVisible : function(el, description) {
            el = this.normalizeElement(el, false, false, false, { ignoreNonVisible : false });
            this.notOk(this.isElementVisible(el), description);
        },

        /**
         * Utility method which checks if the passed method is the 'top' element at its position. By default, "top" element means,
         * that center point of the element is not covered with any other elements. You can also check any other point reachability
         * using the "offset" argument.
         *
         * @param {Siesta.Test.ActionTarget} el The element to look for.
         * @param {Boolean} allowChildren true to also include child nodes. False to strictly check for the passed element.
         * @param {Array} offset An array of 2 elements, defining "x" and "y" offset from the left-top corner of the element
         *
         * @return {Boolean} true if the element is the top element.
         */
        elementIsTop : function (el, allowChildren, offset) {
            el              = this.normalizeElement(el);

            // Workaround for OPTION elements which don't behave like normal DOM elements. jQuery always consider them invisible.
            // Decide based on visibility of the parent SELECT node
            if (el && el.nodeName.toLowerCase() === 'option') {
                el = this.$(el).closest('select')[0];
            }

            var elDoc       = el.ownerDocument

            var localPoint  = this.getTargetCoordinate(el, true, offset)
            var foundEl     = elDoc.elementFromPoint(localPoint[ 0 ], localPoint[ 1 ]);

            return foundEl && (foundEl === el || (allowChildren && this.$(foundEl).closest(el).length > 0));
        },

        // Helper method to find out if an offset is targeting a point outside its target
        // Assumes the el passed is visible
        isOffsetInsideElementBox : function (el, offset) {
            if (!offset) return true;

            var $el = this.$(this.normalizeElement(el));
            var w   = $el.outerWidth();
            var h   = $el.outerHeight();

            offset = this.normalizeOffset(offset, $el);

            return offset[0] >= 0 && offset[0] < w &&
                   offset[1] >= 0 && offset[1] < h;
        },

        /**
         * Passes if the element is found at the supplied xy coordinates.
         *
         * @param {Siesta.Test.ActionTarget} el The element to query
         * @param {Array} xy The xy coordinate to query.
         * @param {Boolean} allowChildren true to also include child nodes. False to strictly check for the passed element.
         * @param {String} [description] The description for the assertion
         */
        elementIsAt : function(el, xy, allowChildren, description) {
            el              = this.normalizeElement(el);

            var foundEl     = this.elementFromPoint(xy[0], xy[1], true);
            var R           = Siesta.Resource('Siesta.Test.Element');

            if (!foundEl) {
                this.fail(description, {
                    assertionName       : 'elementIsAt',
                    got                 : { x: xy[0], y : xy[1] },
                    gotDesc             : R.get('Position'),
                    annotation          : R.get('noElementAtPosition')
                });
            } else if (allowChildren) {
                if (foundEl === el || this.$(foundEl).closest(el).length > 0) {
                    this.pass(description, {
                        descTpl         : R.get('elementIsAtDescTpl'),
                        x               : xy[ 0 ],
                        y               : xy[ 1 ]
                    });
                } else {
                    this.fail(description, {
                        assertionName   : 'elementIsAt',
                        got             : foundEl,
                        gotDesc         : R.get('topElement'),
                        need            : el,
                        needDesc        : R.get('allowChildrenDesc'),
                        annotation      : R.get('allowChildrenAnnotation')
                    });
                }
            } else {
                if (foundEl === el) {
                    this.pass(description, {
                        descTpl         : R.get('elementIsAtPassTpl'),
                        x               : xy[ 0 ],
                        y               : xy[ 1 ]
                    });
                } else {
                    this.fail(description, {
                        assertionName   : 'elementIsAt',
                        got             : foundEl,
                        gotDesc         : R.get('topElement'),
                        need            : el,
                        needDesc        : 'Should be',
                        annotation      : R.get('noChildrenFailAnnotation')
                    });
                }
            }
        },

        /**
         * Passes if the element is the top element (using its center xy coordinates). "Top" element means,
         * that element is not covered with any other elements.
         *
         * This assertion can be used for example to test, that some element, that appears only when mouse hovers some other element is accessible by user
         * with mouse (which is not always true because of various z-index issues).
         *
         * @param {Siesta.Test.ActionTarget} el The element to look for.
         * @param {Boolean} allowChildren true to also include child nodes. False to strictly check for the passed element.
         * @param {String} [description] The description for the assertion
         * @param {Boolean} strict true to check all four corners of the element. False to only check at element center.
         */
        elementIsTopElement : function(el, allowChildren, description, strict) {
            el = this.normalizeElement(el);

            if (strict) {
                var o           = this.$(el).offset();
                var R           = Siesta.Resource('Siesta.Test.Element');
                var region      = {
                    top     : o.top,
                    right   : o.left + this.$(el).outerWidth(),
                    bottom  : o.top + this.$(el).outerHeight(),
                    left    : o.left
                };

                this.elementIsAt(el, [region.left+1, region.top+1], allowChildren, description + ' ' + R.get('topLeft'));
                this.elementIsAt(el, [region.left+1, region.bottom-1], allowChildren, description + ' ' + R.get('bottomLeft'));
                this.elementIsAt(el, [region.right-1, region.top+1], allowChildren, description + ' ' + R.get('topRight'));
                this.elementIsAt(el, [region.right-1, region.bottom-1], allowChildren, description + ' ' + R.get('bottomRight'));
            } else {
                this.elementIsAt(el, this.findCenter(el), allowChildren, description);
            }
        },

        /**
         * Passes if the element is not the top element (using its center xy coordinates).
         *
         * @param {Siesta.Test.ActionTarget} el The element to look for.
         * @param {Boolean} allowChildren true to also include child nodes. False to strictly check for the passed element.
         * @param {String} [description] The description for the assertion
         */
        elementIsNotTopElement : function(el, allowChildren, description) {
            el              = this.normalizeElement(el);
            var center      = this.findCenter(el);

            var foundEl     = this.elementFromPoint(center[ 0 ], center[ 1 ], true);

            if (!foundEl) {
                var R           = Siesta.Resource('Siesta.Test.Element');

                this.pass(description, {
                    descTpl         : R.get('elementIsNotTopElementPassTpl')
                });

                return
            }

            if (allowChildren) {
                this.ok(foundEl !== el && this.$(foundEl).closest(el).length === 0, description);
            } else {
                this.isnt(foundEl, el, description);
            }
        },

        /**
         * Passes if the element is found at the supplied xy coordinates.
         *
         * @param {String} selector The selector to query for
         * @param {Array} xy The xy coordinate to query.
         * @param {Boolean} allowChildren true to also include child nodes. False to strictly check for the passed element.
         * @param {String} [description] The description for the assertion
         */
        selectorIsAt : function(selector, xy, description) {
            var R           = Siesta.Resource('Siesta.Test.Element');

            if (!selector) throw R.get('noCssSelector');

            var foundEl = this.$(this.elementFromPoint(xy[0], xy[1], true));

            if (foundEl.has(selector).length > 0 || foundEl.closest(selector).length > 0) {
                this.pass(description, {
                    descTpl         : R.get('selectorIsAtPassTpl'),
                    selector        : selector,
                    xy              : xy
                });
            } else {
                this.fail(description, {
                    got             : foundEl[0].outerHTML ? foundEl[0].outerHTML : foundEl[0].innerHTML,
                    need            : R.get('elementMatching') + ' ' + selector,
                    assertionName   : 'selectorIsAt',
                    annotation      : R.get('selectorIsAtFailAnnotation') + ' [' + xy + ']'
                });
            }
        },

        /**
         * Passes if the selector is found in the DOM
         *
         * @param {String} selector The selector to query for
         * @param {String} [description] The description for the assertion
         */
        selectorExists : function(selector, description) {
            var R           = Siesta.Resource('Siesta.Test.Element');

            if (!selector) throw R.get('noCssSelector');

            if (this.$(selector).length <= 0) {
                this.fail(description, R.get('selectorExistsFailTpl') + ' : ' + selector);
            } else {
                this.pass(description, {
                    descTpl         : R.get('selectorExistsPassTpl'),
                    selector        : selector
                });
            }
        },

        /**
         * Passes if the selector is not found in the DOM
         *
         * @param {String} selector The selector to query for
         * @param {String} [description] The description for the assertion
         */
        selectorNotExists : function(selector, description) {
            var R           = Siesta.Resource('Siesta.Test.Element');
            var els         = this.$(selector);

            if (els.length > 0) {
                this.fail(description, {
                    descTpl     : R.get('selectorNotExistsFailTpl') + ': ' + selector,
                    annotation  : $.map(els, function(el, i) { return (i+1) + ". " + el.className; }).join('\r\n')
                });
            } else {
                this.pass(description, {
                    descTpl         : R.get('selectorNotExistsPassTpl'),
                    selector        : selector
                });
            }
        },

        /**
         * Waits until the passed scroll property of the element has changed.
         *
         * The callback will receive the new `scroll` value.
         *
         * @param {Siesta.Test.ActionTarget} el The element
         * @param {String} side 'left' or 'top'
         * @param {Function} callback The callback to call
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForScrollChange : function(el, side, callback, scope, timeout) {
            el                  = this.normalizeElement(el);
            var scrollProp      = 'scroll' + Joose.S.uppercaseFirst(side);
            var original        = el[scrollProp];
            var R               = Siesta.Resource('Siesta.Test.Element');

            return this.waitFor({
                method          : function() { if (el[scrollProp] !== original) return el[scrollProp]; },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForScrollChange',
                description     : ' ' + scrollProp + ' ' + R.get('toChangeForElement') + ' ' + el.toString()
            });
        },

        /**
         * Waits until the `scrollLeft` property of the element has changed.
         *
         * The callback will receive the new `scrollLeft` value.
         *
         * @param {Siesta.Test.ActionTarget} el The element
         * @param {Function} callback The callback to call
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForScrollLeftChange : function(el, callback, scope, timeout) {
            return this.waitForScrollChange(this.normalizeElement(el), 'left', callback, scope, timeout);
        },

        /**
         * Waits until the scrollTop property of the element has changed
         *
         * The callback will receive the new `scrollTop` value.
         *
         * @param {Siesta.Test.ActionTarget} el The element
         * @param {Function} callback The callback to call
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForScrollTopChange : function(el, callback, scope, timeout) {
            return this.waitForScrollChange(this.normalizeElement(el), 'top', callback, scope, timeout);
        },


        /**
         * This method changes the "scrollTop" property of the dom element, then waits for the "scroll" event from it and calls the provided callback.
         *
         * For example:
         *

    // scroll the domEl to the 100px offset, wait for "scroll" event, call the callback
    t.scrollVerticallyTo(domEl, 100, function () { ... })

         * Optionally it can also wait some additional time before calling the callback:
         *
    // scroll the domEl to the 100px offset, wait for "scroll" event, wait 1000ms more, call the callback
    t.scrollVerticallyTo(domEl, 100, 1000, function () { ... })

         *
         * @param {Siesta.Test.ActionTarget} el The element
         * @param {Number} newTop The value for the "scrollTop" property
         * @param {Number} [delay] Additional delay, this argument can be omitted
         * @param {Function} callback A function to call after "scroll" event has been fired and additional delay completed (if any)
         *
         * @return {Number} The new value of the "scrollTop" property of the dom element
         */
        scrollVerticallyTo : function (el, newTop, delay, callback) {
            el                          = this.normalizeElement(el);

            if (this.typeOf(delay) != 'Number') {
                callback                = delay
                delay                   = null
            }

            var me                      = this
            var originalSetTimeout      = this.originalSetTimeout;

            var waiter                  = this.waitForEvent(el, 'scroll', function () {
                if (delay > 0) {
                    var async               = me.beginAsync(delay + 100)

                    originalSetTimeout(function () {
                        me.endAsync(async)

                        me.processCallbackFromTest(callback)
                    }, delay)
                } else
                    me.processCallbackFromTest(callback)
            })

            var prevScrollTop   = el.scrollTop

            el.scrollTop        = newTop

            // no event will be fired in this case probably - force the waiting operation to complete
            if (el.scrollTop == prevScrollTop) {
                waiter.force()
            }

            // re-read the scrollTop value and return it (newTop can be too big for example and will be truncated)
            return el.scrollTop
        },


        /**
         * This method changes the "scrollLeft" property of the dom element, then waits for the "scroll" event from it and calls the provided callback.
         *
         * For example:
         *

    // scroll the domEl to the 100px offset, wait for "scroll" event, call the callback
    t.scrollHorizontallyTo(domEl, 100, function () { ... })

         * Optionally it can also wait some additional time before calling the callback:
         *
    // scroll the domEl to the 100px offset, wait for "scroll" event, wait 1000ms more, call the callback
    t.scrollHorizontallyTo(domEl, 100, 1000, function () { ... })

         *
         * @param {Siesta.Test.ActionTarget} el The element
         * @param {Number} newLeft The value for the "scrollLeft" property
         * @param {Number} [delay] Additional delay, this argument can be omitted
         * @param {Function} callback A function to call after "scroll" event has been fired and additional delay completed (if any)
         *
         * @return {Number} The new value of the "scrollLeft" property of the dom element
         */
        scrollHorizontallyTo : function (el, newLeft, delay, callback) {
            el                          = this.normalizeElement(el);

            if (this.typeOf(delay) != 'Number') {
                callback                = delay
                delay                   = null
            }

            var me                      = this
            var originalSetTimeout      = this.originalSetTimeout;

            var waiter                  = this.waitForEvent(el, 'scroll', function () {
                if (delay > 0) {
                    var async               = me.beginAsync(delay + 100)

                    originalSetTimeout(function () {
                        me.endAsync(async)

                        me.processCallbackFromTest(callback)
                    }, delay)
                } else
                    me.processCallbackFromTest(callback)
            })

            var prevScrollLeft  = el.scrollLeft

            el.scrollLeft       = newLeft

            // no event will be fired in this case probably - force the waiting operation to complete
            if (el.scrollLeft == prevScrollLeft) {
                waiter.force()
            }

            // re-read the scrollLeft value and return it (newLeft can be too big for example and will be truncated)
            return el.scrollLeft
        },



        /**
         * This method accepts an array of the DOM elements and performs a mouse click on them, in order. After that, it calls the provided callback:
         *

       t.chainClick([ el1, el2 ], function () {
            ...
       })

         * the elements can be also provided inline, w/o wrapping array:

       t.chainClick(el1, el2, function () {
            ...
       })


         *
         * @param {Array[Siesta.Test.ActionTarget]} elements The array of elements to click
         * @param {Function} callback The function to call after clicking all elements
         */
        chainClick : function () {
            var args        = Array.prototype.concat.apply([], arguments)
            var callback

            if (this.typeOf(args[ args.length - 1 ]) == 'Function') callback = args.pop()

            // poor-man Array.flatten, with only 1 level of nesting support
            args            = Array.prototype.concat.apply([], args)

            var steps       = []

            Joose.A.each(args, function (arg) {
                steps.push({
                    action      : 'click',
                    target      : arg
                })
            })

            var me          = this

            if (callback) steps.push(function () {
                me.processCallbackFromTest(callback)
            })

            this.chain.apply(this, steps)
        },


        /**
         * This method is a wrapper around the {@link #chainClick}, it performs a click on the every element found with the DOM query.
         *
         * You can specify the optional `root` element to start the query from:
         *
         *      t.clickSelector('.my-grid .x-grid-row', someEl, function () {})
         *
         * or omit it (query will start from the document):
         *
         *      t.clickSelector('.my-grid .x-grid-row', function () {})
         *
         * The provided callback will receive an array with DOM elements - result of query.
         *
         *
         * @param {String} selector The selector/xpath query
         * @param {Siesta.Test.ActionTarget} [root=document] The root of the query, defaults to the `document`. You can omit this parameter.
         * @param {Function} [callback]
         * @param {Object} [scope]
         */
        clickSelector : function (selector, root, callback, scope) {
            if (arguments.length > 1 && this.typeOf(arguments[ 1 ]) == 'Function') {
                scope       = callback;
                callback    = root;
                root        = null;
            }

            if (root) root = this.normalizeElement(root);

            // convert the result from jQuery dom query to a usual array 
            var result      = Joose.A.map(this.$(selector, root), function (el) { return el });

            this.chainClick(result, function () { callback && callback.call(scope || this, result) })
        },


        /**
         * This assertion passes when the DOM query with specified selector returns the expected number of elements
         *
         * You can specify the optional `root` element to start the query from:
         *
         *      t.selectorCountIs('.x-grid-row', grid, 5, "Grid has 5 rows")
         *
         * or omit it (query will start from the document):
         *
         *      t.selectorCountIs('.x-grid-row', 0, "No grid rows on the page")
         *
         * @param {String} selector DOM query selector
         * @param {Siesta.Test.ActionTarget} [root] An optional root element to start the query from, if omited query will start from the document
         * @param {Number} count The expected number of elements in the query result
         * @param {String} [description] The description for the assertion
         */
        selectorCountIs : function (selector, root, count, description) {
            var R           = Siesta.Resource('Siesta.Test.Element');

            if (!selector) throw R.get('noCssSelector');

            if (this.typeOf(root) == 'Number') {
                description     = count
                count           = root
                root            = null
            } else
                root            = this.normalizeElement(root)

            var inDOMCount  = this.$(selector, root).length

            if (inDOMCount != count) {
                this.fail(description, {
                    assertionName   : 'selectorCountIs',
                    descTpl         : R.get('selectorCountIsFailTpl'),
                    selector        : selector,
                    got             : inDOMCount,
                    need            : count
                });
            } else {
                this.pass(description, {
                    descTpl         : R.get('selectorCountIsPassTpl'),
                    count           : count,
                    selector        : selector
                });
            }
        },


        /**
         * Passes if the passed element is inside of the visible viewport
         *
         * @param {Siesta.Test.ActionTarget} el The element
         * @param {String} [description] The description for the assertion
         */
        isInView : function (el, description) {
            if (this.elementIsInView(el)) {
                var R           = Siesta.Resource('Siesta.Test.Element');

                this.pass(description, {
                    descTpl         : R.get('isInViewPassTpl')
                })
            }
            else
                this.fail(description, {
                    assertionName   : 'isInView'
                })
        },

        /**
         * Returns true if the passed element is inside of the visible viewport
         *
         * @param {Siesta.Test.ActionTarget} el The element
         */
        elementIsInView : function(el) {
            el              = this.normalizeElement(el);

            var inView      = false;
            var offset      = this.$(el).offset();

            if (offset) {
                var docViewTop      = $(this.global).scrollTop();
                var docViewBottom   = docViewTop + $(this.global).height();

                var elemTop         = offset.top;
                var elemBottom      = elemTop + $(el).height();

                inView              = elemBottom >= docViewTop && elemTop <= docViewBottom;
            }

            return inView;
        },

        /**
         * Waits until element is inside in the visible viewport and then calls the supplied callback
         *
         * @param {Siesta.Test.ActionTarget} el The element
         * @param {Function} callback The callback to call
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitUntilInView : function (el, callback, scope, timeout) {
            var me          = this;
            var R           = Siesta.Resource('Siesta.Test.Element');

            this.waitFor({
                method          : function() {
                    var normalized  = this.normalizeElement(el, true);

                    if(normalized && me.elementIsInView(normalized)) {
                        return normalized;
                    }
                },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitUntilInView',
                description     : el.toString + ' ' + R.get('toAppearInTheViewport')
            });
        },


        findScrolledParent : function(el) {
            var body   = el.ownerDocument.body;
            var parent = this.$(el);

                while (parent = parent.parent(), parent.length && parent[ 0 ] != body) {
                if (parent[0].scrollTop > 0 || parent[0].scrollLeft > 0) {
                    return parent[0];
                }
            }
        },

        focus : function (el, tryPreventScrollChange) {
            var prevIndex   = el.getAttribute('tabIndex')
            var scrolledParent;

            if (this.activeElement() === el) return;

            try {
                if (prevIndex == null) el.setAttribute('tabIndex', -1)

                if (tryPreventScrollChange) {
                    var oldScrollLeft, oldScrollTop;

                    // In Chrome, when calling focus() manually on an element - it's scrolled into view in its parent hierarchy
                    // Try to detect this and restore (This is far from optimal since application might have a listener triggering a desired
                    // scroll of this element. But not triggering focus() on mousedown seems like a worse situation
                    scrolledParent = this.findScrolledParent(el);

                    if (scrolledParent) {
                        oldScrollLeft = scrolledParent.scrollLeft;
                        oldScrollTop  = scrolledParent.scrollTop;
                    }
                }

                el.focus()

                if (scrolledParent && tryPreventScrollChange) {
                    if (oldScrollLeft !== scrolledParent.scrollLeft)  {
                        scrolledParent.scrollLeft = oldScrollLeft;
                    }

                    if (oldScrollTop !== scrolledParent.scrollTop)  {
                        scrolledParent.scrollTop = oldScrollTop;
                    }
                }
            } catch (e) {
            } finally {
                if (prevIndex == null)
                    el.removeAttribute('tabIndex')
                else
                    el.setAttribute('tabIndex', prevIndex)
            }
        },


        /**
         * Passes if the passed element has no content (whitespace will be trimmed)
         *
         * @param {Siesta.Test.ActionTarget} el The element
         * @param {String} [description] The description for the assertion
         */
        elementIsEmpty : function (el, description) {

            el              = this.normalizeElement(el);

            if (el && this.isElementEmpty(el)) {
                var R           = Siesta.Resource('Siesta.Test.Element');

                this.pass(description, {
                    descTpl         : R.get('elementIsEmptyPassTpl')
                })
            }
            else
                this.fail(description, {
                    got             : el.innerHTML,
                    need            : '',
                    assertionName   : 'elementIsEmpty'
                })
        },

        /**
         * Passes if the passed element has some non-whitespace content
         *
         * @param {Siesta.Test.ActionTarget} el The element
         * @param {String} [description] The description for the assertion
         */
        elementIsNotEmpty : function (el, description) {
            el              = this.normalizeElement(el);

            if (el && !this.isElementEmpty(el)) {
                var R           = Siesta.Resource('Siesta.Test.Element');

                this.pass(description, {
                    descTpl         : R.get('elementIsNotEmptyPassTpl')
                })
            }
            else
                this.fail(description, {
                    assertionName   : 'elementIsNotEmpty'
                })
        },

        /**
         * Waits until the innerHTML of the passed element is empty (whitespace will be trimmed)
         *
         * @param {Siesta.Test.ActionTarget} el The element to query
         * @param {Function} callback The callback to call after the CSS selector has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForElementEmpty : function(el, callback, scope, timeout) {
            var me          = this;
            var R           = Siesta.Resource('Siesta.Test.Element');

            el              = this.normalizeElement(el);

            return this.waitFor({
                method          : function() { return me.isElementEmpty(el); },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForElementEmpty',
                description     : ' ' + R.get('elementToBeEmpty')
            });
        },

        /**
         * Waits until the innerHTML of the passed element contains some non-whitespace text.
         *
         * @param {Siesta.Test.ActionTarget} el The element to query
         * @param {Function} callback The callback to call after the CSS selector has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForElementNotEmpty : function(el, callback, scope, timeout) {
            var me          = this;
            var R           = Siesta.Resource('Siesta.Test.Element');

            el              = this.normalizeElement(el);

            return this.waitFor({
                method          : function() { return !me.isElementEmpty(el); },
                callback        : callback,
                scope           : scope,
                timeout         : timeout,
                assertionName   : 'waitForElementNotEmpty',
                description     : ' ' + R.get('elementToNotBeEmpty')
            });
        },

        isElementEmpty : function (el) {
            return !el.innerHTML.replace(/^\s+|\s+$/g, '');
        },

        /**
         * Passes if the target element has an attribute with the provided value.
         *
         * @param {Siesta.Test.ActionTarget} el The element to query
         * @param {String} attribute The attribute
         * @param {String} value The value
         * @param {String} [description] The description for the assertion
         */
        hasAttributeValue : function(el, attribute, value, description) {
            el              = this.normalizeElement(el);

            var foundValue = el.getAttribute(attribute);

            this.is(foundValue, value, description);
        },

        /**
         * Passes if the passed element has the expected value as its "value" property (use with SELECT, INPUT type elements).
         *
         * @param {Siesta.Test.ActionTarget} el The element to query
         * @param {Mixed} value The value to compare to.
         * @param {String} [description] The description of the assertion
         */
        hasValue : function(el, value, description) {
            el              = this.normalizeElement(el);

            var foundValue = el.value;

            this.is(foundValue, value, description);
        },


        isElementFocusable : function(el) {
            var disabled = el.getAttribute('disabled') === "true";
            var nodeName = el.nodeName.toLowerCase();
            // Other tags are covered in isTextInput
            var focusable = { a : 1, area : 1, button : 1, object : 1, select : 1 };

            return !disabled &&
                (
                this.isTextInput(el) ||
                (el.nodeName.toLowerCase() === 'input' && el.type === 'file') ||
                nodeName in focusable ||
                (el.getAttribute('tabIndex') != null && (!$.browser.msie || String(el.getAttribute('unselectable')).toLowerCase() != 'on'))
                );
        }
    }
});
