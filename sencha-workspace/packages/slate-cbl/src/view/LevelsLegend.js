Ext.define('Slate.cbl.view.LevelsLegend', {
    extend: 'Ext.Component',
    xtype: 'slate-cbl-levelslegend',
    requires: [
        /* global Slate */
        'Slate.cbl.util.Config'
    ],


    // component properties
    componentCls: 'cbl-levelslegend',
    renderTpl: [
        '<span class="cbl-levelslegend-label">Portfolios:&ensp;</span>',
        '<tpl foreach="levels">',
            '<tpl if="xkey != 0">',
                '<span class="cbl-levelslegend-item cbl-level-colored cbl-level-{$}" title="{title:htmlEncode}">{abbreviation:htmlEncode}</span>',
            '</tpl>',
        '</tpl>'
    ],


    // component lifecycle
    initRenderData: function() {
        return Ext.apply(this.callParent(), {
            levels: Slate.cbl.util.Config.getLevels()
        });
    }
});