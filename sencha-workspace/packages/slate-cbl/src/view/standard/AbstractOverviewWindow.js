/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext,Slate*/
/**
 * Provides a foundation for the window used in both the student and teacher
 * UIs to display all the demonstrations affecting a given standard.
 * 
 * @abstract
 */
Ext.define('Slate.cbl.view.standard.AbstractOverviewWindow', {
    extend: 'Ext.window.Window',
    xtype: 'slate-cbl-standard-abstractoverviewwindow',
    requires: [
        'Slate.cbl.API'
    ],

    config: {
        skill: null,
        student: null,
        selectedDemonstration: null,
        showEditLinks: false
    },

    title: 'Standard Overview',
    width: 700,
    minWidth: 700,
    autoScroll: true,

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


    // template methods
    initComponent: function() {
        var me = this;

        me.callParent();

        me.skillStatementCmp = me.down('[reference=skillStatement]');
        me.demonstrationsTable = me.down('[reference=demonstrationsTable]');
    },

    afterRender: function() {
        var me = this;

        me.callParent(arguments);

        me.mon(me.demonstrationsTable.el, 'click', function(ev, targetEl) {
            if (targetEl = ev.getTarget('.skill-grid-demo-row', me.el, true)) {
                targetEl.next('.skill-grid-demo-detail-row').toggleCls('is-expanded');
                me.doLayout();
                me.fireEvent('demorowclick', me, ev, targetEl);
            } else if (targetEl = ev.getTarget('a[href="#demonstration-edit"]', me.el, true)) {
                ev.stopEvent();
                me.fireEvent('editdemonstrationclick', me, parseInt(targetEl.getAttribute('data-demonstration'), 10), ev, targetEl);
            } else if (targetEl = ev.getTarget('a[href="#demonstration-delete"]', me.el, true)) {
                ev.stopEvent();
                me.fireEvent('deletedemonstrationclick', me, parseInt(targetEl.getAttribute('data-demonstration'), 10), ev, targetEl);
            }

        }, me, { delegate: '.skill-grid-demo-row, a[href="#demonstration-edit"], a[href="#demonstration-delete"]' });

        me.mon(Ext.GlobalEvents, 'resize', function() {
            me.center();
        });

        if (me.getSkill() && me.getStudent()) {
            me.loadDemonstrationsTable();
        }
    },


    // config handlers
    updateSkill: function() {
        if (this.rendered) {
            this.loadDemonstrationsTable();
        }
    },

    updateStudent: function() {
        if (this.rendered) {
            this.loadDemonstrationsTable();
        }
    },


    // public methods
    loadDemonstrationsTable: function(forceReload) {
        var me = this,
            skillStatementCmp = me.skillStatementCmp,
            demonstrationsTable = me.demonstrationsTable,
            skillId = me.getSkill(),
            studentId = me.getStudent();

        // skip load if neither skill or student has changed
        if (!forceReload && skillId == me.loadedSkillId && studentId == me.loadedStudentId) {
            return;
        }

        me.loadedSkillId = skillId;
        me.loadedStudentId = studentId;

        if (skillId && studentId) {
            demonstrationsTable.setLoading('Loading demonstrations&hellip;'); // currently not visible due to (fixed in 5.1) http://www.sencha.com/forum/showthread.php?290453-5.0.x-loadmask-on-component-inside-window-not-visible

            Slate.cbl.API.getDemonstrationsByStudentSkill(studentId, skillId, function(skillDemonstrations, responseData) {
                skillStatementCmp.update((responseData.skill && responseData.skill.Statement) || '');

                skillDemonstrations.sort(function compare(a, b) {
                    var aDemonstrated = new Date(a.Demonstration.Demonstrated),
                        bDemonstrated = new Date(b.Demonstration.Demonstrated);

                    return (aDemonstrated > bDemonstrated) ? 1 : (aDemonstrated < bDemonstrated) ? -1 : 0;
                });

                me.demonstrations = skillDemonstrations;
                me.loadedSkillData = responseData.skill;
                me.refreshDemonstrationsTable();

                demonstrationsTable.setLoading(false);
            });
        } else {
            skillStatementCmp.update('Select a standard');

            me.demonstrations = null;
            me.loadedSkillData = null;
            me.refreshDemonstrationsTable();
        }
    },

    refreshDemonstrationsTable: function() {
        var me = this;

        me.demonstrationsTable.update({
            demonstrations: me.demonstrations || [],
            selectedDemonstrationId: me.getSelectedDemonstration(),
            showEditLinks: me.getShowEditLinks()
        });
    }
});