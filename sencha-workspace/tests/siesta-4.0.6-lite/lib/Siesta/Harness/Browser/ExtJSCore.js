/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Harness.Browser.ExtJSCore

This is a role (mixin), representing the shared functionality between Ext JS and SenchaTouch harnesses.

*/
Role('Siesta.Harness.Browser.ExtJSCore', {
    
    has : {
        /**
         * @cfg {Object} loaderPath
         * 
         * The path used to configure the Ext.Loader 'paths' config to resolve JS namespaces to file paths, for dynamic loading of Ext JS classes.
         * For more information, please see the Ext docs: http://docs.sencha.com/extjs/apidocs/#!/api/Ext.Loader-cfg-paths
         * 
         * See also {@link #requires}.
         * 
         * By default the value will be set right before the test starts. If you need to set it earlier (during preloading phase),
         * use {@link #getLoaderPathHook} method. 
         *
         * This option can be also specified in the test file descriptor. 
         * 
         * **Note**, that the value of this config will not be inherited from the parent tests group, if test has {@link Siesta.Harness.Browser#pageUrl} option set.
         */
        loaderPath              : null,
        
        /**
         * @cfg {Array[String]} requires
         * 
         * The array of class names, to be dynamically loaded with `Ext.require` call, before the test starts. Naturally, requires 
         * the correct value for the {@link #loaderPath} to be set. 
         * 
         * This option can be also specified in the test file descriptor. 
         */
        requires                : null,
        
        /**
         * @cfg {Boolean} waitForExtComponentQueryReady
         * 
         * Setting this configuration option to "true" will cause Siesta to wait until the `Ext.ComponentQuery` class is loaded on the page,
         * before starting the test. 
         *   
         * This option can (and probably should) be also specified in the test file descriptor. 
         */
        waitForExtComponentQueryReady       : true,
        
        
        // Set to true to fail t.knownBugInStatements, useful when running against Ext JS nightly builds
        failKnownBugIn          : false
    },
    
    
    override : {
        
        getNewTestConfiguration : function (desc, scopeProvider, contentManager, launchState) {
            var config              = this.SUPERARG(arguments)
            
            config.loaderPath       = this.getDescriptorConfig(desc, 'loaderPath')
            config.requires         = this.getDescriptorConfig(desc, 'requires')
            
            config.waitForExtComponentQueryReady = this.getDescriptorConfig(desc, 'waitForExtComponentQueryReady')
            
            return config
        },
        
        
        buildSandboxHashStructure : function () {
            var structure           = this.SUPERARG(arguments)
            
            structure.push('loaderPath', 'requires')
            
            return structure
        },
        
        
        buildHostPageUrlStopsInheriting : function () {
            var res         = this.SUPER()
            
            res.loaderPath  = true
            
            return res
        }
    },
    
    
    methods : {
        
        createViewport       : function(config) {
           return Ext.create("Siesta.Harness.Browser.UI.Viewport", config);
        },
        
            
        generateLoaderPathHook : function () {
            // Such tedious check to allow setting the paths without crash for Ext JS versions < 4
            // (which may have own "Ext.Loader" object)
            return function (StartTest, Ext, loaderPath) {
                if (!loaderPath || StartTest.loaderPathHookInstalled || !Ext || !Ext.Loader || !Ext.Loader.setPath) return
                
                StartTest.loaderPathHookInstalled   = true
                
                Ext.Loader.setPath(loaderPath)
            }
        },
        
        
        /**
         * Returns a string presentation of the ExtJS/SenchaTouch hook for setting "Ext.Loader" paths, 
         * suitable to be used in the test's {@link Siesta.Harness#preload preloads}. 
         * This will allow you to install the hook at the earliest possible point, 
         * right after preloading Ext and before "requiring" any classes. 
         * 
         * The value for the paths should be provided in the {@link #loaderPath} config. 
         * The inheritance of the value from groups is supported as usually, except the tests with 
         * {@link Siesta.Harness.Browser#pageUrl} option set.   
         * 
         * Typical usage will be:
         * 
    
    var harness = new Siesta.Harness.Browser.ExtJS();

    harness.configure({
        loaderPath              : { 'My' : 'js', 'My.Namespace' : 'js/somepath' },
        
        preload                 : [
            'http://cdn.sencha.io/ext-4.2.0-gpl/ext-all.js',
            {
                // inject the loader paths right after ExtJS and before the application file
                text    : harness.getLoaderPathHook()
            },
            'app.js'
        ]
    });

         * 
         * @return {String}
         */
        getLoaderPathHook : function () {
            var hook     = function (installationHook) {
                var parentWindow        = window.opener || window.parent
                var harness             = parentWindow.Siesta.my.activeHarness
                
                eval('(' + installationHook + ')')(StartTest, Ext, harness.getDescriptorConfig(harness.getScriptDescriptor(StartTest.id), "loaderPath"))
            }
            
            return ';(' + hook.toString() + ')(' + JSON.stringify(this.generateLoaderPathHook().toString()) + ')'
        }
    }
})