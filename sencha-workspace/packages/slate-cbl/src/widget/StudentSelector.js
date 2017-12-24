Ext.define('Slate.cbl.widget.StudentSelector', {
    extend: 'Slate.cbl.widget.ClearableSelector',
    xtype: 'slate-cbl-studentselector',


    config: {
        componentCls: 'slate-cbl-studentselector',

        fieldLabel: 'Student',
        labelWidth: 70,

        displayField: 'SortName',
        valueField: 'Username',
        queryParam: 'q',
        forceSelection: true,
        autoSelect: false,
        matchFieldWidth: false,

        listeners: {
            beforequery: function (queryPlan) {
                if (queryPlan.query.length < 2 && !queryPlan.forceAll) {
                    return false;
                }

                queryPlan.query += ' class:student';
            }
        }
    }
});