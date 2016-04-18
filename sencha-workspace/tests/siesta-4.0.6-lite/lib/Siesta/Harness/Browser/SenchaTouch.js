/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Harness.Browser.SenchaTouch
@extends Siesta.Harness.Browser 
@mixin Siesta.Harness.Browser.ExtJSCore

A Class representing the browser harness. This class provides a web-based UI and defines some additional configuration options.

The default value of the `testClass` configuration option in this class is {@link Siesta.Test.SenchaTouch}, which inherits from 
{@link Siesta.Test.Browser} and contains various Sencha Touch-specific assertions. Use this harness class when testing Sencha Touch applications.

* **Note** Make sure, you've checked the {@link #performSetup} configuration option. 

This file is for reference only, for a getting start guide and manual, please refer to <a href="#!/guide/siesta_getting_started">Getting Started Guide</a>.

Synopsys
========

    var harness = new Siesta.Harness.Browser.SenchaTouch();
        
    harness.configure({
        title           : 'Awesome Sencha Touch Application Test Suite',
                
        transparentEx   : true,
                
        preload         : [
            "http://cdn.sencha.io/ext-4.0.2a/ext-all-debug.js",
            "../awesome-project-all.js"
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

Class('Siesta.Harness.Browser.SenchaTouch', {

    isa: Siesta.Harness.Browser,

    does    : [
        Siesta.Harness.Browser.ExtJSCore
    ],
    
    has     : {
        /**
        * @cfg {Class} testClass The test class which will be used for creating test instances, defaults to {@link Siesta.Test.SenchaTouch}.
        * You can subclass {@link Siesta.Test.SenchaTouch} and provide a new class. 
        * 
        * This option can be also specified in the test file descriptor. 
        */
        testClass           : Siesta.Test.SenchaTouch,

        /**
         * @cfg {Boolean} transparentEx
         */
        transparentEx       : true,
        keepNLastResults    : 0,
        
        /**
         * @cfg {Boolean} performSetup When set to `true`, Siesta will perform a `Ext.setup()` call, so you can safely assume there's a viewport for example.
         * If, however your test code, performs `Ext.setup()` itself, you need to disable this option.
         * 
         * If this option is not explicitly specified in the test descritor, but instead inherited, it will be automatically disabled if test has {@link #pageUrl} value.
         * 
         * This option can be also specified in the test file descriptor.
         */
        performSetup        : true,
        
        forcedRunCore       : 'sequential',

        isRunningOnMobile   : true,
        
        contentManagerClass : Siesta.Content.Manager.Browser.ExtJSCore
    },


    methods: {
        
        setup : function () {
            // TODO fix proper mobile detection, since Ext may be absent in "no-ui" harness
            this.isRunningOnMobile = typeof Ext !== 'undefined' && Ext.getVersion && Ext.getVersion('touch')
            
            if (!this.isRunningOnMobile) this.keepNLastResults = 2
            
            this.SUPERARG(arguments)
        },


        getNewTestConfiguration: function (desc, scopeProvider, contentManager, launchState) {
            var config      = this.SUPERARG(arguments)
            var pageUrl     = this.getDescriptorConfig(desc, 'pageUrl');
            
            if (!desc.hasOwnProperty('performSetup') && pageUrl) {
                config.performSetup = false;
            } else {
                config.performSetup = this.getDescriptorConfig(desc, 'performSetup')
            }
            
            return config
        }
    }
})


