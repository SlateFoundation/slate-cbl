/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.view.student.skill.OverviewWindow', {
    extend: 'Ext.window.Window',
    xtype: 'slate-cbl-student-skill-overviewwindow',
    requires: [
        'Slate.cbl.view.student.skill.OverviewWindowController',
        'Slate.cbl.model.Skill',

        'Ext.form.field.ComboBox',
        'Ext.data.ChainedStore'
    ],

    controller: 'slate-cbl-student-skill-overviewwindow',

    config: {
        student: null,
        competency: null,
        skill: null
    },

    title: 'Standard Overview',
    width: 700,
    minWidth: 700,
    shadow: 'frame',
    center: true,
    fixed: true,
    monitorResize: true,
    modal: true,

    dockedItems: [
        {
            dock: 'top',

            xtype: 'toolbar',
            items: [
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
            delegate: '.skill-grid-demo-row'
        }
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
