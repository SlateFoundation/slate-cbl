describe('Scheduler', function (t) {

    t.expectGlobal('Robo');

    var resourceStore, eventStore, sched, recorder = new Siesta.Recorder.ExtJS({ ignoreSynthetic : false });
    recorder.attach(window);

    var setup = function (next) {
        sched && sched.destroy()

        recorder.stop();
        recorder.clear();
        recorder.start();

        resourceStore       = Ext.create('Sch.data.ResourceStore', {
            data : [
                {Id : 'r1', Name : 'Mike'},
                {Id : 'r2', Name : 'Linda'},
                {Id : 'r3', Name : 'Don'}
            ]
        })
    
        eventStore          = Ext.create('Sch.data.EventStore', {
            data : [
                { Id : 1, ResourceId : 'r1', StartDate : new Date(2011, 0, 1, 10), EndDate : new Date(2011, 0, 1, 12), Name : 'one' },
                { Id : 2, ResourceId : 'r2', StartDate : new Date(2011, 0, 1, 12), EndDate : new Date(2011, 0, 1, 13), Name : 'two' },
                { Id : 3, ResourceId : 'r3', StartDate : new Date(2011, 0, 1, 14), EndDate : new Date(2011, 0, 1, 16), Name : 'three' },
                { Id : 4, ResourceId : 'r1', StartDate : new Date(2011, 0, 1, 16), EndDate : new Date(2011, 0, 1, 18), Name : 'four' }
            ]
        });
    
        sched               = Ext.create("Sch.panel.SchedulerGrid", {
            id         : 'sched',
            height     : 300,
            width      : 600,
            rowHeight  : 35,
            renderTo   : Ext.getBody(),
            viewPreset : 'hourAndDay',
            startDate  : new Date(2011, 0, 1, 6),
            endDate    : new Date(2011, 0, 1, 20),
    
            // Setup static columns
            columns    : [
                { dataIndex : 'Name' }
            ],
    
            resourceStore : resourceStore,
            eventStore    : eventStore
        });
        
        t.waitForRowsVisible(sched, next)
    }

    t.it('resizing', function (t) {

        t.chain(
            setup,
            
            { moveMouseTo : '.sch-event:contains(one)' },

            { drag : '.sch-event:contains(one) .sch-resizable-handle-start', by : [ 10, 0 ] },

            function () {
                var actions = recorder.getRecordedActions();

                t.is(actions.length, 1);

                t.is(actions[0].action, 'drag')
                t.is(actions[0].getTarget().target, '#sched-timelineview => #sched-4-1-x .sch-resizable-handle-start')
                t.isDeeply(actions[0].by, [ 10, 0 ])
            }
        )
    })

    t.it('dragging', function (t) {
        t.chain(
            setup,

            { drag : '.sch-event:contains(one)', by : [50, 0] },

            function () {
                var actions = recorder.getRecordedActions();

                t.is(actions.length, 1);

                t.is(actions[0].action, 'drag')
                t.is(actions[0].getTarget().target, '#sched-timelineview => #sched-38-35-x .sch-event-inner')
                t.isDeeply(actions[0].by, [50, 0])
            }
        )
    })

    // This should produce a drag caused by the mouseup and mousedown event.
    // No click will be fired since row is redrawn on mouseup
    t.it('creating', function (t) {
        t.chain(
            setup,

            { drag : '.sch-timelineview .x-grid-cell', offset : [20, 20], by : [50, 0] },

            function () {
                var actions = recorder.getRecordedActions();

                t.is(actions.length, 1);

                t.is(actions[0].action, 'drag')
                t.is(actions[0].getTarget().target, '#sched-timelineview => table.x-grid-item:nth-child(1) .sch-timetd')
                t.isDeeply(actions[0].by, [50, 0])
            }
        )
    })
})