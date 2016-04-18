describe('Event view target column', function (t) {

    t.it('Unit test', function (t) {

        var col = new Siesta.Recorder.UI.TargetColumn();

        t.it('Click action renderer', function (t) {
            var action = new Siesta.Recorder.UI.Model.Action({
                action : 'click',
                target : [{ type : 'css', target : '#div' }]
            });

            t.is(col.renderer('#div', {}, action), '#div');
        })

        t.it('Drag by action renderer', function (t) {
            var action = new Siesta.Recorder.UI.Model.Action({
                action : 'drag',
                target : [{ type : 'css', target : '#div' }],
                by     : [20, "10%"]
            });

            t.is(col.renderer('#div', {}, action), '#div by: [20,10%]');
        })

        t.it('Drag by action renderer', function (t) {
            var action = new Siesta.Recorder.UI.Model.Action({
                action   : 'drag',
                target   : [{ type : 'css', target : '#div' }],
                toTarget : [{ type : 'css', target : 'foo' }]
            });

            t.is(col.renderer('#div', {}, action), '#div to: foo');
        });

        t.it('Click CQ target', function (t) {

            var action = new Siesta.Recorder.UI.Model.Action({
                action : 'click',
                target : [{ type : 'cq', target : '#some_component' }]
            });

            t.is(col.renderer('#div', {}, action), '>>#some_component');
        })

        t.it('getTargetEditor', function (t) {
            var Ed = Siesta.Recorder.UI.Editor;

            var actionsAndEditors = {
                drag            : Ed.DragTarget,
                fn              : Ed.Code,
                moveCursorTo    : Ed.Target,
                moveCursorBy    : Ext.form.TextField,
                waitForFn       : Ed.Code,
                waitForMs       : Ext.form.NumberField,
                waitForSelector : Ext.form.TextField,
                screenshot      : Ext.form.TextField,
            };

            for (var o in actionsAndEditors) {
                var action = new Siesta.Recorder.UI.Model.Action({ action : o });
                t.is(Ext.ClassManager.getName(col.getTargetEditor(action)), Ext.ClassManager.getName(actionsAndEditors[o]), o)
            }

            var action = new Siesta.Recorder.UI.Model.Action({ action : 'waitForAnimations' });
            t.notOk(col.getTargetEditor(action), 'waitForAnimations')
        })

    })
})