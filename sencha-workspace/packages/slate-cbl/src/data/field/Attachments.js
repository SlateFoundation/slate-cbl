Ext.define('Slate.cbl.data.field.Attachments', {
    extend: 'Ext.data.field.Field',
    alias: 'data.field.slate-cbl-attachments',


    isEqual: function(value1, value2) {
        var length, i = 0,
            attachment1, attachment2;

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
            // mask out meta properties
            attachment1 = Ext.applyIf({
                Created: null,
                CreatorID: null
            }, value1[i]);

            attachment2 = Ext.applyIf({
                Created: null,
                CreatorID: null
            }, value2[i]);

            // compare all remaining fields
            if (!Ext.Object.equals(attachment1, attachment2)) {
                return false;
            }
        }

        return true;
    }
});