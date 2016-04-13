StartTest(function (t) {
    document.body.innerHTML = 'foo';

    t.it('Click with ctrl key, with ctrl + shift', function (t) {
        var recorder = new Siesta.Recorder.ExtJS({ ignoreSynthetic : false });
        recorder.attach(window);
        recorder.start();

        t.chain(
            { click : [ 1, 1 ], options : { ctrlKey : true } },
            { click : [ 1, 1 ], options : { ctrlKey : true, shiftKey : true } },

            function () {
                var steps   = recorder.getRecordedActionsAsSteps();

                recorder.stop();

                t.isDeeply(
                    steps, 
                    [
                        { action : "click", target : [ 1, 1 ], options : { ctrlKey : true } },
                        { action : "click", target : [ 1, 1 ], options : { ctrlKey : true, shiftKey : true } }
                    ]
                )
            }
        );
    })

    t.it('Typing chars with SHIFT should work', function (t) {
        var recorder = new Siesta.Recorder.ExtJS({ ignoreSynthetic : false });
        recorder.attach(window);
        recorder.start();
        var KeyCodes        = Siesta.Test.Simulate.KeyCodes().keys

        var el              = document.body;

        t.chain(
            { type : 'f' },

            function(next) {
                t.simulateEvent(el, 'keydown', { keyCode : KeyCodes.SHIFT });
                t.simulateEvent(el, 'keydown', { keyCode : 65 });
                t.simulateEvent(el, 'keypress', { keyCode : 0, charCode : 65, shiftKey : true });
                t.simulateEvent(el, 'keyup', { keyCode : KeyCodes.A });
                t.simulateEvent(el, 'keyup', { keyCode : KeyCodes.SHIFT });

                next()
            },

            { type : 'n' },

            function() {
                var steps   = recorder.getRecordedActions();

                t.is(steps.length, 1)
                t.is(steps[0].value, 'fAn')
            }
        )
    })
    
    t.it('Typing CTRL+C should work', function (t) {
        var recorder = new Siesta.Recorder.ExtJS({ ignoreSynthetic : false });
        recorder.attach(window);
        recorder.start();
        var KeyCodes        = Siesta.Test.Simulate.KeyCodes().keys

        t.chain(
            { type : 'C', options : { ctrlKey : true } },
            { type : 'next' },

            function() {
                var steps   = recorder.getRecordedActions();

                t.is(steps.length, 2)
                t.is(steps[ 0 ].value, 'C')
                t.is(steps[ 1 ].value, 'next')
                t.isDeeply(steps[ 0 ].options, { ctrlKey : true })
            }
        )

    })

    t.it('Mac: Typing Cmd+C should work', function (t) {
        var recorder = new Siesta.Recorder.ExtJS({ ignoreSynthetic : false, debugMode : false });

        if(recorder.parseOS(navigator.platform) !== 'MacOS') return;

        recorder.attach(window);
        recorder.start();
        var KeyCodes        = Siesta.Test.Simulate.KeyCodes().keys

        t.chain(
            { keyPress : ['body', 'CMD', { metaKey : true }] },
            { keyPress : ['body', 'C', { metaKey : true }] },

            { type : 'next' },

            function() {
                var steps   = recorder.getRecordedActions();

                t.is(steps.length, 2)
                t.is(steps[ 0 ].value, '[CMD]C')
                t.is(steps[ 1 ].value, 'next')
                t.isDeeply(steps[ 0 ].options, { metaKey : true })
            }
        )

    })

})