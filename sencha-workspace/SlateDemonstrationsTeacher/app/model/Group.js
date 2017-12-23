Ext.define('SlateDemonstrationsTeacher.model.Group', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.Records'
    ],

    // todo: add the rest of the fields
    fields: [{
        name: 'ID'
    }, {
        name: 'Name'
    }, {
        name: 'Handle'
    }],

    proxy: {
        type: 'slate-records',
        url: '/groups'
    }
});