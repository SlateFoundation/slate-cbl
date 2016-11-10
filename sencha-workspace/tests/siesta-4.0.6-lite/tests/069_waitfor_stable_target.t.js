StartTest(function (t) {
    t.describe('Basic tests', function (t) {

        function basicClickTest(name) {

            t.it(name, function (t) {

                var btn = new Ext.Button({ id : name, text : name });

                setTimeout(function () {
                    btn.render(Ext.getBody());

                    t.firesOnce(btn.el, name);
                }, 500)

                t.chain(
                    { action : name, target : '#' + name }
                )
            })

        }

        Ext.Array.each([
            'click',
            'dblclick',
            'contextmenu'
        ], basicClickTest)

        t.it('moveMouseTo', function (t) {

            var btn = new Ext.Button({ id : 'moveMouseTo', text : 'moveMouseTo' });

            setTimeout(function () {
                btn.render(Ext.getBody());

                t.firesOnce(btn.el, 'mouseenter');
            }, 500)

            t.chain(
                { moveCursorTo : '#moveMouseTo' }
            )
        })

        t.it('dragBy', function (t) {

            var btn = new Ext.Button({ id : 'dragBy', text : 'dragBy' });

            setTimeout(function () {
                btn.render(Ext.getBody());

                t.firesOnce(btn.el, 'mousedown');
            }, 500)

            t.chain(
                { drag : '#dragBy', by : [2, 2] }
            )
        })

        t.it('dragTo', function (t) {

            var btn = new Ext.Button({ id : 'dragTo', text : 'dragTo' });

            setTimeout(function () {
                btn.render(Ext.getBody());

                t.firesOnce(btn.el, 'mousedown');
            }, 500)

            t.chain(
                { drag : '#dragTo', to : [2, 2] }
            )
        })

        t.it('Should wait until target el becomes top', function (t) {
            var el1 = document.createElement('div')

            el1.id             = 'one'
            el1.style.position = 'absolute'
            el1.style.left     = '0'
            el1.style.top      = '100px'
            el1.style.zIndex   = 5
            el1.innerHTML      = 'TEXT ONE'

            document.body.appendChild(el1)

            var el2 = document.createElement('div')

            el2.id             = 'two'
            el2.style.position = 'absolute'
            el2.style.left     = '0'
            el2.style.top      = '100px'
            el2.style.zIndex   = 1
            el2.innerHTML      = 'TEXT TWO'

            var el2Clicked = false

            Ext.get(el2).on('click', function () {
                el2Clicked = true
            })

            var async = t.beginAsync()

            setTimeout(function () {
                document.body.appendChild(el2)

                setTimeout(function () {
                    t.notOk(el2Clicked, "Click not happened yet, even that `el2` is already in DOM")

                    el2.style.zIndex = 10

                    t.endAsync(async)
                }, 500)
            }, 100)

            t.chain(
                { click : '#two' },
                function () {
                    t.ok(el2Clicked, "Click registered")
                }
            )
        })

        t.it('Stress test: should handle moving targets', function (t) {
            var button = new Ext.Button({
                text     : "Click me",
                id       : 'btn10',
                floating : true,
                renderTo : document.body
            })

            var positions = [
                [0,0],
                [500, 0],
                [500,500],
                [0, 500],
                [0,0]
            ];

            t.willFireNTimes(button, 'click', 1);

            t.chain(
                { moveCursorTo : [500, 500] },

                // Move the cursor away so it takes a bit of time to reach the button initially
                function(next){
                    button.setPosition(positions[0][0], positions[0][1]);
                    t.click('#btn10', function() {});

                    next()
                },

                { waitFor : 150 },

                function(next){
                    button.setPosition(positions[1][0], positions[1][1]);

                    next()
                },
                { waitFor : 150 },

                function(next){
                    button.setPosition(positions[2][0], positions[2][1]);

                    next()
                },

                { waitFor : 150 },

                function(next){
                    button.setPosition(positions[3][0], positions[3][1]);

                    next()
                },
                { waitFor : 150 },

                function(next){
                    button.setPosition(positions[4][0], positions[4][1]);

                    t.waitForEvent(button, 'click', next)
                }
            );
        })
    })

    t.describe('should handle temporarily unreachable targets', function (t) {
        var panel, button;

        function scheduleMask(next) {

            var int = setInterval(function () {
                if (t.currentPosition[1] > 10) {
                    panel.mask('oops');

                    setTimeout(function () {
                        panel.unmask();
                    }, 2000);

                    clearInterval(int);
                }
            }, 50);

            next();
        }

        t.beforeEach(function () {
            panel = panel && panel.destroy();

            button = new Ext.Button({
                text      : "Click me",
                id        : 'btn',
                draggable : true
            })

            panel = new Ext.Panel({
                style    : 'margin-top:100px',
                buttons  : [button],
                renderTo : document.body,
                height   : 100,
                width    : 100
            })
        })

        t.it('should handle clicking temp unreachable targets', function (t) {
            t.willFireNTimes(button, 'click', 1);

            t.chain(
                { moveCursorTo : [0, 0] },
                scheduleMask,
                { click : '#btn' }
            );
        })

        t.it('should handle draggin temp unreachable targets', function (t) {

            t.firesAtLeastNTimes(button, 'move', 1);

            t.chain(
                { moveCursorTo : [0, 0] },
                scheduleMask,
                { drag : '#btn', to : [100, 40] }
            );
        })

        t.it('should handle draggin temp unreachable targets', function (t) {

            t.firesAtLeastNTimes(button, 'move', 1);

            t.chain(
                { moveCursorTo : [0, 0] },
                scheduleMask,
                { drag : '#btn', by : [-10, 0] }
            );
        })
    })

});
