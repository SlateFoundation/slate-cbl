StartTest(function(t) {

    t.chain(
        { click : 'treefilter => .fa-close' },

        { waitForEvent : [t.global.harness, 'testsuiteend'], trigger : { dblclick : '.x-grid-item:contains(basic_assertions)' } },

        { screenshot : 'build/doc-images/images/welcome.png'}
    )
})