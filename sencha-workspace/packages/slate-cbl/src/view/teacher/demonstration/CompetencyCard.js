/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.view.teacher.demonstration.CompetencyCard', {
    extend: 'Ext.container.Container',
    xtype: 'slate-cbl-teacher-demonstration-competencycard',
    requires: [
        'Slate.cbl.field.LevelSlider'
    ],

    padding: '16 75',
    layout: 'anchor',
    defaultType: 'slate-cbl-levelsliderfield',
    defaults: {
        labelAlign: 'top',
        anchor: '100%'
        // labelWidth: 150
    }
});