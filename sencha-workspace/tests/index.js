var harness = new Siesta.Harness.Browser.ExtJS();

harness.configure({
    title       : 'Aggregrid Example Tests',

    preload     : [
        '../AggregridExample/.sencha/app/Boot.js',
        '../build/testing/AggregridExample/app.js'
    ]
});

harness.start(
    'jarvus-aggregrid/010_sanity.t.js',
    'jarvus-aggregrid/020_aggregrid.t.js'
);