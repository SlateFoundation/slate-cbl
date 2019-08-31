Ext.define('Slate.cbl.field.StudentSelector', {
    extend: 'Slate.cbl.field.ClearableSelector',
    xtype: 'slate-cbl-studentselector',
    requires: [
        'Slate.model.person.Person'
    ],


    config: {
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
                if (queryPlan.combo.queryMode == 'local') {
                    return true;
                }

                if (queryPlan.query.length < 2 && !queryPlan.forceAll) {
                    return false;
                }

                return true;
            }
        }
    },


    componentCls: 'slate-cbl-studentselector',
    store: {
        model: 'Slate.model.person.Person',
        pageSize: 0,
        remoteSort: false,
        sorters: [{
            property: 'SortName',
            direction: 'ASC'
        }],
        proxy: {
            type: 'slate-people',
            url: '/people/*students',
            summary: true
        }
    }
});