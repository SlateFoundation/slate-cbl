Ext.define('Slate.cbl.widget.StudentSelector', {
    extend: 'Slate.cbl.widget.ClearableSelector',
    xtype: 'slate-cbl-studentselector',
    requires: [
        'Slate.model.person.Person'
    ],


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
            summary: true
        }
    },

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
                if (queryPlan.combo.queryMode == 'local') {
                    return true;
                }

                if (queryPlan.query.length < 2 && !queryPlan.forceAll) {
                    return false;
                }

                queryPlan.query += ' class:student';

                return true;
            }
        }
    }
});