Ext.define('SlateModals.view.Modals', {
    extend: 'Ext.Container',
    xtype: 'slate-modals',

    requires: [
        'SlateModals.view.CreateTask',
        'SlateModals.view.RateTask',
        'SlateModals.view.AssignLater'
    ],

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
                Ext.create('SlateModals.view.CreateTask').show();
            }
        },
        {
            text: 'Rate Task',
            handler: function() {
                Ext.create('SlateModals.view.RateTask').show();
            }
        },
        {
            text: 'Assign Later',
            handler: function() {
                Ext.create('SlateModals.view.AssignLater').show();
            }
        }
    ]
});