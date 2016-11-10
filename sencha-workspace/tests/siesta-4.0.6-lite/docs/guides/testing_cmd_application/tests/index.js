var harness = new Siesta.Harness.Browser.ExtJS()

harness.configure({
    title           : 'testingcmd'
});

harness.start(
    'unit1.t.js'
);
