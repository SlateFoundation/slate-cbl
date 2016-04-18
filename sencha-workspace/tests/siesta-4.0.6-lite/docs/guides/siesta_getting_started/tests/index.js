var harness = new Siesta.Harness.Browser.ExtJS()

harness.configure({
    title           : 'synopsys',
    preload : [

    ]
});

harness.start(
    '010_sanity.t.js',
    '020_basic.t.js'
);
