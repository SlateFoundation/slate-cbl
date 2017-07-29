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
    }, {
        name: 'Identifier',
        depends: ['Type', 'Code', 'Handle'],
        calculate: function(data) {
            var type = data.Type.toLowerCase();

            return type + ':' + data[type == 'section' ? 'Code' : 'Handle'];
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
        return this.get('Identifier');
    }
});