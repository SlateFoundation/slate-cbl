/**
 * Renders a list of demonstration skills
 */
Ext.define('Slate.cbl.view.demonstrations.SkillList', {
    extend: 'Ext.view.View',
    xtype: 'slate-cbl-demonstrations-skilllist',
    requires: [
        'Slate.API',

        'Jarvus.util.format.FuzzyTime',

        'Slate.cbl.util.Config',
        'Slate.cbl.store.demonstrations.DemonstrationSkills',
        'Slate.cbl.model.tasks.Attachment'
    ],


    config: {
        highlightedDemonstration: null,
        showEditLinks: false,

        store: {
            type: 'slate-cbl-demonstrationskills',
            pageSize: 0,
            proxy: {
                type: 'slate-cbl-demonstrationskills',
                include: [
                    'Creator',
                    'Demonstration.Student',
                    'Competency',
                    'Demonstration.StudentTask.Comments.Creator',
                    'Demonstration.StudentTask.Task.Attachments',
                    'Demonstration.StudentTask.Task.Section',
                    'Demonstration.StudentTask.Attachments'
                ]
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
                '<th class="skill-list-header skill-list-demo-caret"></th>',
                '<th class="skill-list-header skill-list-demo-date">Date</th>',
                '<th class="skill-list-header skill-list-demo-level">Rating</th>',
                '<th class="skill-list-header skill-list-demo-experience">Experience</th>',
                '<th class="skill-list-header skill-list-demo-task">Performance Task</th>',
            '</tr>',
        '</thead>',

        '<tpl if="values && values.length">',
            '<tpl for=".">',
                '<tbody class="skill-list-demo <tpl if="highlighted">{[this.owner.highlightedRowCls]}</tpl>" data-demonstration="{Demonstration.ID}" data-demonstration-skill="{ID}">',
                '<tr class="skill-list-demo-row">',
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
                        '<td class="skill-list-demo-data skill-list-demo-task">',
                            '<tpl if="Demonstration.StudentTask">',
                                '<a href="{[this.getStudentTaskLink(values.Demonstration)]}" target="_blank" class="skill-list-linkable">',
                                    '<i class="linkable-icon fa fa-external-link-square"></i>',
                                    '<div class="linkable-content">',
                                        '{Demonstration.StudentTask.Task.Title:htmlEncode}',
                                    '</div>',
                                '</a> ',
                            '</tpl>',
                        '</td > ',
                    '</tpl>',
                '</tr>',
                '<tr class="skill-list-demo-detail-row" data-demonstration="{ID}">',
                    '<td class="skill-list-demo-detail-data" colspan="5">',
                        '<div class="skill-list-demo-detail-ct">',
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
                                <tpl if="this.linksExist(Demonstration)">
                                    <div class="skill-list-detail-col -links">
                                        <h4 class="skill-list-detail-heading">Links</h4>

                                        <tpl if="Demonstration.ArtifactURL">
                                            <div class="skill-list-detail-group">
                                                <h5 class="skill-list-detail-subheading">Artifacts</h5>
                                                <ul class="skill-list-links">
                                                    <li class="skill-list-link-item">
                                                        <a href="{Demonstration.ArtifactURL:htmlEncode}" target="_blank" class="skill-list-link">
                                                            <i class="fa fa-link skill-list-link-icon"></i>
                                                            <div class="skill-list-link-label">{Demonstration.ArtifactURL:htmlEncode}</div>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </tpl>
                                        <tpl if="this.hasActiveAttachments(values.Demonstration.StudentTask.Task.Attachments) == true">
                                            <div class="skill-list-detail-group">
                                                <h5 class="skill-list-detail-subheading">Task Attachments</h5>
                                                <ul class="skill-list-links">
                                                    <tpl for="Demonstration.StudentTask.Task.Attachments">
                                                        <tpl if="Status != 'removed'">
                                                            <li class="skill-list-link-item">
                                                                <a href="{URL:htmlEncode}" target="_blank" class="skill-list-link">
                                                                    <i class="fa fa-link skill-list-link-icon"></i>
                                                                    <div class="skill-list-link-label">{[fm.htmlEncode(this.linkText(values))]}</div>
                                                                </a>
                                                            </li>
                                                        </tpl>
                                                    </tpl>
                                                </ul>
                                          </div>
                                        </tpl>
                                        <tpl if="this.hasActiveAttachments(values.Demonstration.StudentTask.Attachments) == true">
                                            <div class="skill-list-detail-group">
                                                <h5 class="skill-list-detail-subheading">Task Submissions</h5>
                                                <ul class="skill-list-links">
                                                    <tpl for="Demonstration.StudentTask.Attachments">
                                                        <tpl if="Status != 'removed'">
                                                            <li class="skill-list-link-item">
                                                                <a href="{URL:htmlEncode}" target="_blank" class="skill-list-link">
                                                                    <i class="fa fa-link skill-list-link-icon"></i>
                                                                    <div class="skill-list-link-label">{[fm.htmlEncode(this.linkText(values))]}</div>
                                                                </a>
                                                            </li>
                                                         </tpl>
                                                    </tpl>
                                                </ul>
                                            </div>
                                        </tpl>
                                    </div>
                                </tpl>
                                <tpl if="Demonstration.StudentTask.Comments && Demonstration.StudentTask.Comments.length">
                                    <div class="skill-list-detail-col -comments">
                                        <h4 class="skill-list-detail-heading">Latest Comments</h4>
                                        <div class="skill-list-detail-group">
                                            <ul class="skill-list-comments">
                                                <tpl for="Demonstration.StudentTask.Comments">
                                                {% var createDate = new Date(values.Created*1000) %}
                                                <li class="skill-list-comment">
                                                    <img class="skill-list-comment-avatar" src="{[Slate.API.buildUrl("/people/"+values.Creator.ID+"/thumbnail/112x112/cropped")]}" width="24" height="24" alt="Instructor Name">
                                                    <div class="skill-list-comment-body">
                                                        <div class="skill-list-comment-meta">
                                                            <span class="skill-list-comment-author">{Creator.FirstName} {Creator.LastName}</span>
                                                            <time
                                                                class="skill-list-comment-date"
                                                                datetime="{[Ext.Date.format(createDate,"Y-m-d\\\\TH:i:s")]}"
                                                                title="{[Ext.Date.format(createDate,"F j, Y \\\\a\\\\t g:ia")]}">
                                                                {[Ext.util.Format.fuzzyTime(createDate,true)]}
                                                            </time>
                                                        </div>
                                                        <div class="skill-list-comment-text">{Message:htmlEncode}</div>
                                                    </div>
                                                </li>
                                                </tpl>
                                            </ul>
                                        </div>
                                    </div>
                                </tpl>
                            </div>
                        </div>`,
                    '</td>',
                '</tr>',
                '</tbody>',
            '</tpl>',
        '<tpl else>',
            '<tr class="skill-list-emptytext-row">',
                '<td class="skill-list-emptytext-cell" colspan="5">No demonstrations are logged yet for this skill</td>',
            '</tr>',
        '</tpl>',
        {
            getStudentTaskLink: function(d) {
                return Slate.API.buildUrl("/cbl/dashboards/tasks/student#"+d.Student.Username+"/"+d.StudentTask.Task.Section.Code+"/"+d.StudentTask.ID);
            },
            linksExist: function(d) {
                var submissionAttachments = d.StudentTask.Attachments.filter(a => a.status !== 'removed');
                return d.ArtifactURL != null || d.StudentTask.Task.Attachments && d.StudentTask.Task.Attachments.length || d.StudentTask.Attachments && d.StudentTask.Attachments.length;
            },
            hasActiveAttachments: function(attachments) {
                return attachments.filter(a => a.status !== 'removed').length > 0;
            },
            linkText: function(attachment) {
                return Slate.cbl.model.tasks.Attachment.getField('title').calculate(attachment);
            }
        }
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
