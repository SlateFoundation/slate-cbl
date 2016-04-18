StartTest(function (t) {

    t.it('Tab panel', function (t) {
        var recorder = new Siesta.Recorder.ExtJS({ ignoreSynthetic : false });
        recorder.attach(window);
        recorder.start();

        Ext.create('Ext.TabPanel', {
            width  : 350,
            height : 100,

            renderTo : Ext.getBody(),
            items    : [
                {
                    title : 'foooooooooooo'
                },
                {
                    title   : 'barbarbarbar',
                    iconCls : 'somecls'
                },
                {
                    iconCls : 'onlyIconCls'
                },
                {
                    title    : 'foo',
                    closable : true
                }
            ]
        });

        t.chain(
            { click : '>>tab[text=foooooooooooo]' },
            { click : '>>tab[iconCls=somecls]' },
            { click : '>>tab[iconCls=onlyIconCls]' },
            { click : "tab[text=foo] => .x-tab-close-btn" },

            function () {
                recorder.stop();

                var steps = recorder.getRecordedActions();

                t.is(steps.length, 4);

                t.is(steps[0].getTarget().target, 'tab[text=foooooooooooo]')
                t.is(steps[0].getTarget().type, 'cq')
                t.is(steps[1].getTarget().target, 'tab[text=barbarbarbar]')
                t.is(steps[1].getTarget().type, 'cq')
                t.is(steps[2].getTarget().target, 'tab[iconCls=onlyIconCls] => .onlyIconCls')
                t.is(steps[2].getTarget().type, 'csq')

                t.is(steps[3].getTarget().target, 'tab[text=foo] => .x-tab-close-btn')
                t.is(steps[3].getTarget().type, 'csq')
            }
        )
    })
})