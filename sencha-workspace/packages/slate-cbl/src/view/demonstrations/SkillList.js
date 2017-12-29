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
            pageSize: 0,
            proxy: {
                type: 'slate-cbl-demonstrationskills',
                include: ['Creator', 'Demonstration']
            }
        },
        selectionModel: {
            type: 'dataviewmodel',
            mode: 'SIMPLE'
        }
    },


    autoEl: 'table',
    componentCls: 'skill-list',
    itemSelector: 'tbody',
    tpl: [
        '<thead>',
            '<tr class="skill-list-header-row">',
                '<th class="skill-list-header skill-list-demo-index">&nbsp;</th>',
                '<th class="skill-list-header skill-list-demo-date">Date</th>',
                '<th class="skill-list-header skill-list-demo-level">Rating</th>',
                '<th class="skill-list-header skill-list-demo-experience">Experience Type</th>',
                '<th class="skill-list-header skill-list-demo-context">Experience Name</th>',
                '<th class="skill-list-header skill-list-demo-task">Performance&nbsp;Task</th>',
            '</tr>',
        '</thead>',

        '<tpl if="values && values.length">',
            '<tpl for=".">',
                '<tbody class="skill-list-demo" data-demonstration="{ID}">',
                '<tr class="skill-list-demo-row">',
                    '<td class="skill-list-demo-data skill-list-demo-index">{[xindex]}</td>',
                    '<td class="skill-list-demo-data skill-list-demo-date">{Demonstrated:date}</td>',
                    '<td class="skill-list-demo-data skill-list-demo-level"><div class="level-color cbl-level-{TargetLevel}"><tpl if="DemonstratedLevel==0">M<tpl else>{DemonstratedLevel}</tpl></div></td>',
                    '<tpl if="Override">',
                        '<td colspan="3" class="skill-list-demo-data skill-list-override">Override</td>',
                    '<tpl else>',
                        '<td class="skill-list-demo-data skill-list-demo-type">{Demonstration.ExperienceType:htmlEncode}</td>',
                        '<td class="skill-list-demo-data skill-list-demo-context">{Demonstration.Context:htmlEncode}</td>',
                        '<td class="skill-list-demo-data skill-list-demo-task">{Demonstration.PerformanceType:htmlEncode}</td>',
                    '</tpl>',
                '</tr>',
                '<tr class="skill-list-demo-detail-row <tpl if="parent.selectedDemonstrationId == values.DemonstrationID">is-expanded</tpl>" data-demonstration="{ID}">',
                    '<td class="skill-list-demo-detail-data" colspan="6">',
                        '<div class="skill-list-demo-detail-ct">',
                            '<tpl if="Demonstration.ArtifactURL">',
                                '<div class="skill-list-demo-artifact">',
                                    '<strong>Artifact: </strong>',
                                    '<a href="{Demonstration.ArtifactURL:htmlEncode}" target="_blank">{Demonstration.ArtifactURL:htmlEncode}</a>',
                                '</div>',
                            '</tpl>',
                            '<tpl if="Demonstration.Comments">',
                                '<div class="skill-list-demo-comments">',
                                    '<strong>Comments: </strong>',
                                    '{[Ext.util.Format.nl2br(Ext.util.Format.htmlEncode(values.Demonstration.Comments))]}',
                                '</div>',
                            '</tpl>',
                            '<div class="skill-list-demo-meta">',
                                'Demonstration #{DemonstrationID} &middot;&nbsp;',
                                '<tpl for="Creator"><a href="/people/{Username}">{FirstName} {LastName}</a></tpl> &middot;&nbsp;',
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
            '<tr class="skill-list-emptytext-row">',
                '<td class="skill-list-emptytext-cell" colspan="6">No demonstrations are logged yet for this skill</td>',
            '</tr>',
        '</tpl>'
    ],


    listeners: {
        selectionchange: function() {
            // HACK: selection changes height of list content via CSS, this call ensures parent layouts learn about the height change
            this.updateLayout();
        }
    }
});