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
                // '<th class="skill-list-header skill-list-demo-index">&nbsp;</th>',
                '<th class="skill-list-header skill-list-demo-caret"></th>',
                '<th class="skill-list-header skill-list-demo-date">Date</th>',
                '<th class="skill-list-header skill-list-demo-level">Rating</th>',
                '<th class="skill-list-header skill-list-demo-experience">Experience</th>',
                // '<th class="skill-list-header skill-list-demo-experience">Exp. Type</th>',
                // '<th class="skill-list-header skill-list-demo-context">Exp. Name</th>',
                '<th class="skill-list-header skill-list-demo-task">Performance Task</th>',
            '</tr>',
        '</thead>',

        '<tpl if="values && values.length">',
            '<tpl for=".">',
                '<tbody class="skill-list-demo <tpl if="highlighted">{[this.owner.highlightedRowCls]}</tpl>" data-demonstration="{Demonstration.ID}" data-demonstration-skill="{ID}">',
                '<tr class="skill-list-demo-row">',
                    // '<td class="skill-list-demo-data skill-list-demo-index">{[xindex]}</td>',
                    '<td class="skill-list-demo-data skill-list-demo-caret"></td>',
                    '<td class="skill-list-demo-data skill-list-demo-date">{Demonstrated:date}</td>',
                    '<td class="skill-list-demo-data skill-list-demo-level">',
                        '<div',
                            ' class="cbl-level-colored cbl-level-{TargetLevel} <tpl if="!Override">cbl-rating-{DemonstratedLevel}</tpl>"',
                            ' title="',
                                '<tpl if="Override">',
                                    '[Overridden]',
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
                        '<td colspan="2" class="skill-list-demo-data skill-list-override">[Overridden]</td>',
                    '<tpl else>',
                        '<td class="skill-list-demo-data skill-list-demo-experience">',
                            '<div class="skill-list-title">{Demonstration.Context:htmlEncode}</div>',
                            '<small class="skill-list-subtitle">{Demonstration.ExperienceType:htmlEncode}</small>',
                        '</td>',
                        // '<td class="skill-list-demo-data skill-list-demo-type" data-qtip="{Demonstration.ExperienceType:htmlEncode}">{Demonstration.ExperienceType:htmlEncode}</td>',
                        // '<td class="skill-list-demo-data skill-list-demo-context" data-qtip="{Demonstration.Context:htmlEncode}">{Demonstration.Context:htmlEncode}</td>',
                        '<td class="skill-list-demo-data skill-list-demo-task">',
                            '<a class="skill-list-linkable" href="#">',
                                '<i class="linkable-icon fa fa-external-link-square"></i>',
                                '<div class="linkable-content">',
                                    '{Demonstration.PerformanceType:htmlEncode}',
                                '</div>',
                            '</a> ',
                        '</td > ',
                    '</tpl>',
                '</tr>',
                '<tr class="skill-list-demo-detail-row" data-demonstration="{ID}">',
                    '<td class="skill-list-demo-detail-data" colspan="5">',
                        '<div class="skill-list-demo-detail-ct">',
                            // '<pre>{[ JSON.stringify(values.Demonstration) ]}</pre>',
                            // '<tpl if="Demonstration.ArtifactURL">',
                            //     '<div class="skill-list-demo-artifact">',
                            //         '<strong>Artifact: </strong>',
                            //         '<a href="{Demonstration.ArtifactURL:htmlEncode}" target="_blank">{Demonstration.ArtifactURL:htmlEncode}</a>',
                            //     '</div>',
                            // '</tpl>',
                            // '<tpl if="Demonstration.Comments">',
                            //     '<div class="skill-list-demo-comments">',
                            //         '<strong>Comments: </strong>',
                            //         '{[Ext.util.Format.nl2br(Ext.util.Format.htmlEncode(values.Demonstration.Comments))]}',
                            //     '</div>',
                            // '</tpl>',
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

                            '<hr class="skill-list-detail-separator">',

                            `<div class="skill-list-detail-columns">
                                <div class="skill-list-detail-col -links">
                                    <h4 class="skill-list-detail-heading">Links</h4>

                                    <div class="skill-list-detail-group">
                                        <h5 class="skill-list-detail-subheading">Artifacts</h5>
                                        <ul class="skill-list-links">
                                            <li class="skill-list-link-item">
                                                <a href="#" class="skill-list-link">
                                                    <i class="fa fa-link skill-list-link-icon"></i>
                                                    <div class="skill-list-link-label">Artifact title should go here and might be long enough to wrap</div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="skill-list-detail-group">
                                        <h5 class="skill-list-detail-subheading">From [Teacher]</h5>
                                        <ul class="skill-list-links">
                                            <li class="skill-list-link-item">
                                                <a href="#" class="skill-list-link">
                                                    <i class="fa fa-link skill-list-link-icon"></i>
                                                    <div class="skill-list-link-label">Teacher link</div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="skill-list-detail-group">
                                        <h5 class="skill-list-detail-subheading">From [Student Name]</h5>
                                        <ul class="skill-list-links">
                                            <li class="skill-list-link-item">
                                                <a href="#" class="skill-list-link">
                                                    <i class="fa fa-link skill-list-link-icon"></i>
                                                    <div class="skill-list-link-label">Student link</div>
                                                </a>
                                            </li>
                                            <li class="skill-list-link-item">
                                                <a href="#" class="skill-list-link">
                                                    <i class="fa fa-link skill-list-link-icon"></i>
                                                    <div class="skill-list-link-label">A second student link</div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                              <div class="skill-list-detail-col -comments">
                                    <h4 class="skill-list-detail-heading">Latest Comments</h4>

                                    <div class="skill-list-detail-group">
                                        <ul class="skill-list-comments">
                                            <li class="skill-list-comment">
                                                <img class="skill-list-comment-avatar" src="http://www.fillmurray.com/48/48" width="24" height="24" alt="Instructor Name">
                                                <div class="skill-list-comment-body">
                                                    <div class="skill-list-comment-meta">
                                                        <span class="skill-list-comment-author">Teacher Name</span>
                                                        <time class="skill-list-comment-date" datetime="2021-09-01T13:00:00-0400" title="September 1, 2021 at 1:00pm">29m</time>
                                                    </div>
                                                    <div class="skill-list-comment-text">Here is a comment from the instructor.</div>
                                                </div>
                                            </li>
                                            <li class="skill-list-comment">
                                                <img class="skill-list-comment-avatar" src="http://www.fillmurray.com/49/49" width="24" height="24" alt="Student Name">
                                                <div class="skill-list-comment-body">
                                                    <div class="skill-list-comment-meta">
                                                        <span class="skill-list-comment-author">Student Name</span>
                                                        <time class="skill-list-comment-date" datetime="2021-09-01T13:00:00-0400" title="September 1, 2021 at 1:00pm">2h</time>
                                                    </div>
                                                    <div class="skill-list-comment-text">Perhaps the student left a second comment about the task.</div>
                                                </div>
                                            </li>
                                            <li class="skill-list-comment">
                                                <img class="skill-list-comment-avatar -hidden" src="http://www.fillmurray.com/49/49" width="24" height="24" alt="Student Name">
                                                <div class="skill-list-comment-body">
                                                    <div class="skill-list-comment-meta">
                                                        <span class="skill-list-comment-author">Student Name</span>
                                                        <time class="skill-list-comment-date" datetime="2021-09-01T13:00:00-0400" title="September 1, 2021 at 1:00pm">1d</time>
                                                    </div>
                                                    <div class="skill-list-comment-text">Student comment might go here.</div>
                                                </div>
                                            </li>
                                            <li class="skill-list-comment">
                                                <img class="skill-list-comment-avatar" src="http://www.fillmurray.com/48/48" width="24" height="24" alt="Instructor Name">
                                                <div class="skill-list-comment-body">
                                                    <div class="skill-list-comment-meta">
                                                        <span class="skill-list-comment-author">Teacher Name</span>
                                                        <time class="skill-list-comment-date" datetime="2021-09-01T13:00:00-0400" title="September 1, 2021 at 1:00pm">4d</time>
                                                    </div>
                                                    <div class="skill-list-comment-text">Older teacher comment.</div>
                                                </div>
                                            </li>
                                            <li class="skill-list-comment">
                                                <img class="skill-list-comment-avatar" src="http://www.fillmurray.com/49/49" width="24" height="24" alt="Student Name">
                                                <div class="skill-list-comment-body">
                                                    <div class="skill-list-comment-meta">
                                                        <span class="skill-list-comment-author">Student Name</span>
                                                        <time class="skill-list-comment-date" datetime="2021-09-01T13:00:00-0400" title="September 1, 2021 at 1:00pm">1w</time>
                                                    </div>
                                                    <div class="skill-list-comment-text">Older student comment.</div>
                                                </div>
                                            </li>
                                        </ul>

                                        <div style="text-align: right">
                                            <a href="#">See more&hellip;</a>
                                        </div>
                                    </div>

                                </div>
                            </div>`,
                            '</div>',
                    '</td>',
                '</tr>',
                '</tbody>',
            '</tpl>',
        '<tpl else>',
            '<tr class="skill-list-emptytext-row">',
                '<td class="skill-list-emptytext-cell" colspan="5">No demonstrations are logged yet for this skill</td>',
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
