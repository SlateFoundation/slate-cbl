/**
 * Renders a list of demonstration skills
 */
Ext.define('Slate.cbl.view.demonstrations.SkillList', {
    extend: 'Ext.view.View',
    xtype: 'slate-cbl-demonstrations-skilllist',
    requires: [
        'Slate.API',

        'Slate.cbl.util.Config',
        'Slate.cbl.store.demonstrations.DemonstrationSkills'
    ],


    config: {
        highlightedDemonstration: null,
        showEditLinks: false,

        store: {
            type: 'slate-cbl-demonstrationskills',
            pageSize: 0,
            proxy: {
                type: 'slate-cbl-demonstrationskills',
                include: ['Creator', 'Demonstration', 'Competency']
            }
        },
        selectionModel: {
            type: 'dataviewmodel',
            mode: 'SIMPLE'
        }
    },


    // skilllist properties
    highlightedRowCls: 'skill-list-demo-highlighted',


    // component properties
    autoEl: 'table',
    componentCls: 'skill-list',


    // dataview properties
    itemSelector: 'tbody',
    tpl: [
        '<thead>',
            '<tr class="skill-list-header-row">',
                '<th class="skill-list-header skill-list-demo-index">&nbsp;</th>',
                '<th class="skill-list-header skill-list-demo-date">Date</th>',
                '<th class="skill-list-header skill-list-demo-level">Rating</th>',
                '<th class="skill-list-header skill-list-demo-experience">Exp. Type</th>',
                '<th class="skill-list-header skill-list-demo-context">Exp. Name</th>',
                '<th class="skill-list-header skill-list-demo-task">Perf. Task</th>',
            '</tr>',
        '</thead>',

        '<tpl if="values && values.length">',
            '<tpl for=".">',
                '<tbody class="skill-list-demo <tpl if="highlighted">{[this.owner.highlightedRowCls]}</tpl>" data-demonstration="{Demonstration.ID}" data-demonstration-skill="{ID}">',
                '<tr class="skill-list-demo-row">',
                    '<td class="skill-list-demo-data skill-list-demo-index">{[xindex]}</td>',
                    '<td class="skill-list-demo-data skill-list-demo-date">{Demonstrated:date}</td>',
                    '<td class="skill-list-demo-data skill-list-demo-level">',
                        '<div',
                            ' class="cbl-level-colored cbl-level-{TargetLevel} <tpl if="!Override">cbl-rating-{DemonstratedLevel}</tpl>"',
                            ' title="',
                                '<tpl if="Override">',
                                    'Overriden',
                                '<tpl else>',
                                    '{[fm.htmlEncode(Slate.cbl.util.Config.getTitleForRating(values.DemonstratedLevel))]}',
                                '</tpl>',
                            '"',
                        '>',
                            '<tpl if="Override">',
                                '<i class="fa fa-check"></i>',
                            '<tpl else>',
                                '{[fm.htmlEncode(Slate.cbl.util.Config.getAbbreviationForRating(values.DemonstratedLevel))]}',
                            '</tpl>',
                        '</div>',
                    '</td>',
                    '<tpl if="Override">',
                        '<td colspan="3" class="skill-list-demo-data skill-list-override">Override</td>',
                    '<tpl else>',
                        '<td class="skill-list-demo-data skill-list-demo-type">{Demonstration.ExperienceType:htmlEncode}</td>',
                        '<td class="skill-list-demo-data skill-list-demo-context">{Demonstration.Context:htmlEncode}</td>',
                        '<td class="skill-list-demo-data skill-list-demo-task">{Demonstration.PerformanceType:htmlEncode}</td>',
                    '</tpl>',
                '</tr>',
                '<tr class="skill-list-demo-detail-row" data-demonstration="{ID}">',
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
                                '<tpl for="Creator">',
                                    '<a href="{[Slate.API.buildUrl("/people/"+values.Username)]}" target="_blank">',
                                        '{FirstName} {LastName}',
                                    '</a>',
                                '</tpl>',
                                ' &middot;&nbsp;',
                                '{Created:date("F j, Y, g:i a")}',
                                '<tpl if="showEditLinks">',
                                    ' &middot;&nbsp;',
                                    '<a href="#edit">Edit</a> | ',
                                    '<a href="#delete">Delete</a>',
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


    // config handlers
    updateHighlightedDemonstration: function(demonstration, oldDemonstration) {
        var me = this,
            highlightedRowCls = me.highlightedRowCls,
            store = me.getStore();

        if (oldDemonstration) {
            oldDemonstration = me.getNode(store.findExact('DemonstrationID', oldDemonstration));

            if (oldDemonstration) {
                Ext.fly(oldDemonstration).removeCls(highlightedRowCls);
            }
        }

        if (demonstration) {
            demonstration = me.getNode(store.findExact('DemonstrationID', demonstration));

            if (demonstration) {
                Ext.fly(demonstration).addCls(highlightedRowCls);
            }
        }
    },


    // event handlers
    listeners: {
        selectionchange: function() {
            // HACK: selection changes height of list content via CSS, this call ensures parent layouts learn about the height change
            this.updateLayout();
        }
    },


    // dataview lifecycle
    prepareData: function() {
        var me = this,
            data = Ext.Object.chain(me.callParent(arguments));

        if (data.DemonstrationID == me.getHighlightedDemonstration()) {
            data.highlighted = true;
        }

        data.showEditLinks = me.getShowEditLinks();

        return data;
    },

    onBeforeItemClick: function(demonstrationSkill, item, index, ev) {
        var me = this,
            demonstrationId = demonstrationSkill.get('DemonstrationID');

        if (ev.getTarget('.skill-list-demo-row')) {
            return true; // allow selection
        }

        if (ev.getTarget('a[href="#edit"]')) {
            ev.stopEvent();

            me.fireEvent('editclick', me, demonstrationId, demonstrationSkill, ev);
        } else if (ev.getTarget('a[href="#delete"]')) {
            ev.stopEvent();

            me.fireEvent('deleteclick', me, demonstrationId, demonstrationSkill, ev);
        }

        // cancel selection
        return false;
    }
});