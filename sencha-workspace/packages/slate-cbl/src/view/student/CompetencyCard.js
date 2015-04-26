/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.view.student.CompetencyCard', {
    extend: 'Ext.Component',
    xtype: 'slate-cbl-student-competencycard',

    config: {
        // required inputs
        studentId: null,
        competency: null,

        // optional config
        averageFormat: '0.##',

        // input-dependent configs
        level: null,
        percentComplete: null,
        demonstrationsAverage: null,
        isAverageLow: null,

        cls: 'cbl-competency-panel'
    },

    renderTpl: [
        '<header class="panel-header">',
        '    <h3 id="{id}-descriptorEl" data-ref="descriptorEl" class="header-title">{competency.Descriptor:htmlEncode}</h3>',
        '</header>',

        '<div class="panel-body">',
        '    <div id="{id}-meterEl" data-ref="meterEl" class="cbl-progress-meter <tpl if="isAverageLow">is-average-low</tpl>">',
        '        <div id="{id}-meterBarEl" data-ref="meterBarEl" class="cbl-progress-bar" style="width:{percentComplete:defaultValue(0)}%"></div>',
        '        <div id="{id}-meterLevelEl" data-ref="meterLevelEl" class="cbl-progress-level no-select">L{level}</div>',
        '        <div id="{id}-meterPercentEl" data-ref="meterPercentEl" class="cbl-progress-percent">{percentComplete}%</div>',
        '        <div id="{id}-meterAverageEl" data-ref="meterAverageEl" class="cbl-progress-average" title="Average">{demonstrationsAverage:number(values.$comp.getAverageFormat())}</div>',
        '    </div>',

        '    <div class="explainer">',
        '        <p id="{id}-statementEl" data-ref="statementEl">{competency.Statement:htmlEncode}</p>',
        '    </div>',

        '    <ul id="{id}-skillsCt" data-ref="skillsCt" class="cbl-skill-meter skills-unloaded"></ul>',
        '</div>'
    ],
    childEls: [
        'descriptorEl',
        'meterEl',
        'meterBarEl',
        'meterLevelEl',
        'meterPercentEl',
        'meterAverageEl',
        'statementEl',
        'skillsCt'
    ],


    // component template methods
    getElConfig: function() {
        var config = this.callParent();

        config['data-competency'] = this.getCompetency().getId();

        return config;
    },

    initRenderData: function() {
        var me = this;

        return Ext.apply(this.callParent(), {
            competency: me.getCompetency().getData(),
            level: me.getLevel(),
            percentComplete: me.getPercentComplete(),
            demonstrationsAverage: me.getDemonstrationsAverage(),
            isAverageLow: me.getIsAverageLow()
        });
    },


    // config handlers
    updateCompetency: function(competency) {
        var me = this,
            completion = competency.get('studentCompletions')[me.getStudentId()] || {},
            percentComplete = Math.round(100 * (completion.demonstrationsCount || 0) / competency.get('totalDemonstrationsRequired')),
            demonstrationsAverage = completion.demonstrationsAverage;

        me.setLevel(competency && competency.get('level') || null);
        me.setPercentComplete(percentComplete);
        me.setDemonstrationsAverage(demonstrationsAverage);
        me.setIsAverageLow(percentComplete >= 50 && demonstrationsAverage < competency.get('minimumAverage'));
    },

    updateLevel: function(newLevel, oldLevel) {
        if (oldLevel) {
            this.removeCls('cbl-level-' + oldLevel);
        }

        if (newLevel) {
            this.addCls('cbl-level-' + newLevel);
        }
    },

    updatePercentComplete: function(percentComplete) {
        var me = this;

        if (me.rendered) {
            me.meterBarEl.setStyle('width', percentComplete + '%');
            me.meterPercentEl.update(percentComplete + '%');
        }
    },

    updateDemonstrationsAverage: function(demonstrationsAverage) {
        var me = this;

        if (me.rendered) {
            me.meterAverageEl.update(Ext.util.Format.number(demonstrationsAverage, me.getAverageFormat()));
        }
    },

    updateIsAverageLow: function(isAverageLow) {
        if (this.rendered) {
            this.meterEl.toggleCls('is-average-low', isAverageLow);
        }
    }
});