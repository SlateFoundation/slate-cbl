Ext.define('Slate.cbl.store.Students', {
    extend: 'Ext.data.Store',
    type: 'store.cbl-students',
    requires: [
        /* global Slate */
        'Slate.cbl.API'
    ],


    model: 'Slate.model.person.Person',

    config: {
        pageSize: 0,
        sorters: [{
            property: 'FullName',
            direction: 'ASC'
        }]
    },

    constructor: function(config) {
        config = config || {};

        config.session = Slate.cbl.API.getSession();

        this.callParent([config]);
    }
});