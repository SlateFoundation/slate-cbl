/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.view.teacher.demonstration.CompetencyCard', {
    extend: 'Ext.panel.Panel',
    xtype: 'slate-cbl-teacher-demonstration-competencycard',
    requires: [
        'Slate.cbl.field.LevelSlider'
    ],

    padding: '16 75',
    layout: 'anchor',
    bodyStyle: {
        background: 'transparent',
        border: 0
    },
    defaultType: 'slate-cbl-levelsliderfield',
    defaults: {
        labelAlign: 'top',
        anchor: '100%'
        // labelWidth: 150
    },
    dockedItems: [{
        itemId: 'competencyDescription',
        dock: 'top',

        xtype: 'component',
        margin: '5 0 20',
        tpl: [
            '<h4 class="competency-descriptor">{Descriptor}</h4>',
            '<blockquote class="competency-statement">{Statement}</blockquote>'
        ]
    }]
});