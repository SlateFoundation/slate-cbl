StartTest(function (t) {

    var M = Siesta.Recorder.UI.Model.Action;

    t.it('Basic code generation', function (t) {

        t.is(
            new M({
                action : 'click',
                target : [{ type : 'css', target : 'button', offset : [10, 20] }]
            }).asCode(),

            '{ click : "button", offset : [10, 20] }'
        );

        t.is(
            new M({
                action  : 'click',
                target  : [{ type : 'css', target : 'button' }],
                options : { ctrlKey : true, shiftKey : true, foo : "bar" }
            }).asCode(),
            '{ click : "button", options : { ctrlKey : true, shiftKey : true, foo : "bar" } }'
        );

        t.is(
            new M({ action : 'waitForMs', value : "300" }).asCode(),

            '{ waitForMs : 300 }'
        );

        var fnCode = new M({ action : 'fn', value : "Ext.getBody().setStyle('background-color', 'black');" }).asCode()
        t.like(fnCode.toString(), "Ext.getBody().setStyle('background-color', 'black');");
        t.like(fnCode.toString(), "next();");
    })

    t.it('Grouped t.it statements', function (t) {

        var store = new Siesta.Recorder.UI.Store.Action({
            root : {
                children : [
                    {
                        action   : "group",
                        value    : "Some group",
                        children : [
                            {
                                action : 'click',
                                target : [{ type : 'css', target : 'button', offset : [10, 20] }]
                            },{
                                action : 'click',
                                target : [{ type : 'css', target : 'button'}]
                            }
                        ]
                    },
                    {
                        action   : "group",
                        value    : "Other group",
                        children : [
                            {
                                action : 'contextmenu',
                                target : [{ type : 'css', target : 'div'}]
                            },{
                                action : 'click',
                                target : [{ type : 'css', target : 'div'}]
                            }
                        ]
                    }
                ]
            }
        })

        t.is(store.generateCode('foo'),
            'describe("foo", function(t) {\n' +
            '    t.it("Some group", function(t) {\n' +
            '        t.chain(\n' +
            '            { click : "button", offset : [10, 20] },\n\n' +
            '            { click : "button" }\n' +
            '        );\n' +
            '    });\n\n' +

            '    t.it("Other group", function(t) {\n' +
            '        t.chain(\n' +
            '            { contextmenu : "div" },\n\n' +
            '            { click : "div" }\n' +
            '        );\n' +
            '    });' +
            '\n});'
        );
    })

    t.it('Flat root', function (t) {

        var store = new Siesta.Recorder.UI.Store.Action({
            root : {
                children : [
                    {
                        action : 'click',
                        target : [{ type : 'css', target : 'button', offset : [10, 20] }]
                    },{
                        action : 'click',
                        target : [{ type : 'css', target : 'button'}]
                    }
                ]
            }
        })

        t.is(store.generateCode('foo'),

            'describe("foo", function(t) {\n' +
            '    t.chain(\n' +
            '        { click : "button", offset : [10, 20] },\n\n' +
            '        { click : "button" }\n' +
            '    );' +
            '\n});'
        );
    })

    t.it('Empty list', function (t) {

        var store = new Siesta.Recorder.UI.Store.Action()

        t.is(store.generateCode('foo'),

            'describe("foo", function(t) {\n' +
            '\n});'
        );
    })
})
