StartTest(function (t) {
    document.body.innerHTML = '<span id="a">foo</span><span id="b">foobar</span>'

    t.it('Should support querying by exact text content match', function (t) {

        t.expect(t.$(':textEquals(foo)').length).toBe(1);
        t.expect(t.$(':textEquals(fo)').length).toBe(0);
        t.expect(t.$(':textEquals(bar)').length).toBe(0);
    });
});
