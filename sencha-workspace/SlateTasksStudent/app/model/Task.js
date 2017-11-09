// TODO: merge with Slate.cbl.model.StudentTask ?
Ext.define('SlateTasksStudent.model.Task', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.proxy.Records',
        'Slate.cbl.model.tasks.Attachment',
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
            name: 'TaskID',
            type: 'int'
        },
        {
            name: 'Task',
            persist: false
        },
        {
            name: 'SectionTitle',
            type: 'string',
            mapping: 'Section.Title',
            persist: false
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
        },
        {
            name: 'Comments',
            persist: false
        },
        {
            name: 'DueTime',
            persist: false,
            depends: ['DueDate'],
            convert: function(v, r) {
                var dueDate = r.get('DueDate'),
                    dueTime;

                if (!dueDate) {
                    return null;
                }

                dueTime = new Date(dueDate);

                // task is late after midnight of due date
                dueTime.setHours(23, 59, 59, 999);

                return dueTime;
            }
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
            'Student',
            'Section',
            'Comments',
            'Attachments',
            'TaskSkills',
            'Task.Attachments',
            'Task.ParentTask'
        ]
    },

    getTeacherAttachments: function() {
        // only return 'view-only' google drive attachments
        return Ext.Array.filter(this.TaskAttachments().getRange(), function(attachment) {
            if (attachment.get('Class') == 'Slate\\CBL\\Tasks\\Attachments\\GoogleDriveFile') {
                return attachment.get('ShareMethod') == 'view-only';
            }
            return true;
        });
    },

    getStudentAttachments: function() {
        var me = this,
            taskAttachments = me.TaskAttachments().getRange(),
            attachments = me.Attachments().getRange(),
            i = 0;

        // include 'collaborate' google drive attachments
        for (; i < taskAttachments.length; i++) {
            if (taskAttachments[i].get('Class') == 'Slate\\CBL\\Tasks\\Attachments\\GoogleDriveFile' && taskAttachments[i].get('ShareMethod') == 'collaborate') {
                attachments.push(taskAttachments[i]);
            }
        }

        // disallow editing of teacher created attachments
        for (i = 0; i < attachments.length; i++) {
            if (attachments[i].get('FileID')) {
                if (
                    attachments[i].get('ShareMethod') == 'collaborate'
                    || attachments[i].get('ShareMethod') == 'view-only'
                    && attachments[i].get('ParentAttachmentID')
                ) {
                    attachments[i].set({
                        shareMethodMutable: false,
                        statusMutable: false
                    });
                }
            }
        }

        return attachments;
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
