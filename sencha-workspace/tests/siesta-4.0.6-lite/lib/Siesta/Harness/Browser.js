/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Harness.Browser
@extends Siesta.Harness 

Class, representing the browser harness. This class provides a web-based UI and defines some additional configuration options.

The default value of the `testClass` configuration option in this class is {@link Siesta.Test.Browser}, which contains
only generic browser-related assertions. So, use this harness class, when testing a generic web page.

This file is for reference only, for a getting start guide and manual, please refer to <a href="#!/guide/siesta_getting_started">Getting Started Guide</a>.


Synopsys
========

    var harness = new Siesta.Harness.Browser();
    
    harness.configure({
        title     : 'Awesome Test Suite',
        
        transparentEx       : true,
        
        autoCheckGlobals    : true,
        expectedGlobals     : [
            'Ext',
            'Sch'
        ],
        
        preload : [
            "http://cdn.sencha.io/ext-4.0.2a/ext-all-debug.js",
            "../awesome-project-all.js",
            {
                text    : "console.log('preload completed')"
            }
        ]
    })
    
    
    harness.start(
        // simple string - url relative to harness file
        'sanity.t.js',
        
        // test file descriptor with own configuration options
        {
            url     : 'basic.t.js',
            
            // replace `preload` option of harness
            preload : [
                "http://cdn.sencha.io/ext-4.0.6/ext-all-debug.js",
                "../awesome-project-all.js"
            ]
        },
        
        // groups ("folders") of test files (possibly with own options)
        {
            group       : 'Sanity',
            
            autoCheckGlobals    : false,
            
            items       : [
                'data/crud.t.js',
                ...
            ]
        },
        ...
    )



*/

