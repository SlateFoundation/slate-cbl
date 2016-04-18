StartTest(function (topTest) {

    topTest.it('Should support alert() call', function (t) {

        alert('bar');

        t.pass('alert should not freeze browser');

        // Should be able to verify message
        t.expectAlertMessage('foo');

        alert('foo');
        
        alert('baz');
        
        t.pass('alert should not freeze browser');
    });


    topTest.testBrowser(
        {
            doNotTranslate  : true,
            defaultTimeout  : 1000
        },
        function (t) {
            t.it('Sub test 1 - Sets the `expectAlertMessage` but does not call `alert`', function (t) {
                t.expectAlertMessage('foo');
            })

            alert('baz');
        },
        function(t) {

            topTest.expect(t.isPassed()).toBe(false);
            topTest.expect(t.getFailCount()).toBe(1);
        }
    );


    topTest.it('Should support confirm() call', function (t) {

        t.setNextConfirmReturnValue(false);

        t.expect(confirm('foo')).toBe(false);

        // Should revert back to default return value, which is true
        t.expect(confirm('bar')).toBe(true);

        t.setNextConfirmReturnValue(true);

        t.expect(confirm('baz')).toBe(true);
    });


    topTest.it('Should support prompt() call', function (t) {

        // Should not freeze
        prompt('foo');

        t.setNextPromptReturnValue('foobar');

        t.expect(prompt('foo')).toBe('foobar');

        t.setNextPromptReturnValue('bazfoo');

        t.expect(prompt('foo')).toBe('bazfoo');
    });
});