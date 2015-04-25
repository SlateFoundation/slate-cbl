/*jslint browser: true, undef: true *//*global Ext*/
/**
 * Provides a foundation for the window used in both the student and teacher
 * UIs to display all the demonstrations affecting a given standard.
 * 
 * @abstract
 */
Ext.define('Slate.cbl.view.standard.AbstractOverviewWindow', {
    extend: 'Ext.window.Window',
    xtype: 'slate-cbl-standard-abstractoverviewwindow',

    config: {
        student: null,
        competency: null,
        skill: null,
        demonstration: null
    },

    title: 'Standard Overview',
    width: 700,
    minWidth: 700,
    fixed: true,

    items: [
        {
            reference: 'skillStatement',

            xtype: 'component',
            autoEl: 'p',
            padding: '16 32 0'
        },
        {
            reference: 'demonstrationsTable',

            xtype: 'component',
            minHeight: 200,
            tpl: [
                '<table class="skill-grid">',
                    '<thead>',
                        '<tr class="skill-grid-header-row">',
                            '<th class="skill-grid-header skill-grid-demo-index">&nbsp;</th>',
                            '<th class="skill-grid-header skill-grid-demo-date">Date</th>',
                            '<th class="skill-grid-header skill-grid-demo-level">Level</th>',
                            '<th class="skill-grid-header skill-grid-demo-experience">Experience</th>',
                            '<th class="skill-grid-header skill-grid-demo-context">Context</th>',
                            '<th class="skill-grid-header skill-grid-demo-task">Performance&nbsp;Task</th>',
                        '</tr>',
                    '</thead>',

                    '<tpl if="demonstrations && demonstrations.length">',
                        '<tpl for="demonstrations">',
                            '<tr class="skill-grid-demo-row" data-demonstration="{ID}">',
                                '<td class="skill-grid-demo-data skill-grid-demo-index">{[xindex]}</td>',
                                '<td class="skill-grid-demo-data skill-grid-demo-date">{[fm.date(new Date(values.Demonstration.Demonstrated * 1000))]}</td>',
                                '<td class="skill-grid-demo-data skill-grid-demo-level"><div class="level-color cbl-level-{Level}"><tpl if="Level==0">M<tpl else>{Level}</tpl></div></td>',
                                '<td class="skill-grid-demo-data skill-grid-demo-type">{Demonstration.ExperienceType:htmlEncode}</td>',
                                '<td class="skill-grid-demo-data skill-grid-demo-context">{Demonstration.Context:htmlEncode}</td>',
                                '<td class="skill-grid-demo-data skill-grid-demo-task">{Demonstration.PerformanceType:htmlEncode}</td>',
                            '</tr>',
                            '<tr class="skill-grid-demo-detail-row <tpl if="parent.selectedDemonstrationId == values.DemonstrationID">is-expanded</tpl>" data-demonstration="{ID}">',
                                '<td class="skill-grid-demo-detail-data" colspan="6">',
                                    '<div class="skill-grid-demo-detail-ct">',
                                        '<tpl if="Demonstration.ArtifactURL">',
                                            '<div class="skill-grid-demo-artifact">',
                                                '<strong>Artifact: </strong>',
                                                '<a href="{Demonstration.ArtifactURL:htmlEncode}" target="_blank">{Demonstration.ArtifactURL:htmlEncode}</a>',
                                            '</div>',
                                        '</tpl>',
                                        '<tpl if="Demonstration.Comments">',
                                            '<div class="skill-grid-demo-comments">',
                                                '<strong>Comments: </strong>',
                                                '{[Ext.util.Format.nl2br(Ext.util.Format.htmlEncode(values.Demonstration.Comments))]}',
                                            '</div>',
                                        '</tpl>',
                                        '<div class="skill-grid-demo-meta">',
                                            'Demonstration #{Demonstration.ID} &middot;&nbsp;',
                                            '<tpl for="Demonstration.Creator"><a href="/people/{Username}">{FirstName} {LastName}</a></tpl> &middot;&nbsp;',
                                            '{[fm.date(new Date(values.Demonstration.Created * 1000), "F j, Y, g:i a")]}',
                                            '<tpl if="parent.showEditLinks">',
                                                ' &middot;&nbsp;',
                                                '<a href="#demonstration-edit" data-demonstration="{Demonstration.ID}">Edit</a> | ',
                                                '<a href="#demonstration-delete" data-demonstration="{Demonstration.ID}">Delete</a>',
                                            '</tpl>',
                                        '</div>',
                                    '</div>',
                                '</td>',
                            '</tr>',
                        '</tpl>',
                    '<tpl else>',
                        '<tr class="skill-grid-emptytext-row">',
                            '<td class="skill-grid-emptytext-cell" colspan="6">No demonstrations are logged yet for this skill</td>',
                        '</tr>',
                    '</tpl>',
                '</table>'
            ]
        }
    ],

    initEvents: function() {
        var me = this;

        me.callParent();

        me.mon(me.lookupReference('demonstrationsTable').el, 'click', function(ev, t) {
            me.fireEvent('demorowclick', me, ev, Ext.get(t));
        }, me, { delegate: '.skill-grid-demo-row' });
    },

//    applyStudent: function(student) {
//        return student ? Ext.getStore('cbl-students-loaded').getById(student) : null;
//    },
//
//    applyCompetency: function(competency) {
//        return competency ? Ext.getStore('cbl-competencies-loaded').getById(competency) : null;
//    },

    applyStudent: function(student) {
        if (Ext.isString(student)) {
            student = parseInt(student, 10);
        }

        return student ? student : null;
    },
    
    applyCompetency: function(competency) {
        if (Ext.isString(competency)) {
            competency = parseInt(competency, 10);
        }

        return competency ? competency : null;
    },
    
    applySkill: function(skill) {
        if (Ext.isString(skill)) {
            skill = parseInt(skill, 10);
        }

        return skill ? skill : null;
    },
    
    applyDemonstration: function(demonstration) {
        if (Ext.isString(demonstration)) {
            demonstration = parseInt(demonstration, 10);
        }

        return demonstration ? demonstration : null;
    }
});