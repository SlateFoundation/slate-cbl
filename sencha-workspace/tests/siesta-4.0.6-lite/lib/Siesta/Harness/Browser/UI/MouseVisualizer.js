/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
// Internal class visualizing the cursor position, only used in good browsers (!== IE)
Class('Siesta.Harness.Browser.UI.MouseVisualizer', {

    has : {

        cursorEl                 : null,
        onEventSimulatedListener : null,
        onTestFinishedListener   : null,
        harness                  : null,
        currentTest              : null,
        currentContainer         : null,

        clickEvents : function () {
            return {
                click       : 0,
                dblclick    : 0,
                touchstart  : 0,
                touchend    : 0,
                mousedown   : 0,
                contextmenu : 0
            }
        }
    },

    methods : {
        initialize : function (config) {

            config = config || {}

            for (var o in config) {
                config.hasOwnProperty(o) && (this[o] = config[o]);
            }

            delete this.harness

            this.setHarness(config.harness)
        },

        getCursorEl : function () {
            if (this.cursorEl) return this.cursorEl

            var currentContainer = this.currentContainer

            if (!currentContainer) throw "Need container for cursor"

            var cursor = currentContainer.querySelector('.ghost-cursor');

            if (!cursor) {
                var el       = document.createElement('div');
                el.className = 'ghost-cursor fa fa-mouse-pointer';

                cursor = currentContainer.appendChild(el);
            }

            return this.cursorEl = cursor;
        },


        setHarness : function (harness) {
            if (this.harness) {
                this.harness.un('testframeshow', this.onTestFrameShow, this);
                this.harness.un('testframehide', this.onTestFrameHide, this);
            }

            this.harness = harness

            if (harness) {
                harness.on('testframeshow', this.onTestFrameShow, this);
                harness.on('testframehide', this.onTestFrameHide, this);
                harness.on('recorderplay', this.onRecorderPlay, this);
            }
        },


        reset : function () {
            if (this.onEventSimulatedListener) {
                this.onEventSimulatedListener.remove()
                this.onEventSimulatedListener = null
            }

            if (this.onTestFinishedListener) {
                this.onTestFinishedListener.remove()
                this.onTestFinishedListener = null
            }

            this.cursorEl         = null
            this.currentTest      = null
            this.currentContainer = null
        },


        onTestFrameShow : function (event) {
            var test = event.source;

            this.beginCursorVisualization(test);
        },

        onRecorderPlay : function (recorder, test) {
            this.beginCursorVisualization(test);
        },

        beginCursorVisualization : function (test) {
            // do not react on re-positions of the same running test
            if (test == this.currentTest) return

            this.reset()

            this.currentTest = test

            if (this.harness.canShowCursorForTest(test)) {
                this.currentContainer = test.scopeProvider.wrapper.childNodes[1]

                this.onEventSimulatedListener = test.on('eventsimulated', this.onEventSimulated, this);
                this.onTestFinishedListener   = test.on('testfinalize', this.onTestFinished, this);
            }
        },


        onTestFrameHide : function (event) {
            // ideally, instead of this cleanup, we need to keep listening for the
            // `testfinalize` event on all tests visualizer has been "attached" to
            // and cleanup only in that event
            this.cleanupCursor()
            this.reset()
        },


        // this method can be called already after the test has been finalized and cursor element fade out
        // during that time, current test may change, so it needs to work in 2 modes
        // 1) "sync" mode, when its "attached" to the "this.currentTest"
        // 2) "async" mode, when it cleans up the cursor of the "old" test
        cleanupCursor : function (cursorEl, currentContainer) {
            cursorEl         = cursorEl || this.cursorEl
            currentContainer = currentContainer || this.currentContainer

            if (currentContainer) {
                try {
                    cursorEl.parentNode.removeChild(cursorEl);
                } catch (e) {
                    // catch potential exceptions for example
                    // if iframe of test has been already removed
                }

                try {
                    var els = currentContainer.querySelectorAll('.ghost-cursor-click-indicator-big');
                    for (var i = els.length; i >= 0; --i) {
                        var el = els.item(i);
                        el.parentNode.remove(el);
                    }
                } catch (e) {
                    // catch potential exceptions for example
                    // if iframe of test has been already removed
                }
            }
        },


        onTestFinished : function (event, test) {
            var cursorEl         = this.cursorEl
            var currentContainer = this.currentContainer

            this.reset()

            // if test was using cursor at all
            if (cursorEl) {
                var me = this;

                cursorEl.classList.add('ghost-cursor-hidden');

                setTimeout(function () {
                    me.cleanupCursor(cursorEl, currentContainer);
                }, 2000);
            }
        },


        onEventSimulated : function (event, test, el, type, evt) {
            if (type.match(/touch|mouse|click|contextmenu/) && typeof evt.clientX === 'number' && typeof evt.clientY === 'number') {
                // this should never happen, but still happens sometimes
                if (!this.currentContainer) return

                var x = test.currentPosition[0],
                    y = test.currentPosition[1];

                this.updateGhostCursor(type, x, y);

                if (type in this.clickEvents) {
                    this.showClickIndicator(type, x, y);
                }
            }
        },

        // This method shows a fading growing circle at the xy position
        showClickIndicator : function (type, x, y) {
            var clickEl = document.createElement('div');

            clickEl.className = 'ghost-cursor-click-indicator ';
            clickEl.style.setProperty('left', x + 'px');
            clickEl.style.setProperty('top', +y + 'px');

            clickEl.addEventListener("animationend", this.afterAnimation);
            clickEl.addEventListener("webkitAnimationEnd", this.afterAnimation);

            this.currentContainer.appendChild(clickEl);
        },

        afterAnimation : function() {
            this.parentNode.removeChild(this);
        },

        // Updates the ghost cursor position and appearance
        updateGhostCursor : function (type, x, y) {
            var cursorEl        = this.getCursorEl(),
                translateStyle  = $.browser.opera ? ('translate(' + x + 'px,' + y + 'px)') :
                                 ('translate3d(' + x + 'px, ' + y + 'px, 0)');

            cursorEl.style.setProperty('-webkit-transform', translateStyle)
            cursorEl.style.setProperty('transform', translateStyle)
        }
    }
});
