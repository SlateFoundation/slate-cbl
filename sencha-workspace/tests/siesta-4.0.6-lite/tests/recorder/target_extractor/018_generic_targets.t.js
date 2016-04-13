describe('Should fallback to a sensible CQ if components are generic and not uniquely identifiable', function (t) {

    var recorder;

    t.beforeEach(function () {
        Ext.Array.forEach(Ext.ComponentQuery.query('*'), function (c) {
            c.destroy();
        });

        recorder = new Siesta.Recorder.ExtJS({ ignoreSynthetic : false });
        recorder.attach(window);
        recorder.start();
    })

    t.afterEach(function () {
        recorder.stop();
    })

    t.it('Should pick currently expanded combobox if multiple visible targets exist', function (t) {

        var cmb1 = new Ext.form.ComboBox({
            renderTo : document.body,
            itemId   : 'one',
            store    : ['Foo', 'Bar']
        });

        var cmb2 = new Ext.form.ComboBox({
            renderTo : document.body,
            foo      : 'two',
            store    : ['Foo', 'Bar']
        });

        t.chain(
            { click : "#one => .x-form-trigger" },

            { click : "#one.getPicker() => .x-boundlist-item:contains(Foo)" },

            { click : '#' + cmb2.id + ' ' + " .x-form-trigger" },

            { click : "[foo=two].getPicker() => .x-boundlist-item:contains(Foo)" },

            function () {
                var steps = recorder.getRecordedActions();

                t.is(steps.length, 4);

                t.is(steps[0].getTarget().target, '#one => .x-form-trigger')
                t.is(steps[1].getTarget().target, '#one.getPicker() => .x-boundlist-item:contains(Foo)')
                t.is(steps[2].getTarget().target, 'combobox(true):root(2) => .x-form-trigger')
                t.is(steps[3].getTarget().target, 'boundlist(true):root(2) => .x-boundlist-item:contains(Foo)')
            }
        );
    })

    t.it('Should handle multiple nesting', function (t) {

        var ct = new Ext.Container({
            renderTo : document.body,
            height   : 200,
            width    : 200,
            layout   : 'hbox',
            items    : [
                {
                    xtype  : 'panel',
                    height : 200,
                    flex   : 1,
                    tbar   : [
                        { xtype : 'textfield' }
                    ]
                },
                {
                    xtype  : 'panel',
                    height : 200,
                    flex   : 1,
                    tbar   : [
                        { xtype : 'textfield' }
                    ]
                }
            ]
        })

        var ct2 = new Ext.Container({
            renderTo : document.body,
            nbr      : 'two',
            height   : 200,
            width    : 400,
            layout   : 'hbox',
            items    : [
                {
                    xtype  : 'panel',
                    height : 100,
                    flex   : 1,
                    tbar   : [
                        { xtype : 'textfield' }
                    ]
                },
                {
                    xtype  : 'panel',
                    height : 100,
                    flex   : 1,
                    tbar   : [
                        { xtype : 'textfield' }
                    ]
                },
                {
                    xtype  : 'panel',
                    height : 100,
                    flex   : 1,
                    tbar   : [
                        { xtype : 'textfield' }
                    ]
                }
            ]
        })

        t.chain(
            { click : ">>[nbr=two] panel:nth-child(1) textfield" },
            { click : ">>[nbr=two] panel:nth-child(2) textfield" },
            { click : ">>[nbr=two] panel:nth-child(3) textfield" },

            function () {
                var steps = recorder.getRecordedActions();

                t.is(steps.length, 3);

                t.is(steps[0].getTarget().target, 'container(true):root(2) panel:nth-child(1) toolbar textfield:nth-child(1) => .x-form-text')
                t.is(steps[1].getTarget().target, 'container(true):root(2) panel:nth-child(2) toolbar textfield:nth-child(1) => .x-form-text')
                t.is(steps[2].getTarget().target, 'container(true):root(2) panel:nth-child(3) toolbar textfield:nth-child(1) => .x-form-text')
            }
        );
    })
})