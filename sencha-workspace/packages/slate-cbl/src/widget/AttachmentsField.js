/**
 * TODO: migrate to proper field
 */

Ext.define('Slate.cbl.widget.AttachmentsField', {
    extend: 'Ext.form.FieldContainer',
    requires: [
        'Slate.cbl.view.AttachmentsList',
        'Slate.cbl.util.Google'
    ],

    xtype: 'slate-tasks-attachmentsfield',

    config: {
        readOnly: false
    },

    initComponent: function() {
        var me = this,
            googleUtil = Slate.cbl.util.Google,
            googleAttachmentBtn;

        me.callParent(arguments);

        googleAttachmentBtn = me.down('button[action=addattachment]');
        if (googleUtil.getDeveloperKey() && googleUtil.getClientId() && googleUtil.getDomain()) {
            googleAttachmentBtn.enable();
        } else {
            googleAttachmentBtn.disable();
        }
    },

    fieldLabel: 'Attachments',
    combineErrors: false,
    items: [{
        xtype: 'textfield',
        emptyText: 'Enter URL',
        width: '100%',
        vtype: 'url',
        keyHandlers: {
            ENTER: function() {
                this.up('slate-tasks-attachmentsfield').addLinkAttachment();
            }
        }
    },
    {
        xtype: 'slate-attachmentslist',
        margin: '0 0 8'
    },
    {
        xtype: 'button',
        text: 'Add Link',
        margin: '0 8 0 0',
        action: 'addlink',
        listeners: {
            click: function() {
                this.up('slate-tasks-attachmentsfield').addLinkAttachment();
            }
        }
    },
    {
        xtype: 'button',
        text: 'Add From Drive',
        action: 'addattachment',
        listeners: {
            click: function() {
                return this.up('slate-tasks-attachmentsfield').fireEvent('addgoogleattachment', this);
            }
        }
    }],

    updateReadOnly: function(readOnly) {
        var me = this,
            field, buttons, list,
            i = 0;

        readOnly = Boolean(readOnly);

        if (!me.rendered) {
            me.on('render', function() {
                return me.updateReadOnly(readOnly);
            }, me, { single: true });
            return;
        }

        field = me.down('textfield');
        buttons = me.query('button');
        list = me.down('slate-attachmentslist');

        for (; i < buttons.length; i++) {
            buttons[i][readOnly ? 'hide' : 'show']();
        }

        list.setEditable(!readOnly);
        list.refreshView();

        field[readOnly ? 'hide' : 'show']();

    },

    addLinkAttachment: function(url) {
        var me = this,
            field = me.down('textfield'),
            value = url || field.getValue();

        if (value && field.validate()) {
            me.setAttachments({
                URL: value
            }, true);
            field.setValue('');
        }
    },

    getAttachments: function(returnRecords) {
        var me = this,
            list = me.down('slate-attachmentslist'),
            store = list.getStore();

        if (returnRecords === false) {
            return Ext.Array.map(store.getRange(), function(s) {
                return s.getData();
            });
        }
        return store.getRange();
    },

    setAttachments: function(attachments, append) {
        var me = this,
            list = me.down('slate-attachmentslist'),
            store = list.getStore();

        if (append !== true) {
            store.removeAll();
        }
        store.add(attachments);
    }

});
