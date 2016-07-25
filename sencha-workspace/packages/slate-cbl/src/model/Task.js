Ext.define('Slate.cbl.model.Task', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.Records',
        'Ext.data.identifier.Negative'
    ],

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
            defaultValue: 'Slate\\CBL\\Tasks\\ExperienceTask'
        },
        {
            name: 'Created',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true,
            persist: false
        },
        {
            name: 'CreatorID',
            type: 'int',
            allowNull: true,
            persist: false
        },
        {
            name: 'RevisionID',
            type: 'int',
            allowNull: true,
            persist: false
        },
        {
            name: 'Modified',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true,
            persist: false
        },
        {
            name: 'ModifierID',
            type: 'int',
            allowNull: true,
            persist: false
        },
        {
            name: 'Title',
            type: 'string'
        },
        {
            name: 'Handle',
            type: 'string',
            persist: false
        },
        {
            name: 'ParentTaskID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'DueDate',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'ExpirationDate',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'Instructions',
            type: 'string',
            allowNull: true
        },
        {
            name: 'Shared',
            type: 'string'
        },
        {
            name: 'ExperienceType',
            type: 'string'
        },

        {
            name: 'Creator',
            persist: false
        },
        {
            name: 'Attachments',
            persist: true
        },
        {
            name: 'ParentTask',
            persist: false
        },
        {
            name: 'Skills',
            persist: false
        },
        {
            name: 'ParentTaskTitle',
            depends: 'ParentTask',
            mapping: 'ParentTask.Title',
            persist: false
        },
        {
            name: 'CreatorFullName',
            depends: 'Creator',
            persist: false,
            calculate: function(data) {
                if (!data.Creator) {
                    return null;
                }
                return data.Creator.FirstName + ' ' + data.Creator.LastName;
            }
        },
        {
            name: 'SkillIDs',
            depends: 'Skills',
            persist: true,
            calculate: function(data) {
                if (!Ext.isEmpty(data.Skills)) {
                    return Ext.Array.map(data.Skills, function(skill) {
                        return skill.ID;
                    });
                }

                return [];
            }
        }
    ],

    proxy: {
        type: 'slate-records',
        url: '/cbl/tasks',
        include: [
            'Creator',
            'ParentTask',
            'Skills',
            'Attachments'
        ]
    },

    validators: [{
        type: 'presence',
        field: 'Title',
        message: 'Title is required'
    },{
        type: 'length',
        field: 'Skills',
        min: 1,
        minOnlyMessage: 'You must select at least one skill'
    }],

    getSkillsGroupedByCompetency: function() {
        var comps = [], compIds = [],
            skills = this.get('Skills');

        Ext.each(skills, function(skill) {
            var compIdx;
            if ((compIdx = compIds.indexOf(skill.CompetencyCode)) === -1) {
                compIdx = compIds.length;
                comps[compIdx] = {
                    Code: skill.CompetencyCode,
                    Descriptor: skill.CompetencyDescriptor,
                    skills: []
                };
                compIds.push(skill.CompetencyCode);
            }

            comps[compIdx].skills.push(skill);
        });

        return comps;
    }
});