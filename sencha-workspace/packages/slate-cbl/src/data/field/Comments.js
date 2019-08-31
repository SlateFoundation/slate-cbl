Ext.define('Slate.cbl.data.field.Comments', {
    extend: 'Ext.data.field.Field',
    alias: 'data.field.slate-cbl-comments',


    convert: function(value) {
        if (!value) {
            return [];
        }

        return value.map(data => ({
            ID: data.ID,
            Creator: data.Creator,
            Created: new Date(data.Created * 1000),
            Message: data.Message
        }));
    },

    serialize: function(value) {
        if (!value) {
            return [];
        }

        // only send new messages to server
        return value
            .filter(data => !data.ID)
            .map(data => ({ Message: data.Message }));
    },

    isEqual: function(value1, value2) {
        var length, i = 0,
            comment1, comment2;

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
            comment1 = Ext.applyIf({
                Created: null,
                Creator: null
            }, value1[i]);

            comment2 = Ext.applyIf({
                Created: null,
                Creator: null
            }, value2[i]);

            // compare all remaining fields
            if (!Ext.Object.equals(comment1, comment2)) {
                return false;
            }
        }

        return true;
    }
});