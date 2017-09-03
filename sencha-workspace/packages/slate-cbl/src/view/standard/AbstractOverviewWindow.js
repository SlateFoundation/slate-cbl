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
        'Slate.cbl.API',
        'Slate.cbl.model.Skill',
        'Slate.cbl.store.DemonstrationSkills',

        'Ext.LoadMask'
    ],

    config: {
        // required input
        skill: null,
        student: null,

        // optional config
        selectedDemonstration: null,
        showEditLinks: false,
        loadingText: 'Loading demonstrations&hellip;',

        demonstrationSkillsStore: {
            xclass: 'Slate.cbl.store.DemonstrationSkills',
            sorters: 'Demonstrated'
        },

        // internal state
        loadedSkill: null
    },

    title: 'Standard Overview',
    width: 700,
    minWidth: 700,

    items: [
        {
            reference: 'skillStatement',

            xtype: 'component',
            autoEl: 'p',
            padding: '5 50 0'
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
                            '<th class="skill-grid-header skill-grid-demo-level">Rating</th>',
                            '<th class="skill-grid-header skill-grid-demo-experience">Experience Type</th>',
                            '<th class="skill-grid-header skill-grid-demo-context">Experience Name</th>',
                            '<th class="skill-grid-header skill-grid-demo-task">Performance&nbsp;Task</th>',
                        '</tr>',
                    '</thead>',

                    '<tpl if="demonstrations && demonstrations.length">',
                        '<tpl for="demonstrations">',
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
                targetEl.toggleCls('is-expanded');
                targetEl.next('.skill-grid-demo-detail-row').toggleCls('is-shown');
                me.updateLayout();
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

        me.loadMask = Ext.create('Ext.LoadMask', {
            target: me.demonstrationsTable,
            store: me.getDemonstrationSkillsStore(),
            msg: me.getLoadingText()
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

    applyDemonstrationSkillsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateDemonstrationSkillsStore: function(store) {
        if (store) {
            store.on({
                scope: this,
                refresh: 'onDemonstrationSkillsStoreRefresh',
                clear: 'onDemonstrationSkillsStoreClear',
                remove: 'onDemonstrationSkillsStoreRemove'
            });
        }
    },

    applyLoadedSkill: function(skill) {
        if (!skill) {
            return null;
        }

        return skill.isModel ? skill : Slate.cbl.API.getSession().getRecord(Slate.cbl.model.Skill, skill);
    },

    updateLoadedSkill: function(skill) {
        var me = this,
            skillStatementCmp = me.skillStatementCmp;

        if (!skill) {
            skillStatementCmp.update('Select a standard');
            return;
        }

        if (skill.isLoading()) {
            // framework will append our callback to the existing operation if the model is already loading
            skill.load({
                callback: function() {
                    me.updateLoadedSkill(skill);
                }
            });
            return;
        }

        skillStatementCmp.update(skill.get('Statement'));
    },


    // event handlers
    onDemonstrationSkillsStoreRefresh: function() {
        this.refreshDemonstrationsTable();
    },

    onDemonstrationSkillsStoreClear: function() {
        this.setLoadedSkill(null);
        this.refreshDemonstrationsTable();
    },

    onDemonstrationSkillsStoreRemove: function() {
        this.refreshDemonstrationsTable();
    },


    // public methods
    loadDemonstrationsTable: function(forceReload) {
        var me = this,
            demonstrationSkillsStore = me.getDemonstrationSkillsStore(),
            skillId = me.getSkill(),
            studentId = me.getStudent();

        // skip load if neither skill or student has changed
        if (!forceReload && skillId == me.loadedSkillId && studentId == me.loadedStudentId) {
            return;
        }

        me.loadedSkillId = skillId;
        me.loadedStudentId = studentId;

        if (skillId && studentId) {
            demonstrationSkillsStore.load({
                params: {
                    student: studentId,
                    skill: skillId
                },
                callback: function(demonstrationSkills, operation, success) {
                    me.setLoadedSkill(skillId);
                }
            });
        } else {
            demonstrationSkillsStore.removeAll();
        }
    },

    refreshDemonstrationsTable: function() {
        var me = this;

        me.demonstrationsTable.update({
            demonstrations: Ext.pluck(me.getDemonstrationSkillsStore().getRange(), 'data'),
            selectedDemonstrationId: me.getSelectedDemonstration(),
            showEditLinks: me.getShowEditLinks()
        });
    }
});