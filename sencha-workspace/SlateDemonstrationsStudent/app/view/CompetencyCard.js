Ext.define('SlateDemonstrationsStudent.view.CompetencyCard', {
    extend: 'Ext.Component',
    xtype: 'slate-demonstrations-student-competencycard',
    requires: [
        'Ext.util.Format',

        'Slate.ui.SimplePanel', // using its CSS classes
        // 'Slate.cbl.Util',
        // 'Slate.cbl.data.Skills',
        // 'Slate.cbl.store.DemonstrationSkills'
    ],


    config: {
        // required inputs
        competency: null,
        completion: null,

        // optional config
        percentFormat: '0%',
        averageFormat: '0.##',
        growthFormat: '0.# yr',

        // input-dependent state
        level: null,
        percentComplete: 0,
        percentMissed: 0,
        demonstrationsAverage: null,
        isAverageLow: null,
        baselineRating: null,
        growth: null,

        // internal state
        skillsStatus: 'unloaded',

        demonstrationSkillsStore: {
            xclass: 'Slate.cbl.store.DemonstrationSkills'
        }
    },


    cls: 'slate-simplepanel',
    componentCls: 'slate-demonstrations-student-competencycard',
    renderTpl: [
        '<header class="slate-simplepanel-header">',
        '    <div  class="slate-simplepanel-title">',
        '        <span id="{id}-codeEl" data-ref="codeEl">{competency.Code:htmlEncode}</span>',
        '        <small id="{id}-descriptorEl" data-ref="descriptorEl">{competency.Descriptor:htmlEncode}</small>',
        '    </div>',
        '</header>',

        '<div id="{id}-meterEl" data-ref="meterEl" class="cbl-progress-meter <tpl if="isAverageLow">is-average-low</tpl>">',
        '    <div id="{id}-meterBarEl" data-ref="meterBarEl" class="cbl-progress-bar" style="width: {percentComplete:number(values.percentFormat)}"></div>',
        '    <div id="{id}-meterBarMissedEl" data-ref="meterBarMissedEl" class="cbl-progress-bar cbl-progress-bar-missed" style="width: {percentMissed:number(values.percentFormat)}; left: {percentComplete:number(values.percentFormat)}"></div>',
        '    <div id="{id}-meterLevelEl" data-ref="meterLevelEl" class="cbl-progress-level no-select">Y{level - 8}</div>',
        '    <div id="{id}-meterPercentEl" data-ref="meterPercentEl" class="cbl-progress-percent">{percentComplete:number(values.percentFormat)}</div>',
        '</div>',

        '<div class="stats-ct">',
        '    <table class="stats">',
        '        <thead>',
        '            <th>Baseline Score</th>',
        '            <th>Performance Level</th>',
        '            <th>My Growth</th>',
        '        </thead>',
        '        <tbody>',
        '            <td id="{id}-baselineRatingEl" data-ref="baselineRatingEl">',
        '                <tpl if="baselineRating">',
        '                    {baselineRating:number(values.averageFormat)}',
        '                <tpl else>',
        '                    &mdash;',
        '                </tpl>',
        '            </td>',
        '            <td id="{id}-averageEl" data-ref="averageEl">',
        '                <tpl if="demonstrationsAverage">',
        '                    {demonstrationsAverage:number(values.averageFormat)}',
        '                <tpl else>',
        '                    &mdash;',
        '                </tpl>',
        '            </td>',
        '            <td id="{id}-growthEl" data-ref="growthEl">',
        '                <tpl if="growth">',
        '                    {growth:number(values.growthFormat)}',
        '                <tpl else>',
        '                    &mdash;',
        '                </tpl>',
        '            </td>',
        '        </tbody>',
        '    </table>',
        '</div>',

        '<div class="slate-simplepanel-body explainer">',
        '    <p id="{id}-statementEl" data-ref="statementEl">{competency.Statement:htmlEncode}</p>',
        '</div>',

        '<ul id="{id}-skillsCt" data-ref="skillsCt" class="cbl-skill-meter">',
        '    <tpl if="skills">',
        '        {% values.skillsTpl.applyOut(values.skills, out); %}',
        '    </tpl>',
        '</ul>'
    ],
    childEls: [
        'codeEl',
        'descriptorEl',
        'meterEl',
        'meterBarEl',
        'meterBarMissedEl',
        'meterLevelEl',
        'meterPercentEl',
        'averageEl',
        'baselineRatingEl',
        'growthEl',
        'statementEl',
        'skillsCt'
    ],

    listeners: {
        scope: 'this',
        click: {
            fn: 'onDemoCellClick',
            element: 'el',
            delegate: '.cbl-skill-demo'
        }
    },


    // local subtemplates
    skillsTpl: [
        '<tpl for=".">',
        '    <li class="cbl-skill">',
        '        <h5 class="cbl-skill-name">{Descriptor:htmlEncode}</h5>',

        '        <ul class="cbl-skill-demos" data-skill="{ID}">',

                        // TODO: get overrides into data and test all this out, maybe don't use this.
        '            {% this.standardOverridden = false %}',

        '            <tpl for="demonstrations">{%debugger%}',
        '                <li ',
        '                    class="',
        '                        cbl-skill-demo',
        '                        <tpl if="values.DemonstratedLevel==0 && !Override"> cbl-skill-demo-uncounted</tpl>',
        '                        <tpl if="this.standardOverridden"> cbl-skill-demo-overridden</tpl>',
        '                        <tpl if="Override"> cbl-skill-override cbl-skill-span-{[xcount - xindex + 1]}{% this.standardOverridden = true %}</tpl>',
        '                    "',
        '                    <tpl if="DemonstrationID">data-demonstration="{DemonstrationID}"</tpl>',
        '                >',
        '                    <tpl if="Override">',
        '                        O',
        '                    <tpl elseif="values.DemonstratedLevel &gt;= 0">',
        '                        {[values.DemonstratedLevel == 0 ? "M" : values.DemonstratedLevel]}',
        '                    <tpl else>',
        '                        &nbsp;',
        '                    </tpl>',
        '                </li>',
        '            </tpl>',

        '            <li class="cbl-skill-complete-indicator <tpl if="isComplete">is-checked</tpl>">',
        '                <svg class="check-mark-image" width="16" height="16">',
        '                    <polygon class="check-mark" points="13.824,2.043 5.869,9.997 1.975,6.104 0,8.079 5.922,14.001 15.852,4.07"/>',
        '                </svg>',
        '            </li>',
        '        </ul>',

        '        <div class="cbl-skill-description"><p>{Statement}</p></div>',
        '    </li>',
        '</tpl>'
    ],


    // component template methods
    getElConfig: function() {
        var config = this.callParent();

        config['data-competency'] = this.getCompetency().getId();

        return config;
    },

    initRenderData: function() {
        var me = this,
            competency = me.getCompetency();

        return Ext.apply(this.callParent(), {
            competency: competency.getData(),

            percentFormat: me.getPercentFormat(),
            averageFormat: me.getAverageFormat(),
            growthFormat: me.getGrowthFormat(),

            level: me.getLevel(),
            percentComplete: me.getPercentComplete(),
            percentMissed: me.getPercentMissed(),
            demonstrationsAverage: me.getDemonstrationsAverage(),
            isAverageLow: me.getIsAverageLow(),
            baselineRating: me.getBaselineRating(),
            growth: me.getGrowth(),

            skillsTpl: me.lookupTpl('skillsTpl'),
            skills: competency ? me.buildSkillsTplData(competency) : null
        });
    },


    // config handlers
    updateCompetency: function(competency) {
        var me = this,
            htmlEncode = Ext.util.Format.htmlEncode,
            studentCompetency = competency.get('currentStudentCompetency'),
            demonstrationsAverage = studentCompetency.get('demonstrationsAverage'),
            level = studentCompetency.get('Level'),
            demonstrationsRequired = competency.getTotalDemonstrationsRequired(level),
            percentComplete = 100 * studentCompetency.get('demonstrationsComplete') / demonstrationsRequired;

        Ext.suspendLayouts();

        me.setLevel(level);
        me.setPercentComplete(percentComplete);
        me.setPercentMissed(100 * studentCompetency.get('demonstrationsMissed') / demonstrationsRequired);
        me.setDemonstrationsAverage(demonstrationsAverage);
        me.setIsAverageLow(percentComplete >= 50 && demonstrationsAverage !== null && demonstrationsAverage < (level + competency.get('minimumAverageOffset')));
        me.setBaselineRating(studentCompetency.get('BaselineRating'));
        me.setGrowth(studentCompetency.get('growth'));

        if (me.rendered) {
            me.codeEl.update(htmlEncode(competency.get('Code')));
            me.descriptorEl.update(htmlEncode(competency.get('Descriptor')));
            me.statementEl.update(htmlEncode(competency.get('Statement')));
            me.lookupTpl('skillsTpl').overwrite(me.skillsCt, me.buildSkillsTplData(competency));
        }

        Ext.resumeLayouts(true);
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
            me.meterLevelEl.update(newLevel ? 'Y'+(newLevel - 8) : '');
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

    updateDemonstrationsAverage: function(demonstrationsAverage) {
        var me = this;

        if (me.rendered) {
            me.averageEl.update(Ext.util.Format.number(demonstrationsAverage, me.getAverageFormat()));
        }
    },

    updateIsAverageLow: function(isAverageLow) {
        if (this.rendered) {
            this.meterEl.toggleCls('is-average-low', isAverageLow);
        }
    },

    updateBaselineRating: function(baselineRating) {
        var me = this;

        if (me.rendered) {
            me.baselineRatingEl.update(Ext.util.Format.number(baselineRating, me.getAverageFormat()));
        }
    },

    updateGrowth: function(growth) {
        var me = this;

        if (me.rendered) {
            me.growthEl.update(Ext.util.Format.number(growth, me.getGrowthFormat()));
        }
    },

    updateSkillsStatus: function(newStatus, oldStatus) {
        if (oldStatus) {
            this.removeCls('skills-' + oldStatus);
        }

        if (newStatus) {
            this.addCls('skills-' + newStatus);
        }
    },

    applyDemonstrationSkillsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },


    // event handlers
    onDemoCellClick: function(ev, t) {
        this.fireEvent('democellclick', this, ev, Ext.get(t));
    },


    // public methods
    buildSkillsTplData: function(competency) {
        var studentCompetency = competency.get('currentStudentCompetency'),
            level = studentCompetency && studentCompetency.get('Level'),
            demonstrationsBySkill = studentCompetency && studentCompetency.get('effectiveDemonstrationsData'),

            skills = competency.get('Skills'),
            skillsLength = skills.length,
            skillIndex = 0, skill,
            demonstrationsRequired, demonstrations,
            tplData = [];

        for (; skillIndex < skillsLength; skillIndex++) {
            skill = skills[skillIndex];
            demonstrationsRequired = skill.DemonstrationsRequired;

            demonstrations = Ext.Array.clone(demonstrationsBySkill && demonstrationsBySkill[skill.ID] || []);
            demonstrations.length = level && demonstrationsRequired[level] || demonstrationsRequired.default || 1;

            tplData.push(Ext.applyIf({
                demonstrations: demonstrations
            }, skill));
        }

        return tplData;
    }
});