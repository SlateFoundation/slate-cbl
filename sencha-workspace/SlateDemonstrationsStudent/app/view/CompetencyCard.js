Ext.define('SlateDemonstrationsStudent.view.CompetencyCard', {
    extend: 'Ext.Component',
    xtype: 'slate-demonstrations-student-competencycard',
    requires: [
        'Ext.util.Format',

        'Slate.cbl.Util',
        'Slate.cbl.data.Skills',
        'Slate.cbl.store.DemonstrationSkills'
    ],


    config: {
        // required inputs
        competency: null,
        completion: null,

        // optional config
        averageFormat: '0.##',

        // input-dependent state
        level: null,
        percentComplete: null,
        demonstrationsAverage: null,
        isAverageLow: null,

        // internal state
        skillsStatus: 'unloaded',

        demonstrationSkillsStore: {
            xclass: 'Slate.cbl.store.DemonstrationSkills'
        },

        // component config
        cls: 'cbl-competency-panel'
    },

    renderTpl: [
        '<header class="panel-header">',
            '<h3 id="{id}-descriptorEl" data-ref="descriptorEl" class="header-title">{competency.Descriptor:htmlEncode}</h3>',
        '</header>',

        '<div class="panel-body">',
            '<div id="{id}-meterEl" data-ref="meterEl" class="cbl-progress-meter <tpl if="isAverageLow">is-average-low</tpl>">',
                '<div id="{id}-meterBarEl" data-ref="meterBarEl" class="cbl-progress-bar" style="width:{percentComplete:defaultValue(0)}%"></div>',
                // TODO set width dynamically
                '<div id="{id}-meterBarMissedEl" data-ref="meterBarMissedEl" class="cbl-progress-bar cbl-progress-bar-missed" style="width: 10%; left: {percentComplete:defaultValue(0)}%"></div>',
                '<div id="{id}-meterLevelEl" data-ref="meterLevelEl" class="cbl-progress-level no-select">Y{[ values.level - 8]}</div>',
                '<div id="{id}-meterPercentEl" data-ref="meterPercentEl" class="cbl-progress-percent">{percentComplete}%</div>',
                // moved to stats table below
                //'<div id="{id}-meterAverageEl" data-ref="meterAverageEl" class="cbl-progress-average" title="Average">{demonstrationsAverage:number(values.$comp.getAverageFormat())}</div>',
            '</div>',

            '<div class="stats-ct">',
                '<table class="stats">',
                    '<thead>',
                        '<th>Baseline Score</th>',
                        '<th>Performance Level</th>',
                        '<th>My Growth</th>',
                    '<tbody>',
                        '<td>2</td>',
                        //'<td>{demonstrationsAverage:number(values.$comp.getAverageFormat())}</td>',
                        // '{% debugger %}',
                        '<td>{[ this.getPerformanceLevel(values) ]}</td>',
                        '<td>0.8 yr</td>',
                    '</tbody>',
                '</table>',
            '</div>',

            '<div class="explainer">',
                '<p id="{id}-statementEl" data-ref="statementEl">{competency.Statement:htmlEncode}</p>',
            '</div>',

            '<ul id="{id}-skillsCt" data-ref="skillsCt" class="cbl-skill-meter"></ul>',
        '</div>',
        {
            getPerformanceLevel: function(values) {
                return Ext.util.Format.number(values.demonstrationsAverage, values.$comp.getAverageFormat()) || '&mdash;';
            }
        }
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
            '<li class="cbl-skill">',
                '<h5 class="cbl-skill-name">{skill.Descriptor:htmlEncode}</h5>',

                '<ul class="cbl-skill-demos" data-skill="{skill.ID}">',
                    '{% this.standardOverridden = false %}',

                    '<tpl for="demonstrations">',
                        '<li ',
                            'class="',
                                'cbl-skill-demo',
                                '<tpl if="values.DemonstratedLevel==0"> cbl-skill-demo-uncounted</tpl>',
                                '<tpl if="this.standardOverridden"> cbl-skill-demo-overridden</tpl>',
                                '<tpl if="Override"> cbl-skill-override cbl-skill-span-{[xcount - xindex + 1]}{% this.standardOverridden = true %}</tpl>',
                            '"',
                            '<tpl if="DemonstrationID">data-demonstration="{DemonstrationID}"</tpl>',
                        '>',
                            '<tpl if="Override">',
                                'O',
                            '<tpl elseif="values.DemonstratedLevel &gt;= 0">',
                                '{[values.DemonstratedLevel == 0 ? "M" : values.DemonstratedLevel]}',
                            '<tpl else>',
                                '&nbsp;',
                            '</tpl>',
                        '</li>',
                    '</tpl>',

                    '<li class="cbl-skill-complete-indicator <tpl if="isComplete">is-checked</tpl>">',
                        '<svg class="check-mark-image" width="16" height="16">',
                            '<polygon class="check-mark" points="13.824,2.043 5.869,9.997 1.975,6.104 0,8.079 5.922,14.001 15.852,4.07"/>',
                        '</svg>',
                    '</li>',
                '</ul>',

                '<div class="cbl-skill-description"><p>{skill.Statement}</p></div>',
            '</li>',
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
            htmlEncode = Ext.util.Format.htmlEncode;

        if (me.rendered) {
            me.descriptorEl.update(htmlEncode(competency.get('Descriptor')));
            me.statementEl.update(htmlEncode(competency.get('Statement')));
        }
    },

    updateCompletion: function(completion) {
        var me = this,
            competency = me.getCompetency(),
            demonstrationsAverage = completion.get('demonstrationsAverage'),
            currentLevel = completion.get('currentLevel'),
            percentComplete = Math.round(100 * completion.get('demonstrationsComplete') / competency.getTotalDemonstrationsRequired(currentLevel));

        me.setLevel(currentLevel);
        me.setPercentComplete(percentComplete);
        me.setDemonstrationsAverage(demonstrationsAverage);
        me.setIsAverageLow(percentComplete >= 50 && demonstrationsAverage !== null && demonstrationsAverage < (currentLevel + competency.get('minimumAverageOffset')));

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

    applyDemonstrationSkillsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },


    // event handlers
    onDemoCellClick: function(ev, t) {
        this.fireEvent('democellclick', this, ev, Ext.get(t));
    },


    // public methods
    loadSkills: function() {
        var me = this,
            competency = me.getCompetency(),
            demoSkillsStore = me.getDemonstrationSkillsStore();

        me.setSkillsStatus('loading');

        demoSkillsStore.loadByStudentsAndCompetencies(me.getCompletion().get('StudentID'), competency.getId(), {
            callback: function(demoSkills) {
                me.refreshSkills();
            }
        });

        Slate.cbl.data.Skills.getAllByCompetency(competency, function(skills) {
            me.loadedSkills = skills;
            me.refreshSkills();
        });
    },

    refreshSkills: function() {
        var me = this;

        if (!me.loadedSkills || !me.getDemonstrationSkillsStore().isLoaded() || !me.rendered) {
            return;
        }

        me.getTpl('skillsTpl').overwrite(me.skillsCt, me.getSkillsData());

        me.setSkillsStatus('loaded');
    },

    getSkillsData: function() {
        var me = this,
            skills = me.loadedSkills,
            skillsLen = skills.getCount(), skillIndex = 0, skill,
            demoSkillsStore = me.getDemonstrationSkillsStore(),
            demoSkillsLen = demoSkillsStore.getCount(), demoSkillIndex = 0, demoSkill,
            skillsData = {}, skillData, demonstrationsRequired;

        // index skills by ID and create empty demonstrations array
        for (; skillIndex < skillsLen; skillIndex++) {
            skill = skills.getAt(skillIndex);
            skillsData[skill.getId()] = {
                skill: skill.getData(),
                demonstrations: []
            };
        }

        // group demonstrations by skill
        for (; demoSkillIndex < demoSkillsLen; demoSkillIndex++) {
            demoSkill = demoSkillsStore.getAt(demoSkillIndex);
            skillsData[demoSkill.get('SkillID')].demonstrations.push(demoSkill.getData());
        }

        // sort and pad demonstrations arrays
        for (skillIndex in skillsData) {
            skillData = skillsData[skillIndex];
            demonstrationsRequired = skills.getByKey(skillIndex).getTotalDemonstrationsRequired(me.getLevel());

            skillData.demonstrations = Slate.cbl.Util.sortDemonstrations(skillData.demonstrations, demonstrationsRequired);
            Slate.cbl.Util.padArray(skillData.demonstrations, demonstrationsRequired);
            skillData.isComplete = skillData.demonstrations.length == demonstrationsRequired && (skillData.demonstrations.length === 0 || skillData.demonstrations[demonstrationsRequired - 1].DemonstratedLevel);
        }

        return skillsData;
    }
});