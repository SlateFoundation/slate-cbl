/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Recorder.UI.Editor.Code', {
    extend      : 'Ext.ux.form.field.CodeMirror',
    xtype       : 'codeeditor',
    height      : 100,
    cls         : 'siesta-recorder-codeeditor',

    listeners : {
        afterrender : function () {
            this.editor.focus();
        },
        delay       : 50
    },

//    isValid : function() {
//        var syntaxOk = true;
//        var val = this.getValue();
//
//        return syntaxOk && this.callParent(arguments);
//    },

    
    applyChanges : function (actionRecord) {
        actionRecord.set('value', this.getValue())
    },
    
    
    getEditorValue : function (record) {
        return record.get('value')
    },    
    

    getErrors: function () {
        var value = this.getValue();

        if (value) {
            try {
                new Function(value)
            } catch (e) {
                return [ Siesta.Resource('Siesta.Recorder.UI.Editor.Code', 'invalidSyntax') ];
            }
        }

        return this.callParent(arguments);
    }
})