var harness = new Siesta.Harness.Browser.ExtJS();

harness.configure({
    title       : 'Aggregrid Example Tests',

    preload     : [
        '../AggregridExample/.sencha/app/Boot.js',
        '../build/testing/AggregridExample/app.js'
    ]
});

harness.start(
    'siesta-4.0.6-lite/tests/sanity/010_sanity.t.js',
    'siesta-4.0.6-lite/tests/jarvus-aggregrid/Aggregrid.js'
);