StartTest(function (t) {
    document.body.innerHTML = '<div id="one">FOO</div><div id="two">BAR</div>'

    t.expectPass(function (t) {
        var animationDone = false

        Ext.get('one').animate({
            duration : 300,

            to       : {
                backgroundColor : '#f00'
            },
            callback : function () {
                animationDone = true
            }
        });

        t.chain(
            { waitFor : 'animations' },

            function () {
                t.ok(animationDone)
            }
        );
    })

    t.expectFail(function (t) {
        var animationDone = false

        t.waitForTimeout = 100;

        Ext.get('two').animate({
            duration : 300,

            to       : {
                backgroundColor : '#f00'
            },
            callback : function () {
                animationDone = true
            }
        });

        t.chain(
            { waitFor : 'animations' },

            function () {
                t.ok(animationDone)
            }
        );
    })

    t.it('should wait for animations before clicking', function (t) {
        var panel = new Ext.Panel({
            renderTo    : document.body,
            height      : 300,
            width       : 300,
            collapsible : true,
            collapsed   : true,
            buttons     : [{
                text   : "Click me",
                itemId : 'theButton'
            }]
        })

        t.willFireNTimes('>>#theButton', 'click', 2);

        t.chain(
            function (next) {
                panel.expand();
                next();
            },

            { click : ">>#theButton" },

            // Move the cursor away so it takes a bit of time to reach the button again
            { moveMouseTo : [300, 0] },

            function (next) {
                t.click(">>#theButton", next);

                // This moves the target 'in-flight' which should be remedied by a 2nd call to syncCursor before applying the final interaction
                panel.el.setStyle('margin-left', '200px');

                // At this point, test is not yet finalized and willFireNTimes is not yet reported
                // No assertions should be seen from various internal waitForXXX calls
                t.expect(t.getPassCount()).toBe(0);
            }
        );
    })
});
