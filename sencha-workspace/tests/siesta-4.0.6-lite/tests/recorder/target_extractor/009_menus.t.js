StartTest(function (t) {

    t.it('Menu test', function (t) {
        var recorder = new Siesta.Recorder.ExtJS({ ignoreSynthetic : false });
        recorder.attach(window);
        recorder.start();

        new Ext.SplitButton({
            renderTo : document.body,
            text : 'Button with menu',
            width : 130,
            menu : {
                items : [
                    {
                        text    : 'Foo',
                        handler : function () {
                        }
                    },
                    {
                        text    : 'Bar',
                        handler : function () {},
                        menu    : {
                            items : [
                                { text : 'Bacon' }
                            ]
                        }
                    }
                ]
            }
        });

        //one more button with the same menu items, so that extractor will generate queries including the menu component itself
        new Ext.SplitButton({
            renderTo : document.body,
            text : 'Button with another menu',
            width : 130,
            menu : {
                items : [
                    {
                        text    : 'Foo',
                        handler : function () {
                        }
                    },
                    {
                        text    : 'Bar',
                        handler : function () {},
                        menu    : {
                            items : [
                                { text : 'Bacon' }
                            ]
                        }
                    }
                ]
            }
        });
        
        var recorder;

        t.chain(
            { click : 'splitbutton[text=Button with menu] => .x-btn-split', offset : [115, 5] },
            { moveCursorTo : 'menu{isVisible()} menuitem[text=Bar] => .x-menu-item-text', offset : [10, 10] },
            { click : 'menu{isVisible()} menuitem[text=Bacon] => .x-menu-item-text', offset : [10, 10] },

            function () {
                var steps = recorder.getRecordedActionsAsSteps();

                recorder.stop();

                t.is(steps.length, 5)

                // Checkboxes are implemented with different markup in Triton theme
                if (Ext.theme && Ext.theme.name.toLowerCase() === 'triton'){
                    t.isDeeply(steps[ 0 ], { action : "click", target : ">>splitbutton[text=Button with menu]", offset : t.any() })
                } else {
                    t.isDeeply(steps[ 0 ], { action : "click", target : "splitbutton[text=Button with menu] => .x-btn-split", offset : [115, 5] })
                }
                t.isDeeply(steps[ 1 ], { action : "moveCursorTo", target : '>>menuitem[text=Foo]' })
                t.isDeeply(steps[ 2 ], { action : "moveCursorTo", target : '>>menuitem[text=Bar]' })
                t.isDeeply(steps[ 3 ], { action : "moveCursorTo", target : '>>menuitem[text=Bacon]' })
                t.isDeeply(steps[ 4 ], { action : "click", target : "menuitem[text=Bacon] => .x-menu-item-text", offset : [10, 10] })
            }
        )
    })
})