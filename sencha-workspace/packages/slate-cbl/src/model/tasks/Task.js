Ext.define('Slate.cbl.model.tasks.Task', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Negative',
        'Ext.data.validator.Presence',
        'Ext.data.validator.Range',

        'Slate.cbl.data.field.Attachments',
        'Slate.cbl.proxy.tasks.Tasks'
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
            type: 'string',

            clonable: true
        },
        {
            name: 'Handle',
            type: 'string',
            allowNull: true,
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
            allowNull: true,

            clonable: true
        },
        {
            name: 'ExpirationDate',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true,

            clonable: true
        },
        {
            name: 'Instructions',
            type: 'string',
            allowNull: true,

            clonable: true
        },
        {
            name: 'Shared',
            type: 'string',
            allowNull: true
        },
        {
            name: 'Status',
            type: 'string'
        },

        // ExperienceTask fields
        {
            name: 'ExperienceType',
            type: 'string',

            clonable: true
        },

        // optional includes
        {
            name: 'Section',
            persist: false
        },

        // writable dynamic fields
        {
            name: 'Assignees',
            defaultValue: {},

            convert: function(v) {
                var length = Ext.isArray(v) && v.length,
                    i = 0, assigneeData,
                    map = {};

                if (Ext.isObject(v)) {
                    return v;
                }

                for (; i < length; i++) {
                    assigneeData = v[i];

                    if (Ext.isObject(assigneeData)) {
                        assigneeData = assigneeData.ID;
                    }

                    map[assigneeData] = true;
                }

                return map;
            }
        },
        {
            name: 'Attachments',
            type: 'slate-cbl-attachments',
            defaultValue: [],

            clonable: true
        },
        {
            name: 'Skills',
            defaultValue: [],

            convert: function(v) {
                var length = Ext.isArray(v) && v.length,
                    i = 0, skillData,
                    skills = [];

                for (; i < length; i++) {
                    skillData = v[i];

                    if (typeof skillData != 'string') {
                        skillData = skillData.Code;
                    }

                    if (skillData) {
                        skills.push(skillData);
                    }
                }

                return skills;
            },

            clonable: true
        },

        // virtual fields
        {
            name: 'ChildTasks',
            defaultValue: [],
            persist: true
        }
    ],

    proxy: {
        type: 'slate-cbl-tasks',
        include: ['Assignees', 'Attachments.File', 'Skills', 'ClonedTask']
    },

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
    ]
});