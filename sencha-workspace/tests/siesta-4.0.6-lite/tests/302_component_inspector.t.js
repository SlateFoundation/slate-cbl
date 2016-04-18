StartTest(function (t) {
    
    // this test is unstable in IE9, with some weird order of 'mousemove' handler calls on <body>
    if (!Ext.isIE9m) t.it('Should detect basic grid components', function (t) {
        var grid = t.getGrid({
            renderTo : document.body,
            columns  : [{ text : 'foo' }],
            margin   : 40
        });

        var inspector = new Siesta.Harness.Browser.UI.ComponentInspector({
            // increase buffer value, to make sure cursor is completed movement before
            // showing the indicator (otherwise there's a race condition because the 1st 
            // component on the cursor's way is "headercontainer" and if it will be processed
            // "elementFromPoint" will return el's of indicator
            bufferTime      : 1500
        });

        t.notOk(inspector.active);

        inspector.start(window);

        t.ok(inspector.active);

        t.chain(
            // required for IE9
            { waitFor : 100 },
            
            { moveCursorTo : '>>gridcolumn' },

            { waitForSelector : 'a.target-inspector-label:contains(gridcolumn)' },

            { moveCursorTo : '>>gridview' },

            { waitForSelector : 'a.target-inspector-label:contains(view)' },

            function () {
                inspector.stop();
                t.notOk(inspector.active);
                t.notOk(inspector.getIndicatorEl());

                grid.destroy();
            }
        )
    })

    t.it('Should detect HTML nodes', function (t) {
        document.body.innerHTML = '<span id="foo" class="foo bar">Some text here</span>';

        var inspector = new Siesta.Harness.Browser.UI.ComponentInspector({
            resolveTarget : function (target) {
                return t.normalizeElement(target);
            }
        });

        t.notOk(inspector.active);

        inspector.start(window);

        t.ok(inspector.active);

        t.chain(
            function (next) {
                inspector.highlightTarget(document.getElementById('foo'), '.foo.bar');
                next()
            },

            { waitForSelector : 'a.target-inspector-label:contains(.foo)' },

            function () {
                inspector.stop();
            }
        )
    });

    //document.body.innerHTML += '<iframe frameborder=0 style="float:left" width=300 height=500 src="http://lh/extjs-4.2.0/examples/tree/locking-treegrid.html"/>'
    //document.body.innerHTML += '<iframe frameborder=0 style="float:left" width=300 height=500 src="http://lh/sencha-touch-2.2.0/examples/forms"/>'
    //document.body.innerHTML += '<iframe frameborder=0 style="float:left" width=300 height=500 src="http://lh/extjs-3.4.0/examples/form/anchoring.html">'
});