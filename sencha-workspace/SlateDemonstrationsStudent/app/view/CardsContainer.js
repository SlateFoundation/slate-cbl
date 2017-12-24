Ext.define('SlateDemonstrationsStudent.view.CardsContainer', {
    extend: 'Ext.container.Container',
    xtype: 'slate-demonstrations-student-cardsct',
    requires: [
        'SlateDemonstrationsStudent.view.CompetencyCard'
    ],


    config: {
        autoEl: {
            tag: 'ul',
            cls: 'cbl-competency-panels'
        },
        defaults: {
            xtype: 'slate-demonstrations-student-competencycard',
            autoEl: 'li'
        },
        layout: 'container'
    }
});