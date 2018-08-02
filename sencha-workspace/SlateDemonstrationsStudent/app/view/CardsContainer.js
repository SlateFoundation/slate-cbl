Ext.define('SlateDemonstrationsStudent.view.CardsContainer', {
    extend: 'Ext.container.Container',
    xtype: 'slate-demonstrations-student-cardsct',
    requires: [
        'SlateDemonstrationsStudent.view.CompetencyCard'
    ],


    autoEl: 'ul',
    componentCls: 'slate-demonstrations-student-cardsct',
    defaults: {
        xtype: 'slate-demonstrations-student-competencycard',
        autoEl: 'li'
    },
    layout: 'container'
});