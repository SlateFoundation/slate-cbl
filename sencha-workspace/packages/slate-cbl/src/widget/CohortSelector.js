Ext.define('Slate.cbl.widget.CohortSelector', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'slate-cohort-selector',
    componentCls: 'slate-cohort-selector',

    fieldLabel: 'Section Cohort',
    labelWidth: 120,

    displayField: 'Cohort',
    valueField: 'Cohort',

    forceSelection: true,
    editable: false,

    matchFieldWidth: false,
    listConfig: {
        maxWidth: 512,
        minWidth: 256
    }
});