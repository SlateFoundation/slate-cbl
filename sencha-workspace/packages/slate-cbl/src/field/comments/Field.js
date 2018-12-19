/**
 * A pluggable field for managing a list of attachments
 */
Ext.define('Slate.cbl.field.comments.Field', {
    extend: 'Slate.ui.form.ContainerField',
    xtype: 'slate-cbl-commentsfield',
    requires: [
        /* global Slate */
        'Slate.cbl.field.comments.Comment',
        'Slate.cbl.data.field.Comments'
    ],


    config: {
        fieldLabel: 'Comments',
        commentField: {
            hidden: false
        }
    },


    componentCls: 'slate-cbl-commentsfield',
    layout: 'anchor',
    items: [
        {
            itemId: 'list',
            anchor: '100%',

            xtype: 'container',
            // hidden: true,
            componentCls: 'slate-cbl-comments-list',
            autoEl: 'ul',
            defaults: {
                xtype: 'slate-cbl-comments-comment',
                autoEl: 'li'
            },
            layout: 'container'
        }
    ],


    // config handlers
    applyCommentField: function(commentField, oldCommentField) {
        if (!commentField || typeof commentField == 'boolean') {
            commentField = {
                hidden: !commentField
            };
        }

        if (Ext.isSimpleObject(commentField)) {
            Ext.applyIf(commentField, {
                anchor: '100%',

                emptyText: 'Enter a new comment to add on save',
                grow: true,

                submitValue: false,
                excludeForm: true // exclude from any parent forms
            });
        }

        return Ext.factory(commentField, 'Ext.form.field.TextArea', oldCommentField);
    },

    updateCommentField: function(commentField, oldCommentField) {
        if (oldCommentField) {
            oldCommentField.un('change', 'syncValue', this);
        }

        if (commentField) {
            commentField.on('change', 'syncValue', this);
        }
    },

    updateReadOnly: function(readOnly) {
        this.callParent(arguments);
        this.setCommentField(!readOnly);
    },


    // component lifecycle
    initItems: function() {
        var me = this;

        me.callParent();

        me.items.insert(0, me.getCommentField());
        me.listCt = me.getComponent('list');
    },


    // containerfield lifecycle
    setValue: function(value) {
        var me = this,
            listCt = me.listCt;

        Ext.Array.sort(value, (comment1, comment2) => {
            var date1 = comment1.Created,
                date2 = comment2.Created;

            if (date1) {
                date1 = date1.getTime();
            } else {
                return -1;
            }

            if (date2) {
                date2 = date2.getTime();
            } else {
                return 1;
            }

            if (date1 < date2) {
                return 1;
            } else if (date1 == date2) {
                return 0;
            }

            return -1;
        });

        // update value and items map while loading into UI
        me.value = value;

        Ext.suspendLayouts();

        me.getCommentField().setValue(null);
        listCt.removeAll(true);
        listCt.add(value.map(data => ({ data })));

        Ext.resumeLayouts(true);

        // trigger change events if value differs from lastValue
        me.checkChange();

        // ensure lastValue and value always reference same instance
        me.lastValue = value;
    },

    syncValue: function() {
        var me = this,
            newMessage = me.getCommentField().getValue(),
            value = me.value || [],
            firstComment = value[0];

        if (newMessage) {
            value = me.value = Ext.Array.clone(value);

            if (firstComment && !firstComment.ID) {
                firstComment.Message = newMessage;
            } else {
                value.unshift({ Message: newMessage });
            }
        } else if (firstComment && !firstComment.ID) {
            value = me.value = Ext.Array.clone(value);
            Ext.Array.removeAt(value, 0);
        }

        me.checkChange();
    },

    isEqual: function(value1, value2) {
        return Slate.cbl.data.field.Comments.prototype.isEqual(value1, value2);
    }
});