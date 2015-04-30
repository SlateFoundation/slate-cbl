/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.view.student.CompetencyCard', {
    extend: 'Ext.Component',
    xtype: 'slate-cbl-student-competencycard',
    requires: [,
        'Slate.cbl.util.CBL'
    ],

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

        // internal state
        skillsStatus: 'unloaded',

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

        '    <ul id="{id}-skillsCt" data-ref="skillsCt" class="cbl-skill-meter"></ul>',
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
        '<tpl foreach=".">',
        '    <li class="cbl-skill">',
        '        <h5 class="cbl-skill-name">{Descriptor:htmlEncode}</h5>',
        '        <ul class="cbl-skill-demos" data-skill="{ID}">',
        '            <tpl for="demonstrations">',
        '                <li class="cbl-skill-demo <tpl if="values.Level==0">cbl-skill-demo-uncounted</tpl>" <tpl if="DemonstrationID">data-demonstration="{DemonstrationID}"</tpl>>',
        '                    <tpl if="values.Level &gt;= 0">',
        '                        {[values.Level == 0 ? "M" : values.Level]}',
        '                    <tpl else>',
        '                        &nbsp;',
        '                    </tpl>',
        '                </li>',
        '            </tpl>',
        '        </ul>',
        '        <div class="cbl-skill-description"><p>{Statement}</p></div>',
                /* TODO: FIXME: We need new design assets/styling for the checkmark, this doesn't render very well at all
                '<div class="cbl-skill-complete-indicator cbl-level-{parent.level} is-checked">',
                    '<svg class="check-mark-image" width="16" height="16">',
                        '<polygon class="check-mark" points="13.824,2.043 5.869,9.997 1.975,6.104 0,8.079 5.922,14.001 15.852,4.07"/>',
                    '</svg>',
                '</div>',*/
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
            htmlEncode = Ext.util.Format.htmlEncode,
            completion = competency.get('studentCompletions')[me.getStudentId()] || {},
            percentComplete = Math.round(100 * (completion.demonstrationsCount || 0) / competency.get('totalDemonstrationsRequired')),
            demonstrationsAverage = completion.demonstrationsAverage;

        me.setLevel(competency && competency.get('level') || null);
        me.setPercentComplete(percentComplete);
        me.setDemonstrationsAverage(demonstrationsAverage);
        me.setIsAverageLow(percentComplete >= 50 && demonstrationsAverage < competency.get('minimumAverage'));

        if (me.rendered) {
            me.descriptorEl.update(htmlEncode(competency.get('Descriptor')));
            me.statementEl.update(htmlEncode(competency.get('Statement')));
        }

        me.loadSkills();
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
            me.meterLevelEl.update(newLevel ? 'L'+newLevel : '');
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
    },

    updateSkillsStatus: function(newStatus, oldStatus) {
        if (oldStatus) {
            this.removeCls('skills-' + oldStatus);
        }

        if (newStatus) {
            this.addCls('skills-' + newStatus);
        }
    },


    // event handlers
    onDemoCellClick: function(ev, t) {
        this.fireEvent('democellclick', this, ev, Ext.get(t));
    },


    // public methods
    loadSkills: function() {
        var me = this,
            competency = me.getCompetency();

        me.setSkillsStatus('loading');

        competency.getDemonstrationsForStudents([me.getStudentId()], function(loadedDemonstrations) {
            me.loadedDemonstrations = loadedDemonstrations;
            me.refreshSkills();
        });

        competency.withSkills(function(loadedSkills) {
            me.loadedSkills = loadedSkills;
            me.refreshSkills();
        });
    },

    refreshSkills: function() {
        var me = this;

        if (!me.loadedSkills || !me.loadedDemonstrations || !me.rendered) {
            return;
        }

        me.getTpl('skillsTpl').overwrite(me.skillsCt, me.getSkillsData());

        me.setSkillsStatus('loaded');
    },

    getSkillsData: function() {
        var me = this,
            skills = me.loadedSkills,
            skillsLen = skills.getCount(), skillIndex = 0, skill,
            demonstrations = me.loadedDemonstrations,
            demonstrationsLen = demonstrations.length, demonstrationIndex = 0, demonstration,
            skillsData = {}, skillData, demonstrationsRequired;

        // index skills by ID and create empty demonstrations array
        for (; skillIndex < skillsLen; skillIndex++) {
            skill = skills.getAt(skillIndex);
            skill.demonstrations = [];
            skillsData[skill.ID] = skill;
        }

        // group demonstrations by skill
        for (; demonstrationIndex < demonstrationsLen; demonstrationIndex++) {
            demonstration = demonstrations[demonstrationIndex];
            skillsData[demonstration.SkillID].demonstrations.push(demonstration);
        }

        // sort and pad demonstrations arrays
        for (skillIndex in skillsData) {
            skillData = skillsData[skillIndex];
            demonstrationsRequired = skillData.DemonstrationsRequired;

            skillData.demonstrations = Slate.cbl.util.CBL.sortDemonstrations(skillData.demonstrations, demonstrationsRequired);
            Slate.cbl.util.CBL.padArray(skillData.demonstrations, demonstrationsRequired);
        }

        return skillsData;
    }
});