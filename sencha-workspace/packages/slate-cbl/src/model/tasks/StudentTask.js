Ext.define('Slate.cbl.model.tasks.StudentTask', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.proxy.tasks.StudentTasks',
        'Ext.data.identifier.Negative'
    ],


    // model config
    idProperty: 'ID',
    identifier: 'negative',

    fields: [
        // ActiveRecord fields
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

        // StudentTask fields
        {
            name: 'TaskID',
            type: 'int'
        },
        {
            name: 'StudentID',
            type: 'int'
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
            name: 'ExpirationDate',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'TaskStatus',
            type: 'string',
            defaultValue: 'assigned'
        },
        {
            name: 'DemonstrationID',
            type: 'int',
            allowNull: true
        }
    ],

    proxy: 'slate-cbl-studenttasks',

    // TODO: review if still needed
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
