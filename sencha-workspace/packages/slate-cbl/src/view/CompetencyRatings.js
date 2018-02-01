Ext.define('Slate.cbl.view.CompetencyRatings', {
    extend: 'Ext.container.Container',
    xtype: 'slate-cbl-competencyratings',


    tpl: [
        '<h4 class="competency-descriptor">{Descriptor}</h4>',
        '<blockquote class="competency-statement">{Statement}</blockquote>'
    ]
});