StartTest(function (t) {
    var recorderPanel;

    t.beforeEach(function () {
        recorderPanel && recorderPanel.destroy();

        recorderPanel = new Siesta.Recorder.UI.RecorderPanel({
            itemId   : 'rec1',
            width    : 400,
            height   : 300,
            renderTo : document.body,

            domContainer : {
                highlightTarget : function () {
                },
                startInspection : function () {
                },
                clearHighlight  : function () {
                }
            },
            harness      : {
                launch : function () {
                },

                startSingle : function () {
                },

                getScriptDescriptor : function () {
                    return {};
                },

                getDescriptorConfig : function () {
                    return {};
                },

                getTestByURL : function() {
                    return t;
                },

                on : function () {
                }
            }
        });

        recorderPanel.attachTo(t);
    })

    t.describe('Should be able add/remove rows from the grid', function (t) {

        t.it('Should be possible to clear row offset and delete a row', function (t) {
            recorderPanel.store.getRootNode().appendChild({
                action : 'click',
                target : [
                    {
                        type   : 'css',
                        target : "body",
                        offset : [5, 5]
                    }
                ]
            })

            t.chain(
                { click : 'recorderpanel => .siesta-recorderpanel-clearoffset' },

                function (next) {
                    t.notOk(recorderPanel.store.first().getTargetOffset(), 'Offset cleared')
                    next();
                },

                { click : 'recorderpanel => .icon-delete-row' },

                function (next) {
                    t.is(recorderPanel.store.getCount(), 0, 'Deleted a row')
                    next();
                }
            );
        })

        t.it('Should be possible to add a row at the selected index, or last', function (t) {
            t.chain(
                { click : '>>#rec1 [action=recorder-add-step]' },

                function (next) {
                    recorderPanel.store.getRootNode().insertChild(0, {
                        action : 'type',
                        value  : 'foo'
                    });
                    recorderPanel.store.getRootNode().lastChild.set('action', 'type');
                    t.is(recorderPanel.store.getCount(), 2, 'Added two rows')

                    recorderPanel.getSelectionModel().select(0);
                    next();
                },
                { click : '>>#rec1 [action=recorder-add-step]' },

                function (next) {
                    t.is(recorderPanel.store.getRootNode().childNodes[1].get('action'), 'click', 'Added new row after selected row')

                    next();
                },

                { click : '>>#rec1 [action=recorder-remove-all]' },

                { click : '>>messagebox button[text=Yes]' },

                function (next) {
                    t.is(recorderPanel.store.getCount(), 0, 'Cleared store')
                }
            );
        })
    })

    t.it('Should update mousedown action in the UI to "drag"', function (t) {

        recorderPanel.recorder.ignoreSynthetic = false;
        recorderPanel.recorder.start();

        t.chain(
            { drag : [1, 1], to : [5, 5] },

            { waitForSelector : '.siesta-recorderpanel-typecolumn:contains(drag)' },

            function (next) {
                recorderPanel.recorder.stop();
            }
        );
    })

    t.it('Should be able start/stop/play', function (t) {
        recorderPanel.recorder.ignoreSynthetic = false;

        t.willFireNTimes(recorderPanel, 'startrecord', 1);
        t.willFireNTimes(recorderPanel, 'stoprecord', 1);

        t.notOk(recorderPanel.recorder.active, 'Recorder inactive at first')

        t.chain(
            { click : '>>#rec1 [action=recorder-start]' },

            function (next) {
                t.ok(recorderPanel.recorder.active, 'Recorder active')
                next();
            },

            { click : '#rec1 => .x-tree-view', offset : ['50%', '90%'] },

            function (next) {
                t.is(recorderPanel.store.first().data.action, 'click');

                t.isDeeply(recorderPanel.store.first().getTarget(), {
                    type   : 'csq',
                    target : '#rec1 => .x-tree-view',
                    offset : t.any(Array)
                })

                next()
            },

            { click : '>>#rec1 [action=recorder-stop]' },

            function (next) {
                t.notOk(recorderPanel.recorder.active, 'Recorder stopped');
                t.isCalled('startSingle', recorderPanel.harness);
                next()
            },

            { click : '>>#rec1 [action=recorder-play]' }
        );

    })
})