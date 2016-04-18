StartTest(function (t) {

    t.it('body', function (t) {
        t.chain(
            { click : [1, 1] },

            function (next) {
                t.is(t.activeElement(), document.body)

                next();
            }
        );
    })

    t.it('input', function (t) {

        t.chain(

            function (next) {
                document.body.innerHTML = '<input id="inp" type="text" />'
                next();
            },

            { click : '#inp' },

            function (next) {
                t.is(t.activeElement(), document.getElementById('inp'))

                next();
            }
        );
    });

    t.it('input', function (t) {
        
        var iframe

        t.chain(
            function (next) {
                document.body.innerHTML = '<iframe id="ifr" width=200 height="200" src="blank.html"/>'
                
                iframe  = document.getElementById('ifr')
                
                next();
            },

            // should be proper waiting for "onload" event of the iframe DOM element, but this will also work
            // `LOADED' global is set in the `onload` of "blank.html"
            { waitFor : function () { return iframe.contentWindow && iframe.contentWindow.LOADED } },

            { click : 'iframe' },

            function (next) {
                t.is(t.activeElement(), iframe.contentWindow.document.body)
            }
        )
    });
});
