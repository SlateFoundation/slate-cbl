StartTest(function (t) {

    t.expectGlobals("0", "frame");

    t.it('Should detect HTML nodes', function (t) {
        document.body.innerHTML = '<iframe id="frame" src="html-pages/basic1.html" width="200" height="200"/>';

        var inspector = new Siesta.Harness.Browser.UI.ComponentInspector({
            resolveTarget : function (target) {
                return t.normalizeElement(target);
            }
        });

        t.notOk(inspector.active);

        t.chain(
            { waitForTarget : '#frame -> .foo' },

            function (next) {
                var win = $('#frame')[0].contentWindow;

                inspector.start($('#frame')[0].contentWindow, document.body);
                inspector.highlightTarget(win.document.body.querySelector('.foo'), '.foo');

                next()
            },

            { waitForSelector : 'a.target-inspector-label:contains(.foo)' },

            function () {
                inspector.stop();
            }
        )
    });
});