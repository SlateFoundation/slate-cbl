/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Recorder.UI.Editor.Array', {
    extend          : 'Ext.form.field.Text',
    alias           : 'widget.arrayeditor',

    getValue : function () {

        var value = this.callParent(arguments);

        if (typeof value === 'string' && value.match(/\d*,\d*/)) {
            value = value.split(',');
            value[0] = parseInt(value[0], 10);
            value[1] = parseInt(value[1], 10);
        }

        return value;
    }
});
