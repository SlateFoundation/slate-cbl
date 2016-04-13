describe('moveCursorTo, moveCursorBy', function (t) {

    var recorderPanel;

    t.beforeEach(function() {
        recorderPanel && recorderPanel.destroy();
        recorderPanel = new Siesta.Recorder.UI.RecorderPanel({
            width    : 600,
            height   : 200,
            renderTo : document.body,

            domContainer : {
                highlightTarget : function() {},
                startInspection : function() {},
                clearHighlight  : function() {}
            }
        });
    })

    t.it('moveCursorBy step should work', function (t) {

        recorderPanel.attachTo(t);

        recorderPanel.store.getRootNode().appendChild(
            { action : 'moveCursorBy' }
        );

        t.chain(
            { waitForRowsVisible : recorderPanel },

            function() {
                recorderPanel.editing.startEdit(0, 2);

                t.isInstanceOf(recorderPanel.editing.getActiveEditor().field, Ext.form.field.Text, 'Text field found');

                recorderPanel.editing.getActiveEditor().field.setValue('40,40');
                recorderPanel.editing.completeEdit();

                t.matchGridCellContent(recorderPanel, 0, 2, '40,40', 'should update grid content')

                var rec = recorderPanel.store.getRootNode().firstChild;
                t.isStrict(rec.data.value, '40,40', 'should convert text to array');

                var step = recorderPanel.store.getRootNode().firstChild.asStep();
                t.isDeeplyStrict(step, { action : 'moveCursor', by : [ 40, 40 ] }, 'should generate proper step');
            }
        )
    })

    t.it('moveCursorTo step should work', function (t) {
        recorderPanel.attachTo(t);

        recorderPanel.store.getRootNode().appendChild(
            { action : 'moveCursorTo' }
        );

        t.chain(
            { waitForRowsVisible : recorderPanel },

            function() {
                recorderPanel.editing.startEdit(0, 2);

                t.isInstanceOf(recorderPanel.editing.getActiveEditor().field, Siesta.Recorder.UI.Editor.Target, 'Target field found');

                recorderPanel.editing.getActiveEditor().field.setValue('40,40');
                recorderPanel.editing.completeEdit();

                t.matchGridCellContent(recorderPanel, 0, 2, '40,40', 'should update grid content')

                var rec = recorderPanel.store.getRootNode().firstChild;
                t.notOk(rec.data.value, 'should not have a value');

                var step = recorderPanel.store.getRootNode().firstChild.asStep();
                t.isDeeplyStrict(step, { action : 'moveCursorTo', target : [40, 40] }, 'should generate proper step');
            }
        );
    })
})