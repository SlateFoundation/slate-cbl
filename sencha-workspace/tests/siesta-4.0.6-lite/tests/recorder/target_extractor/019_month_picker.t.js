describe('Month picker recording', function (t) {


    t.it('Should handle month picker', function (t) {
        var recorder = new Siesta.Recorder.ExtJS({
            ignoreSynthetic : false,
            window          : window
        });

        var date = new Ext.form.field.Date({
            renderTo : document.body,
            value    : new Date(2016, 1, 2)
        })

        recorder.start();
        t.chain(
            { click : "datefield[inputType=text] => .x-form-trigger" },

            { click : ">>splitbutton[text=February 2016]" },

            { click : "monthpicker => .x-monthpicker-month:contains(Sep)" },

            function () {
                var steps = recorder.getRecordedActions();

                t.is(steps.length, 3);

                t.is(steps[0].getTarget().target, 'datefield[inputType=text] => .x-form-trigger')
                t.like(steps[1].getTarget().target, 'splitbutton[text=February 2016] => .x-btn-')
                t.is(steps[2].getTarget().target, 'monthpicker => .x-monthpicker-month:textEquals(Sep)')
            }
        );
    })
})