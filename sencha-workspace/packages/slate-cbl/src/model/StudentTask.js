/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.model.StudentTask', {
    extend: 'Ext.data.Model',
    requires: [
        'Emergence.ext.proxy.Records',
        'Ext.data.identifier.Negative'
    ],


    // model config
    idProperty: 'ID',
    identifier: 'negative',

    fields: [
        {
            name: "ID",
            type: "int",
            allowNull: true
        },
        {
            name: "Class",
            type: "string",
            defaultValue: "Slate\\CBL\\Tasks\\StudentTask"
        },
        {
            name: "Created",
            type: "date",
            dateFormat: "timestamp",
            allowNull: true
        },
        {
            name: "CreatorID",
            type: "int",
            allowNull: true
        },
        {
            name: "RevisionID",
            type: "int",
            allowNull: true
        },
        {
            name: "Modified",
            type: "date",
            dateFormat: "timestamp",
            allowNull: true
        },
        {
            name: "ModifierID",
            type: "int",
            allowNull: true
        },
        {
            name: "TaskID",
            type: "int"
        },
        {
            name: "StudentID",
            type: "int"
        },
        {
            name: "ExperienceType",
            type: "string",
            allowNull: true
        },
        {
            name: "DueDate",
            type: "date",
            dateFormat: "timestamp",
            allowNull: true
        },
        {
            name: "Submitted",
            type: "date",
            dateFormat: "timestamp",
            allowNull: true
        },
        {
            name: "ExpirationDate",
            type: "date",
            dateFormat: "timestamp",
            allowNull: true
        },
        {
            name: "TaskStatus",
            type: "string",
            defaultValue: "assigned"
        }
    ],

    proxy: {
        type: 'slate-records',
        url: '/cbl/student-tasks'
    },

    getTaskSkillsGroupedByCompetency: function() {
        var comps = [], compIds = [],
            skills = this.get('TaskSkills');

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