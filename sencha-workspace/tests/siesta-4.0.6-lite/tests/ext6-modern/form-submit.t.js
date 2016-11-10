StartTest(function (t) {
    var form = Ext.create('Ext.form.Panel', {
        renderTo   : document.body,
        items      : [
            {
                xtype : 'searchfield',
                name  : 'name',
                label : 'Name'
            },
            {
                xtype : 'emailfield',
                name  : 'email',
                label : 'Email'
            },
            {
                xtype : 'passwordfield',
                name  : 'password',
                label : 'Password'
            }
        ]
    });

    var form = t.$('form')[0];

    form.submit = function() { };

    t.isntCalled("submit", form, 'Expect a form NOT to be posted on ENTER press if event is prevented');

    t.chain(
        {
            type    : '[ENTER]',
            target  : '>>searchfield'
        }
    );
})