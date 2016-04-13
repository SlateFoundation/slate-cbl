var harness = new Siesta.Harness.Browser.ExtJS();

harness.configure({
    title       : 'My Test Suite',

    preload     : [
        // version of ExtJS used by your application 
        // (not needed if you use Sencha Cmd which builds a complete 'all-file' including Ext JS itself)
        // 'ext-all.css',
        // 'ext-all-debug.js',

        // Your application files
        // '../resources/yourproject-css-all.css',
        '../build/production/AggregridExample/app.js'
    ]
});

harness.start(
    'siesta-4.0.6-lite/tests/sanity/010_sanity.t.js'
    // 'siesta-4.0.6-lite/tests/sanity/020_basic.t.js'
);