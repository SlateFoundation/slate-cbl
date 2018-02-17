/**
 * TODO: migrate to proper field
 */

Ext.define('Slate.cbl.field.attachments.Field', {
    extend: 'Slate.ui.form.ContainerField',
    xtype: 'slate-cbl-attachments-field',
    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',

        'Slate.cbl.field.attachments.Attachment',
        'Slate.cbl.field.attachments.Link'
    ],


    config: {
        fieldLabel: 'Attachments',

        attachmentTypes: [
            'Slate.cbl.field.attachments.Link'
        ]
    },


    items: [
        {
            itemId: 'toolbar',

            xtype: 'toolbar',
            items: [
                {
                    xtype: 'button',
                    action: 'add-link',
                    text: 'Add Link'
                }
            ]
        },
        {
            itemId: 'list',

            xtype: 'container',
            componentCls: 'slate-cbl-attachments-list',
            autoEl: 'ul',
            defaults: {
                xtype: 'slate-cbl-attachments-attachment',
                autoEl: 'li'
            },
            layout: 'container',
            items: [
                {
                    title: 'Attachment 1'
                },
                {
                    xtype: 'slate-cbl-attachments-link',
                    title: 'Attachment 2',
                    url: 'http://example.org/whatever2'
                }
            ]
        }
    ],


    // config handlers
    applyAttachmentTypes: function(types) {
        var length, i = 0, type;

        types = Ext.Array.from(types);
        length = types.length;

        for (; i < length; i++) {
            type = types[i];

            if (typeof type == 'string') {
                types[i] = Ext.ClassManager.get(type);
            }
        }

        return types;
    },


    // component lifecycle
    initEvents: function() {
        var me = this,
            listCt = me.getComponent('list');

        me.callParent();

        listCt.on({
            scope: me,
            add: 'onListAdd',
            remove: 'onListRemove'
        });

        listCt.items.each(function(listItem) {
            me.onListAdd(listCt, listItem);
        });
    },


    // event handers
    onListAdd: function(listCt, listItem) {
        // listItem.on({
        //     scope: this,
        //     editclick: 'onItemEditClick',
        //     removeclick: 'onItemRemoveClick'
        // });
    },

    onListRemove: function(listCt, listItem) {
        // listItem.un({
        //     scope: this,
        //     editclick: 'onItemEditClick',
        //     removeclick: 'onItemRemoveClick'
        // });
    },

    // onItemEditClick: function(listItem) {
    // },

    // onItemRemoveClick: function(listItem) {
    // }
});