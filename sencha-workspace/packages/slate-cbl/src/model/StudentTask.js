Ext.define('Slate.cbl.model.StudentTask', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.proxy.tasks.StudentTasks',
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
            defaultValue: 'Slate\\CBL\\Tasks\\StudentTask'
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
            name: 'Modified',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'ModifierID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'TaskID',
            type: 'int'
        },
        {
            name: 'Task',
            persist: false
        },
        {
            name: 'StudentID',
            type: 'int'
        },
        {
            name: 'Student',
            persist: false
        },
        {
            name: 'ExperienceType',
            type: 'string',
            allowNull: true
        },
        {
            name: 'DueDate',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'Submitted',
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
            name: 'TaskStatus',
            type: 'string',
            defaultValue: 'assigned'
        }
    ],

    proxy: {
        type: 'slate-cbl-studenttasks'
    },

    getTaskSkillsGroupedByCompetency: function() {
        var comps = [], compIds = [],
            skills = this.get('TaskSkills') || [],
            compIdx, skill,
            i = 0;

        for (; i < skills.length; i++) {
            skill = skills[i];

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
        }

        return comps;
    }
});
