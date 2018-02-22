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

            xtype: 'toolbar'
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
            layout: 'container'
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

    updateAttachmentTypes: function(types) {
        var me = this,
            length = types.length,
            i = 0, buttonConfig, toolbar;

        if (!me.rendered) {
            return;
        }

        toolbar = me.getComponent('toolbar');

        Ext.suspendLayouts();
        toolbar.removeAll();

        for (; i < length; i++) {
            buttonConfig = types[i].buildButtonConfig(me);

            if (buttonConfig) {
                toolbar.add(buttonConfig);
            }
        }

        Ext.resumeLayouts(true);
    },


    // component lifecycle
    initItems: function() {
        this.callParent();
        this.getComponent('toolbar').add(this.buildToolbarItemConfigs());
    },

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


    // attachments-field methods
    buildToolbarItemConfigs: function() {
        var types = this.getAttachmentTypes(),
            length = types.length,
            i = 0,
            buttonConfigs = [],
            buttonConfig;

        for (; i < length; i++) {
            buttonConfig = types[i].buildButtonConfig(this);

            if (buttonConfig) {
                buttonConfigs.push(buttonConfig);
            }
        }

        return buttonConfigs;
    },

    addAttachment: function(attachment) {
        return this.getComponent('list').add(attachment);
    }
});