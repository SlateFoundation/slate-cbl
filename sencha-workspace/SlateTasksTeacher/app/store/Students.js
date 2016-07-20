/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksTeacher.store.Students', {
    extend: 'Slate.cbl.store.Students',
    requires: [
        'Slate.proxy.Records'
    ],

    config: {
        proxy: {
            type: 'slate-records',
            limitParam: false,
            startParam: false
        },
        sorters: [{
            property: 'LastName',
            direction: 'ASC'
        },{
            property: 'FirstName',
            direction: 'ASC'
        }]
    },

    onProxyLoad: function() {
        this.studentIdStrings = null;
        this.callParent(arguments);
    },

    getStudentIdStrings: function() {
        var me = this,
            studentIdStrings = me.studentIdStrings,
            studentsLength, i = 0;

        if (!studentIdStrings) {
            studentIdStrings = [];
            studentsLength = me.getCount();

            for (; i < studentsLength; i++) {
                studentIdStrings.push(me.getAt(i).getId().toString());
            }

            me.studentIdStrings = studentIdStrings;
        }

        return studentIdStrings;
    }
});