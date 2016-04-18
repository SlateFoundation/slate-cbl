var harness = new Siesta.Harness.Browser.ExtJS()

harness.configure({
    title               : 'Doc-image-gen',
    forceDOMVisible     : true,
    separateContext     : true,
    runCore             : 'sequential',
    testClass           : Test.ScreenShots,
    hostPageUrl         : '../../../examples/index.html',
    
    viewportWidth       : 800,
    viewportHeight      : 600,

    recorderConfig      : {
        uniqueComponentProperty : [ 'action', 'actionName' ]
    }
});

harness.start(
    {
        group : 'Screenshots',

        items : [
            'tests/welcome.png.t.js',
            'tests/getting-started.t.js',
            'tests/event-recorder.t.js',
            'tests/testing-cmd.t.js'
        ]
    }
);

