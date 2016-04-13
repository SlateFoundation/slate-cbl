describe('Recorder monkey tests', function (t) {

    Ext.ComponentQuery.query('*').forEach(function(c){c.destroy()})

    var text1 = new Ext.form.TextField({
        renderTo : document.body
    })

    var text2 = new Ext.form.TextField({
        renderTo : document.body
    })

    var text3 = new Ext.form.TextField({
        renderTo : document.body
    })

    //var panel = new Ext.Panel({
    //    renderTo : document.body
    //})

    t.is(t.cq1('textfield:root(1)'), text1);
    t.is(t.cq1('textfield:root(2)'), text2);
    t.is(t.cq1('textfield:root(3)'), text3);
    t.isDeeply(t.cq('textfield:root'), [text1, text2 ,text3]);

    t.isDeeply(t.cq('textfield:root(123)'), []);
})