// also supports: startTest(function(t) {
StartTest(function(t) {
    t.diag("Sanity");

    t.ok(Ext, 'ExtJS is here');

    t.ok(AggregridExample.Application, 'AggregridExample is here');

    t.ok(AggregridExample.view.MyAggregrid, 'AggregridExample view is here');

    // AggregridExample.view.MyAggregrid

    t.done();   // Optional, marks the correct exit point from the test
})