/**
 * Thumb used for rating sliders
 */
Ext.define('Slate.cbl.field.ratings.Thumb', {
    extend: 'Ext.slider.Thumb',
    requires: [
        'Ext.util.Format',

        /* global Slate */
        'Slate.cbl.util.Config'
    ],


    contentTpl: [
        '<tpl if="value === null">',
            '<small class="muted">N/A</small>',
        '<tpl else>',
            '{[fm.htmlEncode(Slate.cbl.util.Config.getAbbreviationForRating(values.value))]}',
        '</tpl>'
    ],

    getElConfig: function() {
        var me = this,
            thumbCls = me.thumbCls,
            config = me.callParent();

        config.html = me.buildValueHtml(me.value);
        config.title = Slate.cbl.util.Config.getTitleForRating(me.value);

        if (thumbCls) {
            config.cls += ' ' + thumbCls;
        }

        return config;
    },

    buildValueHtml: function(value) {
        return Ext.XTemplate.getTpl(this, 'contentTpl').apply({ value: value });
    },

    setValue: function(value) {
        var me = this,
            el = me.el;

        me.value = value;

        if (el) {
            el.set({ title: Slate.cbl.util.Config.getTitleForRating(value) })
                .setHtml(me.buildValueHtml(value));
        }
    },

    setReadOnly: function(readOnly) {
        this.readOnly = readOnly;
    },

    onBeforeDragStart: function() {
        if (this.readOnly) {
            return false;
        }

        return this.callParent(arguments);
    }
});