StartTest(function (t) {

    t.autoCheckGlobals = false;

    t.testExtJS(function (t) {

        var textField = new Ext.form.field.Text({
            renderTo : document.body
        });

        var checkbox = new Ext.form.field.Checkbox({
            renderTo : document.body
        });

        var combo = new Ext.form.field.ComboBox({
            renderTo : document.body,
            store    : ['Foo', 'Bar']
        });

        t.chain(
            { setValue : 'foo', target : textField },
            { setValue : true, target : checkbox },
            { setValue : 'Bar', target : combo },

            function (next) {
                t.is(textField.getValue(), 'foo');
                t.is(checkbox.getValue(), true);
                t.is(combo.getValue(), 'Bar');

                next();
            },

            { setValue : '', target : textField },
            { setValue : false, target : checkbox },
            { setValue : 'Foo', target : combo },

            function (next) {
                t.is(textField.getValue(), '');
                t.is(checkbox.getValue(), false);
                t.is(combo.getValue(), 'Foo');
            }
        )
    });
});
