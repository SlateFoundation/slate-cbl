/*jslint browser: true, undef: true *//*global Ext*/
/**
 * TODO:
 * - Use Slate.model.Person from future slate-core package
 */
Ext.define('Slate.cbl.model.Student', {
    extend: 'Ext.data.Model',

    idProperty: 'ID',
    fields: [
        { name: 'ID', type: 'int' },
        { name: 'FirstName', type: 'string'},
        { name: 'LastName', type: 'string'},
        { name: 'Username', type: 'string'},
        {
            name: 'FullName',
            convert: function(v, r) {
                return v || r.getFullName();
            }
        }
    ],

    // model methods
    getFullName: function() {
        return this.get('FirstName') + ' ' + this.get('LastName');
    },

    getDisplayName: function() {
        var me = this,
            firstName = me.get('FirstName'),
            lastName = me.get('LastName'),
            email = me.get('Email'),
            id = me.get('ID');

        if (firstName && lastName) {
            return firstName + ' '+ lastName;
        } else if(firstName) {
            return firstName;
        } else if(email) {
            return email;
        } else {
            return 'Person #'+id;
        }
    }
});