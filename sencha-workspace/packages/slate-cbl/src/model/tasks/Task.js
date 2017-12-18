Ext.define('Slate.cbl.model.tasks.Task', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.proxy.tasks.Tasks',
        'Ext.data.identifier.Negative',
        'Ext.data.validator.Presence',
        'Ext.data.validator.Range'
    ],


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

        // Task fields
        {
            name: 'SectionID',
            type: 'int',
            allowNull: true
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
            name: 'ClonedTaskID',
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
            name: 'Status',
            type: 'string',
            defaultValue: 'shared'
        },

        // ExperienceTask fields
        {
            name: 'ExperienceType',
            type: 'string',
            defaultValue: 'Studio'
        },

        // writable dynamic fields
        {
            name: 'Attachments'
        },
        {
            name: 'Assignees'
        },

        // virtual fields
        // TODO: review if still needed
        // {
        //     name: 'ParentTaskTitle',
        //     depends: 'ParentTask',
        //     mapping: 'ParentTask.Title'
        // },
        // {
        //     name: 'CreatorFullName',
        //     depends: 'Creator',
        //     calculate: function(data) {
        //         if (!data.Creator) {
        //             return null;
        //         }

        //         return data.Creator.FirstName + ' ' + data.Creator.LastName;
        //     }
        // },
        // {
        //     name: 'SkillIDs',
        //     depends: 'Skills',
        //     persist: true,
        //     calculate: function(data) {
        //         if (!Ext.isEmpty(data.Skills)) {
        //             return Ext.Array.map(data.Skills, function(skill) {
        //                 return skill.ID;
        //             });
        //         }

        //         return [];
        //     }
        // }
    ],

    proxy: 'slate-cbl-tasks',

    // TODO: review if still needed
    // proxy: {
    //     type: 'slate-cbl-tasks',
    //     include: [
    //         'Creator',
    //         'ParentTask',
    //         'Skills',
    //         'Attachments.File',
    //         'StudentTasks'
    //     ],
    //     timeout: 180000 // extended timeout for handling attachment permission requests
    // },

    validators: [
        {
            type: 'min',
            field: 'SectionID',
            min: 1,
            emptyMessage: 'SectionID is required'
        },
        {
            type: 'presence',
            field: 'Title',
            message: 'Title is required'
        }
    ],

    // TODO: review if still needed
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
    },

    // TODO: review if still needed
    getAssigneeIds: function() {
        var assignees = [],
            studentTasks = this.get('StudentTasks') || [],
            i = 0;

        for (; i < studentTasks.length; i++) {
            assignees.push(studentTasks[i].StudentID);
        }

        return assignees;
    }
});