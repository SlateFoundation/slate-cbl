// also supports: startTest(function(t) {
StartTest(function(t) {
    t.diag("Sanity");

    t.ok(Ext, 'ExtJS is here');
    t.ok(Ext.Window, '.. indeed');


    t.ok(AggregridExample.Application, 'AggregridExample is here');
    t.ok(AggregridExample.Application, '.. indeed');

    t.done();   // Optional, marks the correct exit point from the test
})