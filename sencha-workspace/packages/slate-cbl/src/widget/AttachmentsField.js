Ext.define('Slate.cbl.widget.AttachmentsField', {
    extend: 'Ext.form.FieldContainer',
    requires: [
        'Slate.cbl.view.AttachmentsList'
    ],

    xtype: 'slate-tasks-attachmentsfield',

    config: {
        readOnly: false
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
                this.up('slate-tasks-attachmentsfield').addAttachment();
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
                this.up('slate-tasks-attachmentsfield').addAttachment();
            }
        }
    },
    {
        xtype: 'button',
        text: 'Attachment',
        action: 'addattachment',
        disabled: true
    }],

    updateReadOnly: function(readOnly) {
        if (!this.rendered) {
            return this.on('render', function() {
                return this.updateReadOnly(readOnly);
            });
        }

        var me = this,
            field = me.down('textfield'),
            buttons = me.query('button'),
            list = me.down('slate-attachmentslist'),
            action = readOnly === undefined || !!readOnly;

        Ext.each(buttons, function(button) {
            button[action ? 'hide' : 'show']();
        });

        list.setEditable(!action);
        list.refreshView();

        field[action ? 'hide' : 'show']();
    },

    addAttachment: function(url) {
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
