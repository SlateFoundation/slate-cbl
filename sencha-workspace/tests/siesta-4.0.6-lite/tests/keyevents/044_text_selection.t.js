StartTest(function (t) {
    t.it('should clear all the text if selected', function (t) {
        document.body.innerHTML = '<input id="foo" type="text" value="Default" />';
        var field               = document.getElementById('foo');

        t.chain(
            function (next) {
                t.selectText(field);
                t.type(field, 'Replacement', next);
            },
            function () {
                t.is(field.value, 'Replacement', 'Selecting text and typing replaces original value.');
            }
        );
    })

    t.xit('should delete partially selected text', function (t) {
        document.body.innerHTML = '<input id="foo" type="text" value="123456123" />';
        var field               = document.getElementById('foo');

        t.chain(
            function (next) {
                t.selectText(field, 6);
                t.type(field, '[BACKSPACE]', next);
            },
            function () {
                t.is(field.value, '123456');
            }
        );
    });
});