Ext.define('Slate.cbl.data.field.Attachments', {
    extend: 'Ext.data.field.Field',
    alias: 'data.field.slate-cbl-attachments',


    isEqual: function(value1, value2) {
        var length, i = 0;

        if (value1 === value2) {
            return true;
        }

        if (!value1 && !value2) {
            return true;
        }

        if (!value1 || !value2) {
            return false;
        }

        length = value1.length;
        if (length !== value2.length) {
            return false;
        }

        for (; i < length; i++) {
            if (!Ext.Object.equals(value1[i], value2[i])) {
                return false;
            }
        }

        return true;
    }
});