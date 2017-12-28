/**
 * Renders a list of demonstration skills
 */
Ext.define('Slate.cbl.view.demonstrations.SkillList', {
    extend: 'Ext.view.View',
    xtype: 'slate-cbl-demonstrations-skilllist',
    requires: [
        'Slate.cbl.store.demonstrations.DemonstrationSkills'
    ],


    config: {
        store: {
            type: 'slate-cbl-demonstrationskills',
            proxy: {
                type: 'slate-cbl-demonstrationskills',
                include: ['Demonstration']
            }
        }
    },


    itemSelector: 'tbody',
    tpl: [
        '<table class="skill-grid">',
            '<thead>',
                '<tr class="skill-grid-header-row">',
                    '<th class="skill-grid-header skill-grid-demo-index">&nbsp;</th>',
                    '<th class="skill-grid-header skill-grid-demo-date">Date</th>',
                    '<th class="skill-grid-header skill-grid-demo-level">Rating</th>',
                    '<th class="skill-grid-header skill-grid-demo-experience">Experience Type</th>',
                    '<th class="skill-grid-header skill-grid-demo-context">Experience Name</th>',
                    '<th class="skill-grid-header skill-grid-demo-task">Performance&nbsp;Task</th>',
                '</tr>',
            '</thead>',

            '<tpl if="values && values.length">',
                '<tpl for=".">',
                    '<tbody>',
                    '<tr class="skill-grid-demo-row" data-demonstration="{ID}">',
                        '<td class="skill-grid-demo-data skill-grid-demo-index">{[xindex]}</td>',
                        '<td class="skill-grid-demo-data skill-grid-demo-date">{Demonstrated:date}</td>',
                        '<td class="skill-grid-demo-data skill-grid-demo-level"><div class="level-color cbl-level-{TargetLevel}"><tpl if="DemonstratedLevel==0">M<tpl else>{DemonstratedLevel}</tpl></div></td>',
                        '<tpl if="Override">',
                            '<td colspan="3" class="skill-grid-demo-data skill-grid-override">Override</td>',
                        '<tpl else>',
                            '<td class="skill-grid-demo-data skill-grid-demo-type">{Demonstration.ExperienceType:htmlEncode}</td>',
                            '<td class="skill-grid-demo-data skill-grid-demo-context">{Demonstration.Context:htmlEncode}</td>',
                            '<td class="skill-grid-demo-data skill-grid-demo-task">{Demonstration.PerformanceType:htmlEncode}</td>',
                        '</tpl>',
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
                                    'Demonstration #{DemonstrationID} &middot;&nbsp;',
                                    '<tpl for="Demonstration.Creator"><a href="/people/{Username}">{FirstName} {LastName}</a></tpl> &middot;&nbsp;',
                                    '{Created:date("F j, Y, g:i a")}',
                                    '<tpl if="parent.showEditLinks">',
                                        ' &middot;&nbsp;',
                                        '<a href="#demonstration-edit" data-demonstration="{DemonstrationID}">Edit</a> | ',
                                        '<a href="#demonstration-delete" data-demonstration="{DemonstrationID}">Delete</a>',
                                    '</tpl>',
                                '</div>',
                            '</div>',
                        '</td>',
                    '</tr>',
                    '</tbody>',
                '</tpl>',
            '<tpl else>',
                '<tr class="skill-grid-emptytext-row">',
                    '<td class="skill-grid-emptytext-cell" colspan="6">No demonstrations are logged yet for this skill</td>',
                '</tr>',
            '</tpl>',
        '</table>'
    ]
});