Ext.define('Slate.cbl.data.field.Submissions', {
    extend: 'Ext.data.field.Field',
    alias: 'data.field.slate-cbl-submissions',


    convert: function(value) {
        if (!value) {
            return [];
        }

        return value.map(data => ({
            ID: data.ID,
            Created: new Date(data.Created * 1000)
        })).reverse();
    }
});