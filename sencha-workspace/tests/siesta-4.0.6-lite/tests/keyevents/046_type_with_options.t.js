StartTest(function(t) {

    t.testExtJS(function (t) {

        t.it('Should be possible to press CTRL and SHIFT when typing', function(t) {
            document.body.innerHTML = '<input id="txt" type="text">';

            function doAssert (e, target) {
                t.ok(e.ctrlKey, 'Ctrl key detected');
                t.ok(e.shiftKey, 'Shift key detected');
            }

            Ext.get('txt').on({
                keydown : doAssert,
                keyup   : doAssert
            })

            t.chain(
                {
                    action      : 'type',
                    target      : '#txt',
                    text        : 'a',
                    options     : { shiftKey : true, ctrlKey : true }
                }
            )
        })

        t.it('Should be possible to clear existing value when typing', function(t) {
            document.body.innerHTML = '<input id="txt2" type="text" value="bar"><input id="txt3" type="text" value="bar">';

            t.chain(
                { type : 'foo', target : '#txt2', clearExisting : true },
                { type : '', target : '#txt3', clearExisting : true },

                function() {
                    t.expect(document.getElementById('txt2').value).toBe('foo');
                    t.expect(document.getElementById('txt3').value).toBe('');
                }
            );
        });
    });
});

