/**
 * @abstract
 * Base class for attached items within {@link Slate.cbl.field.attachments.Field}
 */
Ext.define('Slate.cbl.field.attachments.Attachment', {
    extend: 'Ext.Component',
    xtype: 'slate-cbl-attachments-attachment',
    requires: [
        'Ext.window.MessageBox'
    ],


    // attachment configuration
    config: {
        title: null,
        status: 'normal'
    },


    titleTpl: [
        '{title:htmlEncode}'
    ],

    statusTpl: [
        '<tpl if="status == &quot;removed&quot;">(removed)</tpl>'
    ],

    editTpl: [
        '<button class="plain" action="edit"><i class="fa fa-edit" title="Edit"></i></button>',
    ],

    removeTpl: [
        '<tpl if="status == &quot;normal&quot;">',
            '<button class="plain" action="toggle-status" data-status="removed"><i class="fa fa-times-circle" title="Remove"></i></button>',
        '<tpl elseif="status == &quot;removed&quot;">',
            '<button class="plain" action="toggle-status" data-status="normal"><i class="fa fa-undo" title="Restore"></i></button>',
        '</tpl>'
    ],

    /**
     * @private
     */
    suspendFireChange: 0,


    // component configuration
    componentCls: 'slate-cbl-attachments-attachment',
    renderTpl: [
        '<span class="slate-cbl-attachments-attachment-title" id="{id}-titleEl" data-ref="titleEl">',
            '{% values.titleTpl.applyOut(values, out) %}',
        '</span>',
        '<span class="slate-cbl-attachments-attachment-status" id="{id}-statusEl" data-ref="statusEl">',
            '{% values.statusTpl.applyOut(values, out) %}',
        '</span>',
        '<span class="slate-cbl-attachments-attachment-controls" id="{id}-controlsWrapper" data-ref="controlsWrapper">',
            '<span class="slate-cbl-attachments-attachment-edit" id="{id}-editEl" data-ref="editEl">',
                '{% values.editTpl.applyOut(values, out) %}',
            '</span>',
            '<span class="slate-cbl-attachments-attachment-remove" id="{id}-removeEl" data-ref="removeEl">',
                '{% values.removeTpl.applyOut(values, out) %}',
            '</span>',
        '</span>'
    ],
    childEls: [
        'titleEl',
        'statusEl',
        'controlsWrapper',
        'editEl',
        'removeEl'
    ],


    // component lifecycle
    initRenderData: function() {
        var me = this;

        return Ext.apply({
            titleTpl: me.lookupTpl('titleTpl'),
            statusTpl: me.lookupTpl('statusTpl'),
            editTpl: me.lookupTpl('editTpl'),
            removeTpl: me.lookupTpl('removeTpl'),

            title: me.getTitle(),
            status: me.getStatus()
        }, me.callParent(arguments));
    },

    afterRender: function() {
        var me = this;

        me.callParent();

        me.refresh = Ext.Function.createBuffered(me.refresh, 100);
        me.fireChange = Ext.Function.createBuffered(me.fireChange, 100);

        me.mon(me.editEl, 'click', 'onEditClick', me, { delegate: 'button[action=edit]' });
        me.mon(me.removeEl, 'click', 'onRemoveClick', me, { delegate: 'button[action=toggle-status]' });
    },


    // config handlers
    updateTitle: function() {
        this.refresh();
        this.fireChange();
    },

    updateStatus: function() {
        this.refresh();
        this.fireChange();
    },


    // event handlers
    onEditClick: function() {
        this.edit();
    },

    onRemoveClick: function() {
        this.remove();
    },


    // attachment methods
    refresh: function() {
        var me = this,
            renderData;

        if (!me.rendered) {
            return;
        }

        renderData = me.initRenderData();

        renderData.titleTpl.overwrite(me.titleEl, renderData);
        renderData.statusTpl.overwrite(me.statusEl, renderData);
        renderData.editTpl.overwrite(me.editEl, renderData);
        renderData.removeTpl.overwrite(me.removeEl, renderData);
    },

    edit: function() {
        this.fireEventedAction('edit', [this], 'doEdit', this);
    },

    doEdit: function() {
        var me = this;

        Ext.Msg.prompt(
            'Set Attachment Title',
            'Enter a new title for this attachment',
            function(btnId, title) {
                if (btnId == 'ok') {
                    me.setTitle(Ext.String.trim(title) || null);
                }
            },
            me,
            false,
            me.getTitle()
        );
    },

    remove: function() {
        this.fireEventedAction('remove', [this], 'doRemove', this);
    },

    doRemove: function() {
        this.setStatus(this.getStatus() == 'removed' ? 'normal' : 'removed');
    },

    getValue: function() {
        return {
            Class: this.self.recordClass,
            Title: this.getTitle(),
            Status: this.getStatus()
        };
    },

    setValue: function(value) {
        var me = this;

        ++me.suspendFireChange;
        me.setConfig(me.applyValueToConfig(value));
        --me.suspendFireChange;

        me.fireChange();
    },

    applyValueToConfig: function(value) {
        return {
            title: value.Title || null,
            status: value.Status || null
        };
    },

    fireChange: function() {
        if (!this.suspendFireChange) {
            this.fireEvent('change', this);
        }
    },


    inheritableStatics: {
        recordClass: 'Slate\\CBL\\Tasks\\Attachments\\AbstractTaskAttachment',

        buildButtonConfig: function() {
            return false;
        }
    }
});