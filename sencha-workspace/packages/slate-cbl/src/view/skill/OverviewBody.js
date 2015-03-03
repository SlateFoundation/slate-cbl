/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.view.skill.OverviewBody', {
    extend: 'Ext.container.Container',
    xtype: 'slate-cbl-skill-overviewbody',
    requires: [
        'Slate.cbl.model.Skill',

        'Ext.form.field.ComboBox',
        'Ext.data.ChainedStore'
    ],

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
                            // '<th class="skill-grid-header skill-grid-demo-artifact">Artifact</th>',
                        '</tr>',
                    '</thead>',
                    '<tpl if="values && values.length">',
                        '<tpl for=".">',
                            '<tr class="skill-grid-demo-row" data-demonstration="{ID}">',
                                '<td class="skill-grid-demo-data skill-grid-demo-index">{[xindex]}</td>',
                                '<td class="skill-grid-demo-data skill-grid-demo-date">{Demonstration.Demonstrated:date("M j, Y")}</td>',
                                '<td class="skill-grid-demo-data skill-grid-demo-level"><div class="level-color cbl-level-{Level}"><tpl if="Level==0">M<tpl else>{Level}</tpl></div></td>',
                                '<td class="skill-grid-demo-data skill-grid-demo-type">{Demonstration.ExperienceType:htmlEncode}</td>',
                                '<td class="skill-grid-demo-data skill-grid-demo-context">{Demonstration.Context:htmlEncode}</td>',
                                '<td class="skill-grid-demo-data skill-grid-demo-task">{Demonstration.PerformanceType:htmlEncode}</td>',
                                // '<td class="skill-grid-demo-data skill-grid-demo-artifact"><tpl if="Demonstration.ArtifactURL"><a href="{Demonstration.ArtifactURL:htmlEncode}">{Demonstration.ArtifactURL:htmlEncode}</a></tpl></td>',
                            '</tr>',
                            '<tr class="skill-grid-demo-detail-row" data-demonstration="{ID}">',
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
                                                '{[this.escapeAndNewline(values.Demonstration.Comments)]}',
                                            '</div>',
                                        '</tpl>',
                                        '<div class="skill-grid-demo-meta">',
                                            'Demonstration #{Demonstration.ID} &middot;&nbsp;',
                                            '<tpl for="Demonstration.Creator"><a href="/people/{Username}">{FirstName} {LastName}</a></tpl> &middot;&nbsp;',
                                            '{[fm.date(new Date(values.Demonstration.Created * 1000), "F j, Y, g:i a")]} &middot;&nbsp;',
                                            '<tpl if="!window.SiteEnvironment.cblStudent">',
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
                '</table>',
                {
                    escapeAndNewline: function(s) {
                        s = Ext.util.Format.htmlEncode(s);
                        return Ext.util.Format.nl2br(s);
                    }
                }
            ]
        }
    ]
});