Ext.define('Slate.cbl.view.modals.Modals', {
    extend: 'Ext.Container',
    xtype: 'slate-modals',
    requires: [ 'Slate.cbl.view.modals.*' ],

    layout: {
        type: 'vbox',
        align: 'center'
    },

    defaults: {
        xtype: 'button',
        scale: 'large',
        margin: 16
    },

    items: [
        {
            text: 'Create Task',
            handler: function() {
                Ext.create('Slate.cbl.view.modals.CreateTask').show();
            }
        }
    ]
});