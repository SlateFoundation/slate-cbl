Ext.define('Slate.cbl.widget.CommentsField', {
    extend: 'Ext.form.FieldContainer',
    requires: [
        'Ext.form.field.TextArea',
        'Ext.button.Button'
    ],

    xtype: 'slate-commentsfield',
    config: {
        record: null,
        readOnly: false
    },

    fieldLabel: 'Comments',

    items: [{
        xtype: 'component',
        itemId: 'comments-list',
        tpl: [
            '<tpl if="values && values.length">',
                '<div class="slate-task-comments-ct">',
                    // '<h4 class="slate-task-comments-heading">Comments</h4>', // redundant?
                    '<ul class="slate-task-comments">',
                        '<tpl for=".">',
                            '<li class="slate-task-comment">',
                                '<div class="slate-task-comment-date">{[Ext.Date.format(new Date(values.Created * 1000), "M d, Y")]}</div>',
                                '<div class="slate-task-comment-text">{Message}</div>',
                            '</li>',
                        '</tpl>',
                    '</ul>',
                '</div>',
            '</tpl>'
        ]
    }, {
        xtype: 'textareafield',
        name: 'Comment',
        listeners: {
            change: function() {
                var me = this,
                    button = me.next('button');

                if (me.getValue()) {
                    button.show();
                } else {
                    button.hide();
                }
            }
        }
    }, {
        xtype: 'button',
        text: 'Submit',
        hidden: true,
        action: 'publish',
        handler: function() {
            var me = this,
                fieldContainer = me.up('slate-commentsfield'),
                commentField = me.prev('textareafield');

                fieldContainer.fireEvent('publish', fieldContainer, commentField, me);
        }
    }],

    updateRecord: function(record) {
        var me = this,
            list = me.down('component');

        list.update(record.get('Comments'));
    },

    updateReadOnly: function(readOnly) {
        var me = this,
            field;

        if (!me.rendered) {
            me.on('render', function() {
                me.updateReadOnly(readOnly);
            }, null, { single: true });
            return;
        }

        field = me.down('textareafield');

        field.setReadOnly(readOnly);
    }
})