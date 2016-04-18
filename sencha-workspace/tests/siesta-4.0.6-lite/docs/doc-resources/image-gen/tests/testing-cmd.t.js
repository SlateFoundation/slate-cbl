StartTest(function (t) {

    var siestaRoot = window.top.location.href.substring(0, window.top.location.href.toLowerCase().indexOf('siesta') + 7);
    var guidesRoot = siestaRoot + 'resources/docs/guides';

    t.afterEach(function() {
        t.clearHighlight();
    })

    t.it('resources/docs/guides/testing_cmd_application/images/greentests.png', function (t) {

        t.chain(
            { setUrl : guidesRoot + '/testing_cmd_application/tests' },

            { waitForEvent : function() { return [t.global.harness, 'testsuiteend'] }, trigger : { dblclick : '.x-grid-cell:contains(unit1.t.js)' } },

            { screenshot : 'build/doc-images/guides/testing_cmd_application/images/greentests.png' }
        )
    })
})