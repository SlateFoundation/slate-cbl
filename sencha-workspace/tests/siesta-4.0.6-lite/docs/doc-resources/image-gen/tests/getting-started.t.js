StartTest(function (t) {

    var siestaRoot = window.top.location.href.substring(0, window.top.location.href.toLowerCase().indexOf('siesta') + 7);
    var guidesRoot = siestaRoot + 'resources/docs/guides';

    t.afterEach(function() {
        t.clearHighlight();
    })

    t.it('resources/docs/guides/siesta_getting_started/images/demo.png', function (t) {
        t.chain(
            { waitFor : 'waitForViewRendered', args : '>>testgrid gridview' },
            
            { click : 'treefilter => .fa-close' },

            { waitForEvent : [t.global.harness, 'testfinalize'], trigger : { dblclick : '.x-grid-item:contains(basic_form)' } },

            { screenshot : 'build/doc-images/guides/siesta_getting_started/images/demo.png' }
        )
    })

    t.it('resources/docs/guides/siesta_getting_started/images/synopsys.png', function (t) {
        t.chain(
            { setUrl : guidesRoot + '/siesta_getting_started/tests' },

            { click : 'treefilter => .fa-close' },

            { waitForEvent : function() { return [t.global.harness, 'testsuiteend'] }, trigger : { click : '>>[actionName=run-all]' } },

            { screenshot : 'build/doc-images/guides/siesta_getting_started/images/synopsys.png' }
        )
    })

    t.it('resources/docs/guides/siesta_getting_started/images/ui-context-menu.png', function (t) {

        t.chain(
            { setUrl : guidesRoot + '/siesta_getting_started/tests' },

            { rightclick : 'testgrid => .x-grid-item', offset : [10, 10] },

            { spotlight : '>>testgridcontextmenu'},

            { screenshot : 'build/doc-images/guides/siesta_getting_started/images/ui-context-menu.png' }
        )
    })

    t.it('resources/docs/guides/siesta_getting_started/images/ui-options-button.png', function (t) {

        t.chain(
            { setUrl : guidesRoot + '/siesta_getting_started/tests' },

            { click : '>>testgrid [action=options]' },

            { spotlight : '>>#tool-menu'},

            { screenshot : 'build/doc-images/guides/siesta_getting_started/images/ui-options-button.png' }
        )
    })
})