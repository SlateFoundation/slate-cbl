Ext.define('Slate.cbl.model.Skill', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.proxy.Skills',
        'Ext.data.identifier.Negative'
    ],


    // model config
    idProperty: 'ID',
    identifier: 'negative',

    fields: [
        {
            name: 'ID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'Class',
            type: 'string',
            defaultValue: 'Slate\\CBL\\Skill'
        },
        {
            name: 'Created',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'CreatorID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'RevisionID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'CompetencyID',
            type: 'int'
        },
        {
            name: 'CompetencyLevel',
            type: 'int'
        },
        {
            name: 'Code',
            type: 'string'
        },
        {
            name: 'Descriptor',
            type: 'string'
        },
        {
            name: 'Statement',
            type: 'string'
        },
        {
            name: 'DemonstrationsRequired'
        },
        {
            name: 'SkillRating',
            type: 'string',
            defaultValue: 'N/A',
            persist: false
        },
        {
            name: 'Code_Descriptor',
            depends: ['Code', 'Descriptor'],
            persist: false,
            calculate: function(data) {
                return [data.Code, '-', data.Descriptor].join(' ');
            }
        }
    ],

    getTotalDemonstrationsRequired: function(userLevel) {
        var me = this,
            requirements = me.get('DemonstrationsRequired'),
            total = requirements[userLevel];

        if (total !== undefined) {
            return total;
        }

        return requirements['default']; // eslint-disable-dot-notation
    },

    proxy: 'slate-cbl-skills'
});
