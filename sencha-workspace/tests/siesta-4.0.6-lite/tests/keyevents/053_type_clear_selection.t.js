StartTest(function (t) {

    var field

    t.beforeEach(function () {
        field && field.destroy();

        field = new Ext.form.TextField({
            renderTo : document.body,
            value    : 'foo'
        });

        field.selectText()
    })

    t.it('Should clear selected text in input on DELETE', function (t) {

        t.chain(
            { type : '[DELETE]', target : field },

            function (next) {
                t.is(field.inputEl.dom.value, "")
                t.is(field.getValue(), "")
            }
        )
    });

    t.it('Should clear selected text in input on BACKSPACE', function (t) {

        t.chain(
            { type : '[BACKSPACE]', target : field },

            function (next) {
                t.is(field.inputEl.dom.value, "")
                t.is(field.getValue(), "")
            }
        )
    });
});

