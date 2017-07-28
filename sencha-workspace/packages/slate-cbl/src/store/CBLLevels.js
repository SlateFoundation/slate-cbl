Ext.define('Slate.cbl.store.CBLLevels', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.cbl.model.CBLLevel'
    ],

    model: 'Slate.cbl.model.CBLLevel',

    data: [{
        'level': 9,
        'label': 'L9',
        'color': 'pink',
        'description': null,
        'colorCode': '#d94181'
    }, {
        'level': 10,
        'label': 'L10',
        'color': 'orange',
        'description': null,
        'colorCode': '#ffa200'
    }, {
        'level': 11,
        'label': 'L11',
        'color': 'green',
        'description': null,
        'colorCode': '#5dc02a'
    }, {
        'level': 12,
        'label': 'L12',
        'color': 'blue',
        'description': null,
        'colorCode': '#008cc1'
    }]


});