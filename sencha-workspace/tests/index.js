var harness = new Siesta.Harness.Browser.ExtJS();

harness.configure({
    title: 'Aggregrid Tests'
});

harness.start(
    {
        group: 'Application Tests',
        pageUrl: '../AggregridExample/index.html',
        items: [
            'jarvus-aggregrid/010_sanity.t.js',
            'jarvus-aggregrid/020_fully-configured.t.js'
        ]
    }
);