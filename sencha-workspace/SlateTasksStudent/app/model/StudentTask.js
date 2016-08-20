Ext.define('SlateTasksStudent.model.StudentTask', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.Records',
        'Slate.cbl.model.tasks.Attachment',
        'Slate.cbl.model.tasks.Comment',
        'Slate.cbl.model.Skill'
    ],

    // model config
    idProperty: 'ID',

    fields: [
        {
            name: 'ID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'Class',
            type: 'string',
            defaultValue: '\\Slate\\CBL\\Tasks\\StudentTask'
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
            name: 'TaskID',
            reference: 'Task',
            type: 'int'
        },
        {
            name: 'TaskStatus',
            type: 'string'
        },
        {
            name: 'TaskClass',
            type: 'string',
            mapping: 'Task.Class',
            defaultValue: '\\Slate\\CBL\\Tasks\\ExperienceTask'
        },
        {
            name: 'TaskCreated',
            type: 'date',
            mapping: 'Task.Created',
            dateFormat: 'timestamp',
            allowNull: true,
            persist: false
        },
        {
            name: 'Title',
            type: 'string',
            mapping: 'Task.Title',
            allowNull: true,
            persist: false
        },
        {
            name: 'Status',
            mapping: 'Task.Status',
            type: 'string',
            persist: false
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
            mapping: 'Task.ExpirationDate',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'Submitted',
            type: 'date',
            mapping: 'Submitted',
            dateFormat: 'timestamp',
            allowNull: true
        },
        {
            name: 'Instructions',
            type: 'string',
            mapping: 'Task.Instructions',
            allowNull: true
        },
        {
            name: 'ParentTaskID',
            type: 'int',
            mapping: 'Task.ParentTaskID',
            allowNull: true,
            persist: false
        },
        {
            name: 'ParentTaskTitle',
            type: 'string',
            persist: false
        },
        {
            name: 'FirstName',
            mapping: 'Student.FirstName',
            type: 'string',
            persist: false
        },
        {
            name: 'LastName',
            mapping: 'Student.LastName',
            type: 'string',
            persist: false
        },
        {
            name: 'FullName',
            depends: ['FirstName', 'LastName'],
            persist: false,
            convert: function(v, r) {
                return r.get('FirstName') + ' ' + r.get('LastName');
            }
        },
        {
            name: 'Competencies',
            persist: false
        },
        {
            name: 'SkillRatings',
            type: 'auto',
            persist: false
        },
        {
            name: 'filtered',
            type: 'boolean',
            persist: false,
            defaultValue: false
        }, {
            name: 'Comments',
            persist: false
        }
    ],

    hasMany: [{
        model: 'Slate.cbl.model.tasks.Attachment',
        name: 'Attachments',
        associationKey: 'Attachments'
    },
    {
        model: 'Slate.cbl.model.tasks.Attachment',
        name: 'TaskAttachments',
        associationKey: 'Task.Attachments'
    },
    {
        model: 'Slate.cbl.model.Skill',
        name: 'Skills',
        associationKey: 'Task.Skills'
    }],

    proxy: {
        type: 'slate-records',
        url: '/cbl/student-tasks',
        include: [
            // 'Task',
            'Student',
            'Comments',
            'Attachments',
            // 'SkillRatings',
            'TaskSkills',
            'Task.Attachments',
            'Task.ParentTask',
            // 'Task.Skills.Competency',
            // 'Task.Skills.CompetencyLevel'
        ]
    },

    getTaskSkillsGroupedByCompetency: function() {
        var comps = [], compIds = [],
            skills = this.get('TaskSkills'),
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
