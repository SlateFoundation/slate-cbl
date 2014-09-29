/*jslint browser: true, undef: true *//*global Ext*/
/**
 * TODO: convert to a direct decendent for sliderfield that appends the label element instead of using container+component and burying the form api
 */
Ext.define('Slate.cbl.field.LevelSlider', {
    extend: 'Ext.slider.Single',
    xtype: 'slate-cbl-levelsliderfield',

    componentCls: 'cbl-level-slider-field',
    minValue: 7,
    maxValue: 13,
    useTips: false,
    thumbTpl: [
        '<span class="value">',
            '<tpl if="!value || value == 7">',
                '<small>N/A</small>',
            '<tpl else>',
                '{value}',
            '</tpl>',
        '</span>'
    ],

    listeners: {
        change: function(levelSlider, value) {
            levelSlider.updateThumbValue(value);
        }
    },

    onRender: function() {
        var me = this;

        me.callParent(arguments);

        me.updateThumbValue(me.getValue());
    },

    updateThumbValue: function(value) {
        var me = this;

        me.getTpl('thumbTpl').overwrite(me.thumbs[0].el, {
            value: value
        });
    }
});