StartTest(function (t) {
    var text = Ext.create('Ext.field.Text', {
        renderTo : document.body
    });

    // https://www.assembla.com/spaces/bryntum/tickets/2491-typing-into-textfield-in-ie11+-doesn--39-t-set-value-properly/details#
    t.chain(
        { type : 'f', target : text },
        function () {
            t.is(text.getValue(), 'f');
        }
    );
})