Ext.define('Slate.cbl.view.modals.Modals', {
    extend: 'Ext.Container',
    xtype: 'slate-modals',

    layout: {
        type: 'vbox',
        align: 'center'
    },

    margin: '16 16 0',

    defaults: {
        xtype: 'button',
        scale: 'large',
        margin: '0 0 16'
    },

    items: [
        {
            text: 'Create Task',
            handler: function() {
                Ext.create('Slate.cbl.view.modals.CreateTask').show();
            }
        },
        {
            text: 'Rate Task',
            handler: function() {
                Ext.create('Slate.cbl.view.modals.RateTask').show();
            }
        },
        {
            text: 'Assign Later',
            handler: function() {
                Ext.create('Slate.cbl.view.modals.AssignLater').show();
            }
        }
    ]
});