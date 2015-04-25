/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.view.student.skill.OverviewWindow', {
    extend: 'Slate.cbl.view.standard.AbstractOverviewWindow',
    xtype: 'slate-cbl-student-skill-overviewwindow',
    requires: [
        'Slate.cbl.view.student.skill.OverviewWindowController',
        'Slate.cbl.model.Skill',

        'Ext.form.field.ComboBox'
    ],

    controller: 'slate-cbl-student-skill-overviewwindow',

    modal: true,
    shadow: 'frame',

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
    ]

//    listeners: {
//        scope: 'this',
//        click: {
//            fn: 'onGridClick',
//            element: 'el',
//            delegate: '.skill-grid-demo-row'
//        }
//    },
//
//    onGridClick: function(ev, t) {
//        var me = this,
//            targetEl;
//
//        if (targetEl = ev.getTarget('.skill-grid-demo-row', me.el, true)) {
//            me.fireEvent('demorowclick', me, ev, targetEl);
//        }
//    }
});