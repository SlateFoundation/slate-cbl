var harness = new Siesta.Harness.Browser.ExtJS();

harness.configure({
    title: 'Aggregrid Tests'
});

harness.start(
    {
        group: 'Unit Tests',
        preload: [
            '../ext-6.0.1.250/build/ext-all.js',
            '../packages/jarvus-aggregrid/build/jarvus-aggregrid.js'
        ],
        items: [
            'jarvus-aggregrid/010_sanity.t.js',
            'jarvus-aggregrid/020_fully-configured.t.js'
        ]
    },
    {
        group: 'Application Tests',
        pageUrl: '../AggregridExample/index.html',
        items: [
            'AggregridExample/010_sanity.t.js'
        ]
    }
);