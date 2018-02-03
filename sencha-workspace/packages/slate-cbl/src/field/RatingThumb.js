/**
 * Thumb used for rating sliders
 */
Ext.define('Slate.cbl.field.RatingThumb', {
    extend: 'Ext.slider.Thumb',


    contentTpl: [
        '<tpl if="value === null">',
            '<small class="muted">N/A</small>',
        '<tpl elseif="value === 0">',
            'M',
        '<tpl else>',
            '{value}',
        '</tpl>'
    ],

    getElConfig: function() {
        var me = this,
            thumbCls = me.thumbCls,
            config = me.callParent();

        config.html = me.buildContentHtml();

        if (thumbCls) {
            config.cls += ' ' + thumbCls;
        }

        return config;
    },

    buildContentTplData: function() {
        return {
            value: this.value
        };
    },

    buildContentHtml: function() {
        return Ext.XTemplate.getTpl(this, 'contentTpl').apply(this.buildContentTplData());
    },

    setValue: function(value) {
        var me = this,
            el = me.el;

        me.value = value;

        if (el) {
            el.setHtml(me.buildContentHtml());
        }
    }
});