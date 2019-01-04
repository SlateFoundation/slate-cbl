/**
 * A pluggable field for managing a list of attachments
 */
Ext.define('Slate.cbl.field.attachments.Field', {
    extend: 'Slate.ui.form.ContainerField',
    xtype: 'slate-cbl-attachmentsfield',
    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.form.field.Display',

        /* global Slate */
        'Slate.cbl.data.field.Attachments',
        'Slate.cbl.field.attachments.Attachment',
        'Slate.cbl.field.attachments.Link',
        'Slate.cbl.field.attachments.GoogleDriveFile' // TODO: move to slate-cbl-gdrive plugin
    ],


    config: {
        attachmentTypes: [
            'Slate.cbl.field.attachments.Link',
            'Slate.cbl.field.attachments.GoogleDriveFile' // TODO: move to slate-cbl-gdrive plugin
        ],
        toolbar: true,

        fieldLabel: 'Attachments'
    },


    componentCls: 'slate-cbl-attachmentsfield',
    items: [
        {
            itemId: 'placeholder',

            xtype: 'displayfield',
            hidden: true,
            value: 'none'
        },
        {
            itemId: 'list',

            xtype: 'container',
            hidden: true,
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

        toolbar = me.getToolbar();

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

    applyToolbar: function(toolbar, oldToolbar) {
        if (!toolbar || typeof toolbar == 'boolean') {
            toolbar = {
                hidden: !toolbar
            };
        }

        return Ext.factory(toolbar, 'Ext.toolbar.Toolbar', oldToolbar);
    },

    updateReadOnly: function(readOnly) {
        this.callParent(arguments);
        this.setToolbar(!readOnly);
    },


    // component lifecycle
    initItems: function() {
        var me = this,
            toolbar = me.getToolbar();

        me.callParent();

        me.listCt = me.getComponent('list');
        me.placeholderCmp = me.getComponent('placeholder');

        toolbar.add(me.buildToolbarItemConfigs());
        me.insert(0, toolbar);
    },

    initEvents: function() {
        var me = this,
            listCt = me.listCt;

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
    initValue: function() {
        var me = this;

        if (!me.value) {
            me.value = [];
        }

        me.valueItemsMap = {};

        me.callParent(arguments);

        me.refreshVisibility();
    },

    normalizeValue: function(value) {
        var normalValue = [],
            length = value ? value.length : 0,
            i = 0, itemValue;

        for (; i < length; i++) {
            itemValue = Ext.apply({}, value[i]);
            delete itemValue.Created;
            delete itemValue.CreatorID;
            normalValue.push(itemValue);
        }

        return normalValue;
    },

    setValue: function(value) {
        var me = this,
            listCt = me.listCt,
            valueItemsMap = me.valueItemsMap = {},
            length = value ? value.length : 0,
            i = 0, itemValue, itemClass, Attachment, attachmentItem;

        // clone value to normalized array
        value = me.normalizeValue(value);

        // update value and items map while loading into UI
        me.value = value;

        Ext.suspendLayouts();
        ++me.suspendCheckChange;
        listCt.removeAll();

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

        me.refreshVisibility();

        --me.suspendCheckChange;
        Ext.resumeLayouts(true);

        // trigger change events if value differs from lastValue
        me.checkChange();

        // ensure lastValue and value always reference same instance
        me.lastValue = value;

        return me;
    },

    resetOriginalValue: function() {
        var me = this;

        // use clone from normalizeValue to isolate from updates
        me.originalValue = me.normalizeValue(me.getValue());
        me.checkDirty();
    },

    isEqual: function(value1, value2) {
        return Slate.cbl.data.field.Attachments.prototype.isEqual(value1, value2);
    },


    // event handers
    onListAdd: function(listCt, attachmentItem) {
        var me = this,
            itemValue = attachmentItem.getValue();

        me.valueItemsMap[attachmentItem.getId()] = itemValue;

        attachmentItem.on({
            scope: me,
            change: 'onAttachmentChange',
            remove: 'onAttachmentRemove'
        });

        me.refreshVisibility();
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
            change: 'onAttachmentChange',
            remove: 'onAttachmentRemove'
        });

        me.validate();
        me.checkDirty();
        me.refreshVisibility();
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

        me.validate();
        me.checkDirty();
    },

    onAttachmentRemove: function(attachmentItem) {
        var itemValue = attachmentItem.getValue(),
            existingValue = this.valueItemsMap[attachmentItem.getId()];

        if (itemValue.Status == 'removed' && !existingValue.ID) {
            attachmentItem.destroy();
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

    refreshVisibility: function() {
        var me = this,
            isReadOnly = me.getReadOnly(),
            isEmpty = me.value.length == 0;

        Ext.suspendLayouts();

        me.listCt.setHidden(isEmpty && isReadOnly);
        me.placeholderCmp.setHidden(!isEmpty || !isReadOnly);

        Ext.resumeLayouts(true);
    },

    addAttachment: function(attachment) {
        var me = this,
            attachmentItem = me.listCt.add(attachment);

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