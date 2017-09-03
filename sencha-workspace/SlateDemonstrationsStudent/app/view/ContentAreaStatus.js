Ext.define('SlateDemonstrationsStudent.view.ContentAreaStatus', {
    extend: 'Ext.Component',
    xtype: 'slate-demonstrations-student-contentareastatus',
    requires: [
    ],

    config: {
        // required inputs
        contentAreaTitle: null,
        level: null,
        percentComplete: 0,
        percentMissed: 0,
        missed: null,
        average: null,
        growth: null,

        // optional config
        percentFormat: '0%',
        averageFormat: '0.##',
        growthFormat: '0.# yr'
    },

    cls: ['cbl-competency-panel', 'cbl-contentarea-status'],
    renderTpl: [
        '<header class="panel-header">',
            '<h3 class="header-title">My <span id="{id}-contentAreaTitleEl" data-ref="contentAreaTitleEl">{contentAreaTitle}</span> Competencies</h3>',
        '</header>',

        '<div class="panel-body">',
            '<div id="{id}-meterEl" data-ref="meterEl" class="cbl-progress-meter">',
                '<div id="{id}-meterBarEl" data-ref="meterBarEl" class="cbl-progress-bar" style="width: {percentComplete:number(values.percentFormat)}"></div>',
                '<div id="{id}-meterBarMissedEl" data-ref="meterBarMissedEl" class="cbl-progress-bar cbl-progress-bar-missed" style="width: {percentMissed:number(values.percentFormat)}; left: {percentComplete:number(values.percentFormat)}"></div>',
                '<div id="{id}-meterLevelEl" data-ref="meterLevelEl" class="cbl-progress-level no-select"><tpl if="level">Y{level - 8}</tpl></div>',
                '<div id="{id}-meterPercentEl" data-ref="meterPercentEl" class="cbl-progress-percent">{percentComplete:number(values.percentFormat)}</div>',
            '</div>',

            '<div class="stats-ct">',
                '<table class="stats">',
                    '<thead>',
                        '<th>Missed Skills</th>',
                        '<th>Overall Performance Level</th>',
                        '<th>Overall Growth</th>',
                    '</thead>',

                    '<tbody>',
                        '<td id="{id}-missedEl" data-ref="missedEl">',
                            '<tpl if="missed !== null">',
                                '{missed}',
                            '<tpl else>',
                                '&mdash;',
                            '</tpl>',
                        '</td>',
                        '<td id="{id}-averageEl" data-ref="averageEl">',
                            '<tpl if="average">',
                                '{average:number(values.averageFormat)}',
                            '<tpl else>',
                                '&mdash;',
                            '</tpl>',
                        '</td>',
                        '<td id="{id}-growthEl" data-ref="growthEl">',
                            '<tpl if="growth">',
                                '{growth:number(values.growthFormat)}',
                            '<tpl else>',
                                '&mdash;',
                            '</tpl>',
                        '</td>',
                    '</tbody>',
                '</table>',
            '</div>',
        '</div>'
    ],
    childEls: [
        'contentAreaTitleEl',
        'meterEl',
        'meterBarEl',
        'meterBarMissedEl',
        'meterLevelEl',
        'meterPercentEl',
        'missedEl',
        'averageEl',
        'growthEl'
    ],


    // component template methods
    initRenderData: function() {
        var me = this;

        return Ext.apply(this.callParent(), {
            percentFormat: me.getPercentFormat(),
            averageFormat: me.getAverageFormat(),
            growthFormat: me.getGrowthFormat(),

            contentAreaTitle: me.getContentAreaTitle(),
            level: me.getLevel(),
            percentComplete: me.getPercentComplete(),
            percentMissed: me.getPercentMissed(),
            missed: me.getMissed(),
            average: me.getAverage(),
            growth: me.getGrowth()
        });
    },


    // config handlers
    updateContentAreaTitle: function(title) {
        if (this.rendered) {
            this.contentAreaTitleEl.update(title);
        }
    },

    updateLevel: function(newLevel, oldLevel) {
        var me = this;

        if (oldLevel) {
            me.removeCls('cbl-level-' + oldLevel);
        }

        if (newLevel) {
            me.addCls('cbl-level-' + newLevel);
        }

        if (me.rendered) {
            me.meterLevelEl.update(newLevel ? 'Y'+newLevel : '');
        }
    },

    applyPercentComplete: function(percentComplete) {
        return percentComplete || 0;
    },

    updatePercentComplete: function(percentComplete) {
        var me = this;

        if (me.rendered) {
            percentComplete = Ext.util.Format.number(percentComplete, me.getPercentFormat());

            me.meterBarEl.setStyle('width', percentComplete);
            me.meterBarMissedEl.setStyle('left', percentComplete);
            me.meterPercentEl.update(percentComplete);
        }
    },

    applyPercentMissed: function(percentMissed) {
        return percentMissed || 0;
    },

    updatePercentMissed: function(percentMissed) {
        var me = this;

        if (me.rendered) {
            percentMissed = Ext.util.Format.number(percentMissed, me.getPercentFormat());
            me.meterBarMissedEl.setStyle('width', percentMissed);
        }
    },

    updateMissed: function(missed) {
        if (this.rendered) {
            this.missedEl.update(Ext.isNumber(missed) ? missed.toString() : '&mdash;');
        }
    },

    updateAverage: function(average) {
        var me = this;

        if (me.rendered) {
            me.averageEl.update(Ext.util.Format.number(average, me.getAverageFormat()));
        }
    },

    updateGrowth: function(growth) {
        var me = this;

        if (me.rendered) {
            me.growthEl.update(Ext.util.Format.number(growth, me.getGrowthFormat()));
        }
    }
});