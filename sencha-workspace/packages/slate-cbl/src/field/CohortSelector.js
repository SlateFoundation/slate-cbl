Ext.define('Slate.cbl.field.CohortSelector', {
    extend: 'Slate.cbl.field.ClearableSelector',
    xtype: 'slate-cbl-cohortselector',


    config: {
        componentCls: 'slate-cbl-cohortselector',

        fieldLabel: 'Section Cohort',
        labelWidth: 120,

        displayField: 'Cohort',
        valueField: 'Cohort',
        forceSelection: true,
        editable: false,
        matchFieldWidth: false
    }
});