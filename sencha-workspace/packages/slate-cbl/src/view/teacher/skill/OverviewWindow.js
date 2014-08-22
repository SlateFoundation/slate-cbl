/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.view.teacher.skill.OverviewWindow', {
    extend: 'Ext.window.Window',
    xtype: 'slate-cbl-teacher-skill-overviewwindow',
    requires: [
        'Slate.cbl.view.teacher.skill.OverviewWindowController',
//        'Slate.cbl.model.Demonstration',
//        'Slate.cbl.model.Skill',
//        'Slate.cbl.field.LevelSlider',
//
//        'Ext.layout.container.Fit',
//        'Ext.form.Panel',
        'Ext.tab.Panel',
//        'Ext.form.field.Text',
//        'Ext.form.field.TextArea',
        'Ext.form.field.ComboBox',
//        'Ext.form.field.Checkbox',
        'Ext.data.ChainedStore'
    ],
    
    controller: 'slate-cbl-teacher-skill-overviewwindow',
    
    config: {
        student: null,
        competency: null,
        skill: null
    },

    title: 'Skill Overview',
    width: 700,
    minWidth: 700,
    // constrainHeader: true,
    autoScroll: true,

    dockedItems: [
        {
            dock: 'top',

            xtype: 'toolbar',
            items: [
                'Competency:',
                {
                    reference: 'competencyCombo',
                    flex: 1,
        
                    xtype: 'combobox',
        
                    store: {
                        type: 'chained',
                        source: 'cbl-competencies'
                    },
                    queryMode: 'local',
                    displayField: 'Descriptor',
                    valueField: 'Code',
        
                    forceSelection: true
                },
                'Skill:',
                {
                    reference: 'skillCombo',
                    flex: 1,
        
                    xtype: 'combobox',
        
                    store: {
                        model: 'Slate.cbl.model.Skill'
                    },
                    queryMode: 'local',
                    displayField: 'Descriptor',
                    valueField: 'ID',
        
                    forceSelection: true
                }
            ]
        },
        {
            dock: 'top',
            
            xtype: 'toolbar',
            items: [
                {
                    flex: 1,

                    reference: 'studentCombo',
                    xtype: 'combobox',
                    emptyText: 'Start typing student\'s name',
        
                    store: {
                        type: 'chained',
                        source: 'cbl-students'
                    },
                    queryMode: 'local',
                    displayField: 'FullName',
                    valueField: 'ID',
        
                    forceSelection: true,
                    autoSelect: true
                }
            ]
        },
        {
            dock: 'bottom',
            xtype: 'toolbar',
            items: [
                {
                    xtype: 'button',
                    action: 'override',
                    text: 'Override'
                },
                '->',
                {
                    xtype: 'button',
                    action: 'demonstration-create',
                    text: 'Log a Demonstration'
                }
            ]
        }
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
                                '<td class="skill-grid-demo-data skill-grid-demo-level"><div class="cbl-level-{Level}">{Level}</div></td>',
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
                                                '<a href="{Demonstration.ArtifactURL:htmlEncode}">{Demonstration.ArtifactURL:htmlEncode}</a>',
                                            '</div>',
                                        '</tpl>',
                                        '<tpl if="Demonstration.Comments">',
                                            '<div class="skill-grid-demo-comments">',
                                                '<strong>Comments: </strong>',
                                                '{[this.escapeAndNewline(values.Demonstration.Comments)]}',
                                            '</div>',
                                        '</tpl>',
                                        '<div class="skill-grid-demo-meta">',
                                            'Reported',
                                            '<tpl for="Demonstration.Creator"> by <a href="/people/{Username}">{FirstName} {LastName}</a></tpl>',
                                            ' on {[fm.date(new Date(values.Demonstration.Created * 1000), "F j, Y, g:i a")]}',
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
    ],

    listeners: {
        scope: 'this',
        click: {
            fn: 'onGridClick',
            element: 'el',
            delegate: '.skill-grid-demo-row'
        }
    },

    applyStudent: function(student) {
        return student ? Ext.getStore('cbl-students').getById(student) : null;
    },

    applyCompetency: function(competency) {
        return competency ? Ext.getStore('cbl-competencies').getById(competency) : null;
    },

    applySkill: function(skill) {
        if (Ext.isString(skill)) {
            skill = parseInt(skill, 10);
        }
        
        return skill ? skill : null;
    },

    onGridClick: function(ev, t) {
        var me = this,
            targetEl;

        if (targetEl = ev.getTarget('.skill-grid-demo-row', me.el, true)) {
            me.fireEvent('demorowclick', me, ev, targetEl);
        }
    }
});