/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.view.teacher.skill.OverviewWindow', {
    extend: 'Ext.window.Window',
    xtype: 'slate-cbl-teacher-skill-overviewwindow',
    requires: [
        'Slate.cbl.view.teacher.skill.OverviewWindowController',
        'Slate.cbl.model.Skill',
        'Slate.cbl.view.skill.OverviewBody',
        'Ext.form.field.ComboBox',
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
                        source: 'cbl-competencies-loaded'
                    },
                    queryMode: 'local',
                    displayField: 'Descriptor',
                    valueField: 'Code',

                    forceSelection: true
                },
                'Standard:',
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
                        source: 'cbl-students-loaded'
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
          xtype: 'slate-cbl-skill-overviewbody'
        }
    ],

    listeners: {
        scope: 'this',
        click: {
            fn: 'onGridClick',
            element: 'el',
            delegate: '.skill-grid-demo-row, a[href="#demonstration-edit"],a[href="#demonstration-delete"]'
        }
    },

    applyStudent: function(student) {
        return student ? Ext.getStore('cbl-students-loaded').getById(student) : null;
    },

    applyCompetency: function(competency) {
        return competency ? Ext.getStore('cbl-competencies-loaded').getById(competency) : null;
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
        } else if (targetEl = ev.getTarget('a[href="#demonstration-edit"]', me.el, true)) {
            ev.stopEvent();
            me.fireEvent('editdemonstrationclick', me, parseInt(targetEl.getAttribute('data-demonstration'), 10), ev, targetEl);
        } else if (targetEl = ev.getTarget('a[href="#demonstration-delete"]', me.el, true)) {
            ev.stopEvent();
            me.fireEvent('deletedemonstrationclick', me, parseInt(targetEl.getAttribute('data-demonstration'), 10), ev, targetEl);
        }
    }
});