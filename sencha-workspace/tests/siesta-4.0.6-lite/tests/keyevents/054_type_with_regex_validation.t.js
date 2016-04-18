StartTest(function (t) {

    var tf = new Ext.form.field.Text({
        renderTo   : Ext.getBody(),
        name       : 'name',
        fieldLabel : 'Name',
        maskRe     : /[\d\-]/,
        regex      : /^\d{3}-\d{3}-\d{4}$/,
        regexText  : 'Must be in the format xxx-xxx-xxxx'
    });

    t.chain(
        { type : 'Abracadabra123-456-7890', target : tf},

        function() {
            t.expect(tf.getValue()).toBe("123-456-7890")
        }
    )
});