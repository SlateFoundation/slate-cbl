StartTest(function (t) {

    var field = new Ext.form.field.File({
        labelAlign    : 'right',
        clearOnSubmit : false,
        labelWidth    : 130,
        labelPad      : 17,
        buttonText    : 'foo',
        renderTo      : document.body
    })

    t.chain(
        { click : '>>fileuploadfield' },
        { click : '>>filebutton[text=foo]' }
    )
});
