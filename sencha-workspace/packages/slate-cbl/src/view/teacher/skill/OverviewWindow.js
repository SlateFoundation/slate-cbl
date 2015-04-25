/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.view.teacher.skill.OverviewWindow', {
    extend: 'Slate.cbl.view.standard.AbstractOverviewWindow',
    xtype: 'slate-cbl-teacher-skill-overviewwindow',
    requires: [
        'Slate.cbl.view.teacher.skill.OverviewWindowController',
        'Slate.cbl.model.Skill',

        'Ext.form.field.ComboBox',
        'Ext.data.ChainedStore'
    ],

    controller: 'slate-cbl-teacher-skill-overviewwindow',

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
                    valueField: 'ID',

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

//    listeners: {
//        scope: 'this',
//        click: {
//            fn: 'onGridClick',
//            element: 'el',
//            delegate: '.skill-grid-demo-row, a[href="#demonstration-edit"]'
//        }
//    },
//
//    onGridClick: function(ev, t) {
//        var me = this,
//            targetEl;
//
//        if (targetEl = ev.getTarget('.skill-grid-demo-row', me.el, true)) {
//            me.fireEvent('demorowclick', me, ev, targetEl);
//        } else if (targetEl = ev.getTarget('a[href="#demonstration-edit"]', me.el, true)) {
//            ev.stopEvent();
//            me.fireEvent('editdemonstrationclick', me, parseInt(targetEl.getAttribute('data-demonstration'), 10), ev, targetEl);
//        }
//    }
});
