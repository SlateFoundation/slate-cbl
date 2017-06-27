Ext.define('SlateDemonstrationsTeacher.model.StudentGroup', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'ID'
    }, {
        name: 'Code'
    }, {
        name: 'Handle'
    }, {
        name: 'Class'
    }, {
        name: 'Title'
    }, {
        name: 'Name'
    }, {
        name: 'Type',
        depends: ['Class'],
        calculate: function(data) {
            return data.Class.split(/\\+/).pop();
        }
    }, {
        name: 'DisplayName',
        depends: ['Title', 'Name'],
        calculate: function(data) {
            return data.Title || data.Name;
        }
    }],

    // generate compound IDs
    statics: {
        getIdFromData: function(data) {
            return data.Class.split(/\\+/).pop().toLowerCase() + '-' + data.ID;
        }
    },

    constructor: function(data) {
        data.id = this.self.getIdFromData(data);
        this.callParent(arguments);
    },

    getIdentifier: function() {
        var me = this,
            type = me.get('Type').toLowerCase();

        return type + ' ' + me.get(type == 'section' ? 'Code' : 'Handle');
    }
});