Class('Siesta.Harness.Browser', {
    
    isa         : Siesta.Harness,
    
    has : {
        id                  : null,
        
        /**
         * @cfg {Class} testClass The test class which will be used for creating test instances, defaults to {@link Siesta.Test.Browser}.
         * You can subclass {@link Siesta.Test.Browser} and provide a new class. 
         * 
         * This option can be also specified in the test file descriptor. 
         */
        testClass           : Siesta.Test.Browser,
        
        viewportClass       : "Siesta.Harness.Browser.UI.Viewport",

        viewport            : null,
        
        /**
         * @cfg {Boolean} autoRun When set to `true`, harness will automatically launch the execution either of the checked test files or the whole suite.
         * Default value is `false`
         */
        autoRun             : false,
        
        /**
         * @cfg {Boolean} viewDOM When set to `true`, harness will expand the panel with the `<iframe>` of the test file, so you can examine the content of DOM.
         * Default value is `false`
         */
        viewDOM             : false,
        
        /**
         * @cfg {String} domContainerRegion Should be exactly one of `east/west/south/north`. Controls the position of the dom container
         * panel. Set it to `south` to create a "portrait" mode of the results panel with the assertions grid at the top and DOM container
         * at the bottom.
         */
        domContainerRegion  : 'east',
        
        /**
         * @cfg {Boolean} speedRun When set to `true`, harness will reduce the quality or completely remove the visual effects for events simulation,
         * improving the speed of test. Default value is `true`.
         * 
         * This option can be also specified in the test file descriptor.
         */
        speedRun            : true,
        
        
        /**
         * @cfg {Integer} mouseMovePrecision 
         * 
         * Defines how precisely to follow the path between two points when simulating a drag or mouse move. 
         * Value 1 indicates that "mouseover/mouseout" events are simulated for every point along the path (which is 
         * often not required at all).
         * Value 2 indicates every other point will be used. In general, low value = slow dragging, high value = fast dragging.
         * 
         * Setting this option to some big number (like 100000) will cause Siesta to only simulate events for the 
         * initial and final points in the path, which provides significant performance boost. However, if you need
         * to verify some behaviour, triggered by mouse events from the element somewhere in the middle of the path
         * you may need to use lower value for this option. 
         * 
         * This option can be also specified in the test file descriptor.
         */
        mouseMovePrecision      : 1,

        /**
         * @cfg {Boolean} breakOnFail When set to `true`, the harness will not start launching any further tests after detecting a failed assertion.
         * Default value is `false`.
         */
        breakOnFail             : false,
        
        /**
         * @cfg {Boolean} debuggerOnFail When set to `true`, the harness will issue a `debugger` statement after detecting a failed assertion, allowing you
         * to inspect the internal state of the test in the browser's debugger. Default value is `false`.   
         */
        debuggerOnFail          : false,

        /**
         * @cfg {Boolean} failOnResourceLoadError When set to `true`, test will try to detect the failures for loading of 
         * various resources (`script/link/img` tags) and report those as failed assertions. Only supported in modern browsers.
         * Default value is `false`.
         * 
         * This option can be also specified in the test file descriptor.
         */
        failOnResourceLoadError : false,
        
        contentManagerClass : Siesta.Content.Manager.Browser,
        scopeProvider       : 'Scope.Provider.IFrame',
        
        /**
         * @cfg {Boolean} disableCaching When set to `true`, harness will prevent the browser caching of files being preloaded and the test files, by appending
         * a query string to it.
         * Note, that in this case, debuggers may not understand that you are actually loading the same file, and breakpoints may not work. Default value is `false`
         */
        disableCaching      : false,
        
        baseUrl             : window.location.href.replace(/(\?|#).*$/, '').replace(/\/[^/]*$/, '/'),
        baseHost            : window.location.host,
        baseProtocol        : window.location.protocol,
        
        /**
         * @cfg {Boolean} forceDOMVisible When set to `true` the tests will be executed in "fullscreen" mode, with their iframes on top of all other elements.
         * This is required in IE if your test includes interaction with the DOM, because the `document.getElementFromPoint()` method 
         * does not work correctly in IE unless the element is visible.
         *
         * This option is enabled by default in IE and disabled in all other browsers.
         * This option can be also specified in the test file descriptor (usually you will create a group of "rendering" tests). Usually it's only relevant for IE,
         * so using this option should look like:
         *

    harness.start(
        {
            group       : 'Rendering',
            
            forceDOMVisible    : $.browser.msie,
            
            items       : [
                'rendering/01_grid.t.js',
                ...
            ]
        },
        ...
    )
        
         */
        forceDOMVisible     : $.browser.msie,
        
        /**
         * @cfg {Boolean} runInPopup Experimental. When set to `true` the tests will be executed in the popup, instead of iframe.
         * You will need to enable popups the host you are testing from.
         * 
         * Popups provides almost exactly the same environment as standalone page - notably the `window.top` property
         * reference the popup itself, making it easier to test hash-based navigation.
         * 
         * Note, that mouse cursor visualization does not work for tests in popups.
         * 
         * This option can be also specified in the test file descriptor.
         */
        runInPopup          : false,
        
        
        /**
         * @cfg {String} pageUrl The url of the HTML page which will be the target for the test(s) (the URL must be on the same domain the harness HTML page). This option is used for application level testing, Siesta will visit this URL and then launch
         * the test. See `/examples/021-extjs-drag-drop/index.js` for an example.
         * 
         * Note that with this option, the test descriptor will stop inheriting the {@link #preload} option from parent descriptors/harness
         * (to make sure you don't preload your dependencies twice). This is usually an expected behavior, and you still can specify the `preload` option
         * directly on such descriptor if needed.
         * 
         * This option can be also specified in the test file descriptor. This option has a deprecated synonym - "hostPageUrl"
         * 
         * For example, to define that a test should be executed on a page generated by some php script:

    harness.start(
        {
            pageUrl         : '../my_php_script?page=home',     // url of the html page for test
            url             : '020_home_page_drag_n_drop.t.js'  // url of the js file, containing actual test code
        },
        ...
    )
         *  
         * 
         */
        pageUrl             : null,
        
        
        /**
         * @cfg {Boolean} useStrictMode When set to `false` the test scopes will be created w/o strict mode `DOCTYPE`. Default value is `true`.
         * This option is not applicable for tests with `pageUrl` option. 
         * 
         * This option can be also specified in the test file descriptor.
         */
        useStrictMode       : true,
        
        
        /**
         * @cfg {String} innerHtmlHead
         * 
         * A string that will be placed into the `innerHTML` property of the &lt;head&gt; tag, before starting the preload process. 
         * No validity checks will be performed.
         * 
         * This option will not be inherited by the tests with {@link #pageUrl} option set, unless it is explicitly set to the
         * `inherit` value.
         * 
         * This option can be specified in the test file descriptor.
         * 
         * See also {@link #innerHtmlBody}
         */
        innerHtmlHead       : null,
        
        
        /**
         * @cfg {String} innerHtmlBody
         * 
         * A string that will be placed into the `innerHTML` property of the &lt;body&gt; tag, before starting the preload process. 
         * No validity checks will be performed.
         * 
         * This option will not be inherited by the tests with {@link #pageUrl} option set, unless it is explicitly set to the
         * `inherit` value.
         * 
         * This option can be specified in the test file descriptor.
         * 
         * See also {@link #innerHtmlHead}
         */
        innerHtmlBody       : null,
        
        
        /**
         * @cfg {Boolean} sandbox
         * 
         * This option controls whether the individual tests should be run in isolation from each other. By default it is enabled,
         * and every test file will be run inside of the newly created iframe, so that it can not interfere with
         * any other test. Such setup gives you predictable starting state for every test, removes the need for any kind of
         * cleanup at the end of the test and is more robust in general.
         * 
         * However, the setup of every iframe take some time (for preloading). If you are sure that your tests
         * do not modify any global state (like global variable that can affect the other test) you may want to run 
         * all of them in the same context, saving the setup time. In this case, you may want to disable this option.
         * 
         * Siesta collects all tests with this option disabled and split them into chunks. Every chunk will have exactly
         * the same values for the configs that influence the initial setup of the page: {@link #preload}, {@link #alsoPreload}, 
         * {@link #pageUrl}, {@link Siesta.Test.ExtJS#requires} and some others. The tests inside of every 
         * chunk will be run sequentially, in the same sandbox.
         * 
         * **Important**: The 1st test in every chunk will be run normally. Starting from the 2nd one, tests
         * will skip the {@link Siesta.Test#isReady} check and {@link Siesta.Test#setup} methods. This is because all the 
         * setup is supposed to be already done by the 1st test. This behavior may change (or made configurable) in the future. 
         * 
         * This option can be specified in the test file descriptor.
         * 
         * See also {@link #sandboxBoundaryByGroup}, {@link #sandboxCleanup}
         */
        sandbox                         : true,
        
        /**
         * @cfg {Boolean} sandboxBoundaryByGroup
         * 
         * Only applicable for tests with the {@link #sandbox} option *disabled*.
         * 
         * when this option is enabled, the tests to be run in the same context will be guaranteed to reside in the same group.
         * If a new test group starts (even with the same "preload" config) - a fresh context for that group will be created
         * by Siesta.
         * 
         * For example, in the following setup, both "Group 1" and "Group 2" have sandboxing disabled and the 
         * same "preload" config. If `sandboxBoundaryByGroup` will be disabled all 4 individual tests will be run 
         * in the same context. If `sandboxBoundaryByGroup` will be enabled, separate fresh context will be created
         * for the tests from each group.  
         * 

    harness.configure({
        preload     : [ ... ]
    });
    
    harness.start(
        {
            group       : 'Group 1',
            sandbox     : false,
            items       : [
                '010-basics/010_sanity.t.js',
                '010-basics/020_jshint.t.js'
            ]
        },
        {
            group       : 'Group 2',
            sandbox     : false,
            items       : [
                '020-basics/010_sanity.t.js',
                '020-basics/030_bdd.t.js'
            ]
        },
        ...
    )

         * 
         */
        sandboxBoundaryByGroup          : true,
        
        
        /**
         * @cfg {Boolean} sandboxCleanup
         * 
         * Only applicable for tests with the {@link #sandbox} option *disabled*. When enabled, test that runs
         * in shared sandbox (the sandbox in which another test just has been run) will perform a cleanup. 
         * 
         * By default it will remove any "unexpected" globals (see {@link #expectedGlobals}) and clear the DOM.
         * 
         * If you will disable this option, every new test in the "groups" will start from the state previous test
         * has finished the execution. This will allow you split one big test scenario into several files
         * 
         * This option can be specified in the test file descriptor.
         */
        sandboxCleanup                  : true,
        
        uniqueCounter                   : 0,
        valueToHashIndicies             : Joose.I.Object,
        
        // lazy attribute, should be accessed with "getSandboxHashStructure" method
        sandboxHashStructure            : {
            lazy    : 'this.buildSandboxHashStructure'
        },
        
        
        /**
         * @cfg {String} runCore Either `parallel` or `sequential`. Indicates how the individual tests should be run - several at once or one-by-one.
         * 
         * Default value is "parallel", except for IE 6, 7, 8 where it's set to `sequential`.
         * 
         * Set this option to `sequential` for tests, that uses some exclusive resources (like for example focus of the
         * text fields).
         * 

    harness.start(
        'some_test.t.js',
        {
            url         : 'test_that_relies_on_focus.t.js',
            runCore     : 'sequential'
        }
    )

         * 
         * This option can be also specified in the test file descriptor. 
         */
        runCore                 : 'parallel',
        
        // a `runCore` value, "forced" for all tests, private, used for automation
        forcedRunCore           : null,
        
        /**
         * @cfg {String} simulateEventsWith
         * 
         * This option is IE9-strict mode (and probably above) specific. It specifies how Siesta should simulate events.
         * The options are 'dispatchEvent' (W3C standard) or 'fireEvent' (MS interface) - both are available in IE9 strict mode
         * and each activates different set of event listeners. See this blog post for detailed explanations: 
         * <http://www.digitalenginesoftware.com/blog/archives/76-DOM-Event-Model-Compatibility-or-Why-fireEvent-Doesnt-Trigger-addEventListener.html>
         * 
         * Valid values are "dispatchEvent" and "fireEvent".
         * 
         * The framework specific adapters (like {@link Siesta.Test.ExtJS} and like {@link Siesta.Test.jQuery}) choose the most appropriate value
         * automatically (unless explicitly configured). 
         */
        simulateEventsWith  : {
            is      : 'rw',
            init    : 'dispatchEvent'
        },
        
        // the test with currently "forced" (by the "forceDOMVisible" option) iframe 
        testOfForcedIFrame          : null,
        
        /**
         * @cfg {Boolean} autoScrollElementsIntoView
         * 
         * With this option enabled Siesta will try to scroll invisible action targets into the view automatically, before performing an
         * action (such as click etc).
         * 
         * This option can also be specified in the test file descriptor.
         */
        autoScrollElementsIntoView  : true,
        
        /**
         * @cfg {Boolean} enableUnreachableClickWarning When this option is set to `true` (default) Siesta will generate warnings
         * when click happens in the unreachable point of some element. For example, imagine the following situation: you have
         * a 10x10px "div" element with "overflow : hidden", and inside of it, another inner "div" 10x50px. Then you ask Siesta
         * to click on the inner div (by default it clicks in the center). The center of inner div is hidden by the outer div,
         * so click will happen on some other element and a warning will be issued.
         * 
         * Usually this behaviour is what you want, since it protects you from various mistakes, but sometimes you may want
         * to disable it, for example if you want to write your clicks like this: `{ click : someEl, offset : [ "50%", "100%+10" ] }`
         * (which means - click 10px to the right from right edge of the `someEl`).
         * 
         * Note, that warning won't be issued if in the click point there's some child element of the target element.
         * 
         * This option can also be specified in the test file descriptor.
         */
        enableUnreachableClickWarning   : true,
        
        
        /**
         * @cfg {Boolean} maintainViewportSize
         * 
         * Enabling this option will cause Siesta to honor the {@link #viewportWidth} and {@link #viewportHeight} configuration options.
         * 
         * This option can also be specified in the test file descriptor.
         */
        maintainViewportSize        : true,
        
        /**
         * @cfg {Number} viewportWidth 
         * 
         * The width of the test iframe, default value is 1024
         */
        viewportWidth               : 1024,
        
        /**
         * @cfg {Number} viewportHeight
         * 
         * The height of the test iframe, default value is 768
         */
        viewportHeight              : 768,

        /**
         * @cfg {Object} recorderConfig A custom config object used to configure the {@link Siesta.Recorder.Recorder} instance
         */
        recorderConfig              : null,
        
        /**
         * @cfg {Boolean} jasmine This option can only be specified in the {@link Siesta.Harness#start test files descriptor}.
         * If its set to `true`, the `url` property of the descriptor should point to the Jasmine spec runner html page.
         * Siesta then will automatically import the results from the Jasmine suite.
         * 
         * Additionally, one need to add a special reporter to the spec runner page, which is available 
         * as `SIESTA_FOLDER/bin/jasmine-siesta-reporter.js`.
         * 
         * Currently Siesta can import the results from Jasmine 2.0 and above.
         * 
         * Typical setup will look like (see also `SIESTA_FOLDER/examples/1.unit-tests/jasmine_suite/SpecRunner.html` example):

    <head>
        ...
        <script src="lib/jasmine-2.2.0/jasmine.js"></script>
        <script src="lib/jasmine-2.2.0/jasmine-html.js"></script>
        <script src="lib/jasmine-2.2.0/boot.js"></script>
        
        <!-- Add Siesta reporter to your Jamsine spec runner (adjust the path) -->
        <script src="../../../bin/jasmine-siesta-reporter.js"></script>
        ....
    </head>
             * &nbsp;
 
    harness.start(
        // regular Siesta test
        '010_regular_test.t.js',
        
        // a Jasmine test suite 
        {
            jasmine         : true,
            expectedGlobals : [ 'Player', 'Song' ],
            // url should point to the specs runner html page in this case 
            url             : 'jasmine_suite/SpecRunner.html'
        }
    )

         */
        

        /**
         * @cfg {Boolean} needUI This option determines whether the Siesta UI should be rendered. By default, it is enabled
         * when running suite in the browser and disabled in automation launcher. You can explictly set it to `true`, to show the UI
         * even in automation mode:
         * 

    harness.configure({
        needUI      : true
    })

         */
        needUI                      : true,
        
        // will read the settings from cookies when started
        stateful                    : true,
        
        uiMask                      : null,
        uiMaskActive                : false,
        
        hostPageUrlStopsInheriting  : function () {
            return this.buildHostPageUrlStopsInheriting()
        },

        /**
         * @cfg {String} rerunHotKey The key to press together with CTRL to rerun the latest test
         */
        rerunHotKey      : 'E',
        
        /**
         * @cfg {Boolean} restartOnBlur
         * 
         * **Experimental**. When this option is enabled, Siesta will emit a warning when focus moves outside of the test window.
         * When running in automation mode Siesta will also restart the test.
         * 
         * This option can also be specified in the test file descriptor.
         */
        restartOnBlur           : false,
        
        focusChecker            : {
            lazy        : function () {
                var el      = document.createElement('input')
                el.setAttribute('style', 'position : absolute; left : -1000px; top : -1000px')
                el.type     = 'text'
                
                document.body.appendChild(el)
                
                return el
            }
        }
    },
    
    
    after : {
        
        onBeforeScopePreload : function (scopeProvider, url) {
            if (this.viewport) this.viewport.onBeforeScopePreload(scopeProvider, url)
        },
        
        
        onTestSuiteStart : function (descriptors, contentManager, launchState) {
            if (this.viewport) this.viewport.onTestSuiteStart(descriptors, contentManager)
        },
        
        
        onTestSuiteEnd : function (descriptors, contentManager) {
            if (this.viewport) this.viewport.onTestSuiteEnd(descriptors, contentManager)
            
            // remove the links to forced iframe / test in hope to ease the memory pressure
            delete this.testOfForcedIFrame
            
            if (this.uiMaskActive) this.hideUiMask()
        },
        
        
        onTestStart : function (test) {
            if (this.viewport) this.viewport.onTestStart(test)
            
            if (test.hasForcedIframe()) {
                if (this.testOfForcedIFrame) this.hideForcedIFrame(this.testOfForcedIFrame)
            
                this.showForcedIFrame(test)
            
                this.testOfForcedIFrame     = test
            } else {
                if (this.uiMaskActive) this.hideUiMask()
            }
        },
        
        
        onTestUpdate : function (test, result, parentResult) {
            if (this.viewport) this.viewport.onTestUpdate(test, result, parentResult)
            
            if ((result instanceof Siesta.Result.Diagnostic) && result.isWarning && this.needUI) { 
                if (typeof console != 'undefined' && console.warn) console.warn(result + '')
            }
        },
        
        
        onTestEnd : function (test) {
            if (test.hasForcedIframe())             this.hideForcedIFrame(test)
            
            if (test == this.testOfForcedIFrame)    this.testOfForcedIFrame = null
            
            if (this.viewport) this.viewport.onTestEnd(test)
            
            // when browser is simulating the event on the element that is not visible in the iframe
            // it will scroll that point into view, using the `scrollLeft` property of the parent element
            // this line fixes that displacement
            var wrapper     = test.scopeProvider.wrapper
            
            if (wrapper) {
                wrapper.scrollLeft      = wrapper.scrollTop = 0
            }
            document.body.scrollLeft    = document.body.scrollTop = 0
        },
        
        
        onTestFail : function (test, exception, stack) {
            if (this.viewport) this.viewport.onTestFail(test, exception, stack)
        }
    },
    
    
    methods : {
        
        buildHostPageUrlStopsInheriting : function () {
            return {
                preload         : true,
                innerHtmlHead   : true,
                innerHtmlBody   : true
            }
        },
        
        
        buildSandboxHashStructure : function () {
            return [
                'preload',
                'alsoPreload',
                'hostPageUrl',
                'pageUrl',
                'useStrictMode',
                'overrideSetTimeout'
            ]
        },
    
    
        createViewport       : function(config) {
            return Ext.create(this.viewportClass, config);
        },
        
        
        canShowCursorForTest : function (test) {
            // return false for test's running in popups (not iframes), since we can't show any visual accompaniment for them
            if (!(test.scopeProvider instanceof Scope.Provider.IFrame)) return false;
        
            // if there is a "forced to be on top" test then we only need to compare the tests instances
            if (this.testOfForcedIFrame) {
                return this.testOfForcedIFrame.isFromTheSameGeneration(test)
            }
            
            // finally we can only show cursor for tests with iframe wrapper
            // (since mouse visualizer puts the cursor in it)
            return Boolean(test.scopeProvider.wrapper)
        },
        
        
        configure : function() {
            this.SUPERARG(arguments);

            this.id = this.title || window.location.href;
        },

        
        start : function () {
            // Opera's global variables handling is weird
            if ($.browser.opera) {
                this.autoCheckGlobals = false;
            }
            
            if ($.browser.msie && $.browser.version !== "9.0") {
                if (!this.hasOwnProperty('runCore')) this.runCore = 'sequential'
            }
            
            this.SUPERARG(arguments)
        },
        
        
        populateCleanScopeGlobals : function (scopeProvider, callback) {
            if (this.disableGlobalsCheck || $.browser.msie && Number(/^(\d+)/.exec($.browser.version)[ 1 ]) < 9) {
                // do nothing for IE < 9 - testing leakage of globals is not supported
                // also IE8 often crashes on this stage
                this.disableGlobalsCheck = true
                
                callback()
                
                return
            }
            
            // always populate the globals from IFrame (even if user specified the Window provider)
            this.SUPER('Scope.Provider.IFrame', callback)
        },
        
        
        onUnload : function () {
            Joose.O.each(this.scopesByURL, function (scopeProvider, url) {
                // to close opened popups when harness page unloads
                scopeProvider.cleanup()
            })
        },
        
        
        setup : function (callback) {
            var me      = this
            var sup     = this.SUPER
            
            window.onunload     = function () { me.onUnload() }
            
            // required to bring the window to front in FF
            window.focus()

            $(function () {
                // init the singleton
                Siesta.Harness.Browser.FeatureSupport();
                
                var needUI      = me.hasOwnProperty('needUI') || !me.isAutomated ? me.needUI : false
                
                if (typeof Ext != 'undefined' && needUI) {
                    me.autoLaunchTests  = false
                    
                    Ext.onReady(function () {
                        sup.call(me, function () {
                            me.viewport = me.createViewport({
                                title           : me.title,
                                harness         : me
                            })
                            
                            callback && callback()
                        })
                    })
                } else {
                    sup.call(me, callback)
                }
            })
        },
        
        
        getDescriptorConfig : function (descriptor, configName, doNotLookAtRoot) {
            // for any "normal" config use regular parent implementation
            if (!(configName in this.hostPageUrlStopsInheriting)) return this.SUPERARG(arguments)
            
            var testConfig          = descriptor.testConfig
            
            var hasOwnValue         = testConfig && testConfig.hasOwnProperty(configName) || descriptor.hasOwnProperty(configName)
            // this will include lookup in the "testConfig"
            var configValue         = this.lookUpValueInDescriptorTree(descriptor, configName)
            
            var hasPageUrl          = Boolean(this.getDescriptorConfig(descriptor, 'pageUrl', true))
            
            // for host page url, if we found preload value which is not inherit, then return it if its own 
            // (defined on the descriptor) otherwise return empty array
            if (hasPageUrl && configValue != 'inherit') return hasOwnValue ? configValue : []
                    
            do {
                var testConfig      = descriptor.testConfig
                var testHasValue    = testConfig && testConfig.hasOwnProperty(configName)
                
                if (testHasValue || descriptor.hasOwnProperty(configName)) {
                    var value       = testHasValue ? testConfig[ configName ] : descriptor[ configName ]
                    
                    if (value != 'inherit') return value
                }
                
                descriptor          = descriptor.parent
                
            } while (descriptor && descriptor != this)
                
            if (doNotLookAtRoot) 
                return undefined
            else
                return this[ configName ]
        },
        
        
        normalizeScopeProvider : function (desc) {
            this.SUPERARG(arguments)
            
            if (this.getDescriptorConfig(desc, 'runInPopup')) desc.scopeProvider = 'Scope.Provider.Window'
        },
        
        
        getScopeProviderConfigFor : function (desc, launchId) {
            var me                          = this
            var config                      = this.SUPERARG(arguments)
            
            config.cleanupDelay             = 0
            config.name                     = desc.title || desc.url.replace(/(.*\/)?(.*)/, '$2')
            config.cls                      = 'tr-iframe'
            
            config.performWrap              = true
            
            var wrapper                     = document.createElement('div')
            
            wrapper.className               = 'tr-iframe-wrapper'
            wrapper.innerHTML               = "<div class='tr-close fa fa-close'>&nbsp;</div><div class='tr-iframe-wrapper-inner'></div>"
            
            wrapper.childNodes[ 0 ].onclick = function () {
                var test                    = me.getTestByURL(desc.url)
                
                if (test) {
                    me.hideForcedIFrame(test)
                    
                    if (me.viewport) me.viewport.onManualCloseOfForcedIframe(test)
                } else {
                    this.parentElement.style.left   = '-10000px'
                    this.parentElement.style.top    = '-10000px'
                }
            }
            
            config.wrapper                  = wrapper
            config.iframeParentEl           = wrapper.childNodes[ 1 ]
            
            config.sourceURL                = config.sourceURL || this.getDescriptorConfig(desc, 'pageUrl')
            config.minViewportSize          = config.minViewportSize || {
                width   : this.getDescriptorConfig(desc, 'viewportWidth'),
                height  : this.getDescriptorConfig(desc, 'viewportHeight')
            }
            
            config.innerHtmlHead            = this.getDescriptorConfig(desc, 'innerHtmlHead')
            config.innerHtmlBody            = this.getDescriptorConfig(desc, 'innerHtmlBody')
            
            config.failOnResourceLoadError  = this.getDescriptorConfig(desc, 'failOnResourceLoadError')
            
            if (!config.hasOwnProperty('useStrictMode')) config.useStrictMode = this.getDescriptorConfig(desc, 'useStrictMode')
            
            return config
        },
        
        
        getNewTestConfiguration : function (desc, scopeProvider, contentManager, launchState) {
            var me              = this
            var config          = this.SUPERARG(arguments)
            
            if (this.hasOwnProperty('simulateEventsWith')) config.simulateEventsWith = this.simulateEventsWith
            
            Joose.A.each([
                'forceDOMVisible',
                'mouseMovePrecision',
                'autoScrollElementsIntoView',
                'enableUnreachableClickWarning',
                'restartOnBlur'
            ], function (name) {
                config[ name ]  = me.getDescriptorConfig(desc, name)
            })
            
            if (this.getDescriptorConfig(desc, 'speedRun')) {
                Joose.O.extend(config, {
                    actionDelay         : 1,
                    dragDelay           : 10,
                    pathBatchSize       : 30
                })
            }
            
            return config
        },
        
        
        assignUniqueTag     : function (value, configName) {
            // has to be an Object-like value (object, array, function, etc)
            if (value == null) return ''
            
            if (value === Object(value)) {
                if (value.__UNIQUE__) return value.__UNIQUE__
                
                return value.__UNIQUE__ = (this.uniqueCounter++).toString(36)
            } else {
                value                   = value + ''
                
                var configIndex         = this.valueToHashIndicies[ configName ]
                
                if (!configIndex) configIndex = this.valueToHashIndicies[ configName ] = {}
                
                if (configIndex[ value ]) return configIndex[ value ]
                
                return configIndex[ value ] = (this.uniqueCounter++).toString(36)
            }
        },
        
        
        calculateSharedContextGroupHash : function (desc) {
            var me              = this
            var structure       = this.getSandboxHashStructure()
            
            var hash            = ''
            
            Joose.A.each(structure, function (configName) {
                hash            += me.assignUniqueTag(me.getDescriptorConfig(desc, configName), configName)
            })
            
            if (this.sandboxBoundaryByGroup) hash += this.assignUniqueTag(desc.parent)
                
            return hash
        },
        
        
        sortDescriptors : function (descriptors, forcedRunCore, idsOnly) {
            var me                  = this
            var canRunParallel      = []
            var mustRunSequential   = []
            
            // array of { groupHash : ..., items : [] } objects
            var sharedContextGroups = []
            var groupsByHash        = {}
            
            Joose.A.each(descriptors, function (desc) {
                if (!me.getDescriptorConfig(desc, 'sandbox')) {
                    var hash        = me.calculateSharedContextGroupHash(desc)
                    var group       = groupsByHash[ hash ]
                    
                    if (!group) {
                        group       = groupsByHash[ hash ] = { groupHash : hash, items : [] }
                        sharedContextGroups.push(group)
                    }
                    
                    group.items.push(idsOnly ? desc.id : desc)
                } else {
                    var runCore         = forcedRunCore || me.getDescriptorConfig(desc, 'runCore')
                    
                    if (runCore == 'sequential' || me.getDescriptorConfig(desc, 'forceDOMVisible'))
                        mustRunSequential.push(idsOnly ? desc.id : desc)
                    else
                        canRunParallel.push(idsOnly ? desc.id : desc)
                }
            })
            
            return {
                sharedContextGroups     : sharedContextGroups,
                mustRunSequential       : mustRunSequential,
                canRunParallel          : canRunParallel
            }
        },
        
        
        runCoreGeneral : function (descriptors, contentManager, launchState, callback) {
            var me          = this
            var sorted      = this.sortDescriptors(descriptors, this.forcedRunCore, false)
            
            me.runCoreSharedContext(sorted.sharedContextGroups, contentManager, launchState, function () {
                    
                me.runCoreParallel(sorted.canRunParallel, contentManager, launchState, function () {
                    
                    me.runCoreSequential(sorted.mustRunSequential, contentManager, launchState, callback)
                })
            })
        },
        
        
        runCoreSharedContext : function (sharedContextGroups, contentManager, launchState, callback) {
            var me                  = this
            
            var processDescriptor   = function (group, isFirst, scopeProvider, firstDesc) {
                var descriptors     = group.items
                
                if (!descriptors.length) { processGroup(sharedContextGroups); return }
                
                var desc            = descriptors.shift()
                
                // if there's a descriptor left after the shift do not cleanup the
                // scope provider at the end of the test (as its going to be re-used by the next test)
                var noCleanup       = descriptors.length > 0
                
                if (isFirst) {
                    // new context should be created for the 1st item in the group
                    me.processURL(desc, desc.index, contentManager, launchState, function () {
                        processDescriptor(group, false, me.scopesByURL[ desc.url ], desc)
                    }, noCleanup, group)
                } else {
                    // same context should be re-used
                    me.processUrlShared(desc, desc.index, contentManager, launchState, function () {
                        processDescriptor(group, false, scopeProvider, firstDesc)
                    }, noCleanup, group, scopeProvider, firstDesc)
                }
            }
                
            var processGroup        = function (sharedContextGroups) {
                if (!sharedContextGroups.length) { callback(); return }
                
                var group           = sharedContextGroups.shift()
                
                processDescriptor(group, true)
            }
            
            processGroup(sharedContextGroups)
        },
        
        
        processUrlShared : function (desc, index, contentManager, launchState, callback, noCleanup, sharedSandboxState, scopeProvider, firstDesc) {
            var me      = this
            var url     = desc.url
            
            // If first test in group is missing - behavior is undefined
            if (desc.isMissing) {
                callback()
                
                return
            }
            
            // a magical shared object, which will contain the `test` property with test instance, once the test will be created
            var testHolder      = {}
            // an array of errors occured during preload phase
            var preloadErrors   = []    
            
            var onErrorHandler  = this.getOnErrorHandler(testHolder, preloadErrors)
            var transparentEx   = this.getDescriptorConfig(desc, 'transparentEx')
            
            // trying to setup the `onerror` handler as early as possible - to detect each and every exception from the test
            scopeProvider.addOnErrorHandler(onErrorHandler, !transparentEx)
            
            if (desc.testCode || this.cachePreload && contentManager.hasContentOf(desc.url))
                scopeProvider.runCode(desc.testCode || contentManager.getContentOf(desc.url), cont)
            else
                scopeProvider.runScript(this.resolveURL(desc.url, scopeProvider, desc), cont)
                
            function cont() {
                // scope provider has been cleaned up while setting up? (may be user has restarted the test)
                // then do nothing
                if (!scopeProvider.scope) { callback(); return }
                
                var testClass       = me.getDescriptorConfig(desc, 'testClass')
                if (me.typeOf(testClass) == 'String') testClass = Joose.S.strToClass(testClass)
                
                var testConfig      = me.getNewTestConfiguration(desc, scopeProvider, contentManager, launchState, sharedSandboxState)
                
                // create the test instance early, so that one can perform some setup (as the test class method call)
                // even before the "pageUrl" starts loading
                var test            = testHolder.test = new testClass(testConfig)
                
                me.launchTest({
                    testHolder          : testHolder,
                    desc                : desc,
                    scopeProvider       : scopeProvider,
                    contentManager      : contentManager,
                    launchState         : launchState,
                    preloadErrors       : preloadErrors,
                    onErrorHandler      : onErrorHandler,
                    
                    startTestAnchor     : scopeProvider.scope.StartTest,
                    noCleanup           : noCleanup,
                    cleanupUrl          : firstDesc.url,
                    reusingSandbox      : true
                }, callback)
            }
        },
        
        
        normalizeURL : function (url) {
            // ref to JSAN module - DEPRECATED
            if (/^jsan:/.test(url)) url = '/jsan/' + url.replace(/^jsan:/, '').replace(/\./g, '/') + '.js'
            
            // ref to lib in current dist (no `/` and trailing `.js`) - DEPRECATED 
            if (!/\.js$/.test(url) && !/\//.test(url) && !/\.css(\?.*)?$/i.test(url)) url = '../lib/' + url.replace(/\./g, '/') + '.js'
            
            return url
        },
        
        
        normalizeDescriptor : function (desc, parent, index, level) {
            var desc        = this.SUPERARG(arguments)
            
            if (!desc.group && desc.jasmine) {
                desc.pageUrl            = desc.url
                desc.testCode           = this.getJasmineTestCode()
                // preloads will not be inherited anyway because "pageUrl" option presents
                // but we explicitly remove them one more time
                desc.preload            = []
            }
            
            return desc
        },

    
        resolveURL : function (url, scopeProvider, desc) {
            // if the `scopeProvider` is provided and it has a sourceURL - then absolutize the preloads relative to that url
            if (scopeProvider && scopeProvider.sourceURL) url = this.absolutizeURL(url)
            
            if (this.disableCaching)
                // if there's a ?param string in url - append new param
                if (/\?./.test(url))
                    url += '&disableCaching=' + new Date().getTime()
                else
                    if (!/\?$/.test(url)) 
                        url += '?disableCaching=' + new Date().getTime()
            
            // otherwise assumed to be a raw filename, relative or absolute
            return url
        },
        
        
        absolutizeURL : function (url, baseUrl) {
            // if the url is already absolute - just return it (perhaps with some normalization - 2nd case)
            // the url starting with // is also valid absolute url
            if (/^((https?|file):)?\/\//.test(url))  return url
            if (/^\//.test(url))    return this.baseProtocol + '//' + this.baseHost + url
            
            baseUrl             = baseUrl || this.baseUrl
            
            // strip the potential query and filename from baseURL, leaving only the "directory" part
            baseUrl             = baseUrl.replace(/\?.*$/,'').replace(/\/[^/]*$/, '/')
            
            // first absolutize the base url relative the harness page (which will be always global, so it won't recurse)
            var absBaseUrl      = this.absolutizeURL(baseUrl, this.baseUrl)
            
            // add a trailing "/" if missing
            absBaseUrl          = absBaseUrl.replace(/\/?$/, '/')
            
            return absBaseUrl + url
        },
        
        
        getUiMask : function () {
            if (this.uiMask) return this.uiMask
            
            var uiMask              = this.uiMask = document.createElement('div')
            
            uiMask.className        = 'tr-ui-mask'
            uiMask.style.display    = 'none'
            
            document.body.appendChild(uiMask)
            
            return uiMask
        },
        
        
        showUiMask  : function () {
            var mask            = this.getUiMask()
            
            mask.style.display  = 'block'
            
            this.uiMaskActive   = true
        },
        
        
        hideUiMask  : function () {
            var mask            = this.getUiMask()
            
            mask.style.display  = 'none'
            
            this.uiMaskActive   = false
        },
        
        
        showForcedIFrame : function (test) {
            $.rebindWindowContext(window);
            
            test.isDOMForced    = true
            
            var wrapper         = test.scopeProvider.wrapper
            
            $(wrapper).addClass('tr-iframe-forced')
            $(wrapper).removeClass('tr-iframe-hidden')
        
            $(wrapper).center()
            
            test.fireEvent('testframeshow')
        },
    
    
        hideForcedIFrame : function (test) {
            $.rebindWindowContext(window);
            
            // once hidden, forced iframe will be never be shown again as "forced", only as "normal"
            test.isDOMForced        = false
            test.forceDOMVisible    = false
            
            var wrapper         = test.scopeProvider.wrapper
            
            $(wrapper).removeClass('tr-iframe-forced')
            $(wrapper).addClass('tr-iframe-hidden')
            
            test.fireEvent('testframehide')
        },
        
        
        showForcedIFrameScreenshot : function (test) {
            this.showUiMask()
            
            $.rebindWindowContext(window);
            
            var wrapper         = test.scopeProvider.wrapper
            
            $(wrapper).addClass('tr-iframe-forced-screenshot')
            $(wrapper).removeClass('tr-iframe-forced')
            $(wrapper).removeClass('tr-iframe-hidden')
        },
    
    
        hideForcedIFrameScreenshot : function (test) {
            this.hideUiMask()
            
            $.rebindWindowContext(window);
            
            var wrapper         = test.scopeProvider.wrapper
            
            $(wrapper).removeClass('tr-iframe-forced-screenshot')
            
            if (test.isDOMForced) {
                $(wrapper).addClass('tr-iframe-forced')
                $(wrapper).center()
            }
        },
        
        
        getQueryParam : function (paramName) {
            return this.my.getQueryParam(paramName, true)
        },
        
        
        getJasmineTestCode : function () {
            return ';(' + (function () {
                
                StartTest(function (t) {
                    t.expectGlobals(
                        'getJasmineRequireObj', 'jasmineRequire', 'jasmine', 'xdescribe', 'describe', 'xdescribe', 'fdescribe',
                        'it', 'xit', 'fit', 'spyOn', 'fail', 'jsApiReporter', 'beforeEach', 'afterEach', 'beforeAll', 'afterAll',
                        'expect', 'pending'
                    )
                    
                    if (!window.jasmine) {
                        t.fail(t.resource('Siesta.Harness.Browser', 'noJasmine'))
                        
                        return
                    }
                    
                    if (!jasmine.SiestaReporter) {
                        t.fail(t.resource('Siesta.Harness.Browser', 'noJasmineSiestaReporter'))
                        
                        return
                    }
                    
                    jasmine.SiestaReporter.importResults(t)
                })
                
            }).toString() + ')();'
        },
        
        
        /**
         * This methos returns `true` if this harness is being run on the 
         * [Standard package](http://www.bryntum.com/products/siesta/) of Siesta, `false` otherwise.
         * 
         * @return {Boolean}
         */
        isStandardPackage : function () {
            return this.my.isStandardPackage(true)
        },
        
        
        // should only be used when no tests are running
        // does not work for IE
        // Safari webdriver has known problem of starting browser in the background, w/o focus
        browserWindowHasFocus : function () {
            window.focus()
            
            var el      = this.getFocusChecker()
            
            el.focus()
            
            $.rebindWindowContext(window);
            
            return $(el).is(':focus')    
        }
    },
    
    
    my : {
        
        methods : {
            
            isStandardPackage : function (calledFromInstance) {
                if (!calledFromInstance) this.staticDeprecationWarning('isStandardPackage')
                
                return Boolean(Siesta.Harness.Browser.Automation)
            },
            
            
            getQueryParam : function (paramName, calledFromInstance) {
                if (!calledFromInstance) this.staticDeprecationWarning('getQueryParam')
                
                var regex       = new RegExp('(?:\\?|&)' + paramName + '=(.*?)(?:\\?|&|$)', 'i')
            
                var match       = regex.exec(window.location.search)
            
                if (!match) return null
            
                return match[ 1 ]
            }
        }
    }
})
//eof Siesta.Harness.Browser