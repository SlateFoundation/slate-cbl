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


    // containerfield lifecycle
    normalizeValue: function(value) {
        var normalValue = [],
            length = value ? value.length : 0,
            i = 0;

        for (; i < length; i++) {
            normalValue.push(Ext.apply({}, value[i]));
        }

        return normalValue;
    },

    setValue: function(value) {
        return this.callParent([this.normalizeValue(value)]);
    },

    resetOriginalValue: function() {
        var me = this;

        // use clone from normalizeValue to isolate from updates
        me.originalValue = me.normalizeValue(me.getValue());
        me.checkDirty();
    },

    isEqual: function(value1, value2) {
        var length, i = 0;

        if (value1 === value2) {
            return true;
        }

        if (!value1 && !value2) {
            return true;
        }

        if (!value1 || !value2) {
            return false;
        }

        length = value1.length;
        if (length !== value2.length) {
            return false;
        }

        for (; i < length; i++) {
            if (!Ext.Object.equals(value1[i], value2[i])) {
                return false;
            }
        }

        return true;
    },

    onChange: function(value) {
        var me = this,
            listCt = me.getComponent('list'),
            valueItemsMap = me.valueItemsMap = {},
            length = value ? value.length : 0,
            i = 0, itemValue, itemClass, Attachment, attachmentItem;

        Ext.suspendLayouts();
        listCt.removeAll();

        // TODO: remove all attachments in list and rebuild
        for (; i < length; i++) {
            itemValue = value[i];
            itemClass = itemValue.Class;

            if (
                itemClass
                && (Attachment = me.getAttachmentTypeByClass(itemClass))
            ) {
                attachmentItem = listCt.add(new Attachment());
                attachmentItem.setValue(itemValue);
                valueItemsMap[attachmentItem.getId()] = itemValue;
            }
        }

        Ext.resumeLayouts(true);

        return me.callParent([value]);
    },


    // event handers
    onListAdd: function(listCt, attachmentItem) {
        var me = this,
            itemValue = attachmentItem.getValue();

        me.valueItemsMap[attachmentItem.getId()] = itemValue;

        attachmentItem.on({
            scope: me,
            change: 'onAttachmentChange'
        });
    },

    onListRemove: function(listCt, attachmentItem) {
        var me = this,
            valueItemsMap = me.valueItemsMap,
            itemId = attachmentItem.getId(),
            itemValue = valueItemsMap[itemId];

        if (itemValue) {
            delete valueItemsMap[itemId];
            Ext.Array.remove(me.value, itemValue);
        }

        attachmentItem.un({
            scope: me,
            change: 'onAttachmentChange'
        });

        me.validate();
        me.checkDirty();
    },

    onAttachmentChange: function(attachmentItem) {
        var me = this,
            itemId = attachmentItem.getId(),
            itemValue = attachmentItem.getValue(),
            valueItemsMap = me.valueItemsMap,
            existingValue = valueItemsMap[itemId];

        if (existingValue) {
            Ext.apply(existingValue, itemValue);
        } else {
            valueItemsMap[itemId] = itemValue;
            me.value.push(itemValue);
        }
    },


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
        var me = this,
            attachmentItem = me.getComponent('list').add(attachment);

        me.value.push(me.valueItemsMap[attachmentItem.getId()]);

        me.validate();
        me.checkDirty();

        return attachmentItem;
    },

    getAttachmentTypeByClass: function(recordClass) {
        var types = this.getAttachmentTypes(),
            length = types.length,
            i = 0, type;

        for (; i < length; i++) {
            type = types[i];

            if (type.recordClass == recordClass) {
                return type;
            }
        }

        return null;
    }
});