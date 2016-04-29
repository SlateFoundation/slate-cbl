var harness = new Siesta.Harness.Browser.ExtJS();

harness.configure({
    title: 'Aggregrid Tests'
});

harness.start(
    {
        group: 'jarvus-aggregrid package tests',
        preload: [
            '../ext-6.0.1.250/build/ext-all.js',
            '../packages/jarvus-aggregrid/src/Aggregrid.js'
        ],
        items: [
            'jarvus-aggregrid/010_sanity.t.js',
            'jarvus-aggregrid/020_fully-configured.t.js',
            'jarvus-aggregrid/021_render-later.t.js',
            'jarvus-aggregrid/022_stores-after-render.t.js',
            'jarvus-aggregrid/023_render-after-stores.t.js',
            'jarvus-aggregrid/024_render-between-stores.t.js'
        ]
    },
    {
        group: 'AggregridExample app tests',
        pageUrl: '../AggregridExample/index.html',
        items: [
            'AggregridExample/010_sanity.t.js'
        ]
    },
    {
        group: 'SlateTasksStudent',
        pageUrl: '../SlateTasksStudent/index.html',
        items: [
            'SlateTasksStudent/010_sanity.t.js',
            'SlateTasksStudent/020_dom-render.t.js',
            'SlateTasksStudent/021_ui-tests.t.js'
        ]
    },
    {
        group: 'SlateTasksTeacher',
        pageUrl: '../SlateTasksTeacher/index.html',
        items: [
            'SlateTasksTeacher/010_sanity.t.js',
            'SlateTasksTeacher/020_dom-render.t.js',
            'SlateTasksTeacher/021_ui-tests.t.js'
        ]
    },
    {
        group: 'SlateDemonstrationsStudent',
        pageUrl: '../SlateDemonstrationsStudent/index.html?apiHost=dev-cbl.node0.slate.is',
        items: [
            'SlateDemonstrationsStudent/010_sanity.t.js',
            'SlateDemonstrationsStudent/020_dom-render.t.js',
            'SlateDemonstrationsStudent/021_ui-tests.t.js'
        ]
    },
    {
        group: 'SlateDemonstrationsTeacher',
        pageUrl: '../SlateDemonstrationsTeacher/index.html?apiHost=dev-cbl.node0.slate.is',
        items: [
            'SlateDemonstrationsTeacher/010_sanity.t.js',
            'SlateDemonstrationsTeacher/020_dom-render.t.js'
        ]
    }
);