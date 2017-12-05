Ext.define('Slate.cbl.model.Competency', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.proxy.Competencies',
        'Ext.data.identifier.Negative'
    ],


    // model config
    idProperty: 'ID',
    identifier: 'negative',

    fields: [
        // server-persisted fields
        { name: 'ID', type: 'int' },
        { name: 'ContentAreaID', type: 'int' },
        { name: 'Code', type: 'string'},
        { name: 'Descriptor', type: 'string'},
        { name: 'Statement', type: 'string'},

        // server-provided metadata
        { name: 'totalDemonstrationsRequired', persist: false},
        { name: 'minimumAverageOffset', persist: false, type: 'float' }
    ],

    getTotalDemonstrationsRequired: function(userLevel) {
        var me = this,
            requirements = me.get('totalDemonstrationsRequired'),
            total = requirements[userLevel];

        if (total !== undefined) {
            return total;
        }

        return requirements['default']; // eslint-disable-dot-notation
    },

    proxy: {
        type: 'slate-cbl-competencies'
    }
});
