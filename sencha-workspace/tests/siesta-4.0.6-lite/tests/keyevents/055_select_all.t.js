describe('Should select text on dbl click and Ctrl-A, Cmd-A (Mac)', function (t) {

    t.it('double click', function (t) {
        var tf = new Ext.form.field.Text({
            renderTo   : Ext.getBody(),
            name       : 'name',
            fieldLabel : 'Name',
            value      : 'hello'
        });

        t.chain(
            { dblclick : tf },
            function (next) {
                t.expect(t.getSelectedText(tf)).toBe("hello");

                next();
            },
            { waitFor : 500 },
            { click : tf },
            function (next) {
                t.expect(t.getSelectedText(tf)).toBe("");

                next();
            }
        );
    });

    t.it('CTRL-A click', function (t) {
        var tf = new Ext.form.field.Text({
            renderTo   : Ext.getBody(),
            name       : 'name',
            fieldLabel : 'Name',
            value      : 'hello'
        });

        var isMac = navigator.platform.indexOf('Mac') > -1;
        var options = isMac ? { metaKey : true } : { ctrlKey : true };

        t.chain(
            { click : tf },
            { type : 'A', options : options },
            function (next) {
                t.expect(t.getSelectedText(tf)).toBe("hello");
                t.expect(tf.getValue()).toBe("hello");

                //next();
            }
            //,
            //
            //{ type : 'Abra', target : tf },
            //
            //function () {
            //    t.expect(tf.getValue()).toBe("Abra")
            //}
        )
    });
});