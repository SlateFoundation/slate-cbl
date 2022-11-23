Ext.define('SlateDemonstrationsStudent.view.CompetencyCard', {
    extend: 'Ext.Component',
    xtype: 'slate-demonstrations-student-competencycard',
    requires: [
        'Ext.util.Format',
        'Ext.util.Sortable',

        /* global Slate */
        'Slate.cbl.util.Config',
        'Slate.cbl.util.format.PreventOrphans',
        'Slate.ui.SimplePanel', // using its CSS classes
        'Slate.sorter.Code'
    ],


    config: {
        // required inputs
        competency: null,

        // optional config
        percentFormat: '0%',
        averageFormat: '0.#',
        growthFormat: '0.#',

        // input-dependent state
        level: null,
        percentComplete: 0,
        percentMissed: 0,
        demonstrationsAverage: null,
        isAverageLow: null,
        baselineRating: null,
        growth: null
    },


    cls: 'slate-simplepanel',

    componentCls: 'slate-demonstrations-student-competencycard',

    renderTpl: [
        '<header class="slate-simplepanel-header">',
            '<div  class="slate-simplepanel-title">',
                '<span id="{id}-codeEl" data-ref="codeEl">{competency.Code:htmlEncode}</span>',
                '<small id="{id}-descriptorEl" data-ref="descriptorEl">{competency.Descriptor:htmlEncode}</small>',
            '</div>',
        '</header>',

        '<div id="{id}-meterEl" data-ref="meterEl" class="cbl-level-progress-meter <tpl if="isAverageLow">is-average-low</tpl>">',
            '<div id="{id}-meterBarEl" data-ref="meterBarEl" class="cbl-level-progress-bar cbl-level-progress-complete" style="width: {percentComplete:number(values.percentFormat)}"></div>',
            '<div id="{id}-meterBarMissedEl" data-ref="meterBarMissedEl" class="cbl-level-progress-bar cbl-level-progress-missed" style="width: {percentMissed:number(values.percentFormat)}; left: {percentComplete:number(values.percentFormat)}"></div>',
            '<div id="{id}-meterLevelEl" data-ref="meterLevelEl" class="cbl-level-progress-label no-select"><tpl if="level">{[Slate.cbl.util.Config.getTitleForLevel(values.level)]}</tpl></div>',
            '<div id="{id}-meterPercentEl" data-ref="meterPercentEl" class="cbl-level-progress-percent">{percentComplete:number(values.percentFormat)}</div>',
        '</div>',

        '<div class="stats-ct">',
            '<table class="stats">',
                '<thead>',
                    '<th>Baseline Score</th>',
                    '<th>Performance Level</th>',
                    '<th>My Growth</th>',
                '</thead>',
                '<tbody>',
                    '<td id="{id}-baselineRatingEl" data-ref="baselineRatingEl">',
                        '<tpl if="baselineRating">',
                            '{baselineRating:number(values.averageFormat)}',
                        '<tpl else>',
                            '&mdash;',
                        '</tpl>',
                    '</td>',
                    '<td id="{id}-averageEl" data-ref="averageEl">',
                        '<tpl if="demonstrationsAverage">',
                            '{demonstrationsAverage:number(values.averageFormat)}',
                        '<tpl else>',
                            '&mdash;',
                        '</tpl>',
                    '</td>',
                    '<td id="{id}-growthEl" data-ref="growthEl">',
                        '<tpl if="growth || growth === 0">',
                            '{[ this.renderGrowth(values.growth,values.growthFormat) ]}',
                        '<tpl else>',
                            '&mdash;',
                        '</tpl>',
                    '</td>',
                '</tbody>',
            '</table>',
        '</div>',

        '<div id="{id}-explainerEl" data-ref="explainerEl" class="slate-simplepanel-body explainer" <tpl if="!competency.Statement">style="display:none"</tpl>>',
            '<p id="{id}-statementEl" data-ref="statementEl">{[fm.preventOrphans(fm.htmlEncode(values.competency.Statement))]}</p>',
        '</div>',

        '<ul id="{id}-skillsCt" data-ref="skillsCt" class="cbl-skill-meter">',
            '<tpl if="skills">',
                '{% values.skillsTpl.applyOut(values.skills, out); %}',
            '</tpl>',
        '</ul>',
        {
            renderGrowth: function(growth, format) {
                return Ext.util.Format.sign(growth,"-","+","") + Ext.util.Format.number(Math.abs(growth), format);
            }
        }
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
        'explainerEl',
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
            '<li class="cbl-skill" data-skill="{Code}">',
                '<h5 class="cbl-skill-name">{Descriptor:htmlEncode}</h5>',

                '<ul class="cbl-skill-demos">',
                    '<tpl for="demonstrations">',
                        '<tpl if=".">',
                            '<li',
                                ' data-demonstration="{DemonstrationID}"',
                                ' title="',
                                    '<tpl if="Override">',
                                        '[Overridden]',
                                    '<tpl else>',
                                        '{[fm.htmlEncode(Slate.cbl.util.Config.getTitleForRating(values.DemonstratedLevel))]}',
                                    '</tpl>',
                                '"',
                                ' class="',
                                    ' cbl-skill-demo',
                                    '<tpl if="Override">',
                                        ' cbl-skill-override',
                                        ' cbl-skill-span-{[xcount - xindex + 1]}',
                                    '<tpl else>',
                                        ' cbl-rating-{DemonstratedLevel}',
                                    '</tpl>',
                                    '<tpl if="DemonstratedLevel || Override">',
                                        ' cbl-skill-demo-counted',
                                    '<tpl elseif="!DemonstratedLevel">',
                                        ' cbl-skill-demo-missed',
                                    '<tpl else>',
                                        ' cbl-skill-demo-empty',
                                    '</tpl>',
                                '"',
                            '>',
                                '<tpl if="Override">',
                                    '<i class="fa fa-check"></i>',
                                '<tpl else>',
                                    '{[fm.htmlEncode(Slate.cbl.util.Config.getAbbreviationForRating(values.DemonstratedLevel))]}',
                                '</tpl>',
                            '</li>',
                            '{% if (values.Override) break; %}', // don't print any more blocks after override
                        '<tpl else>',
                            '<li class="cbl-skill-demo cbl-skill-demo-empty">&nbsp;</li>',
                        '</tpl>',
                    '</tpl>',

                    '<li class="cbl-skill-complete-indicator <tpl if="isLevelComplete">is-checked</tpl>">',
                        '<i class="fa fa-2x fa-check"></i>',
                    '</li>',
                '</ul>',

                '<div class="cbl-skill-description"><p>{Statement}</p></div>',
            '</li>',
        '</tpl>'
    ],


    // component template methods
    getElConfig: function () {
        var config = this.callParent();

        config['data-competency'] = this.getCompetency().getId();

        return config;
    },

    initRenderData: function () {
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
    updateCompetency: function (competency) {
        var me = this,
            htmlEncode = Ext.util.Format.htmlEncode,
            studentCompetency = competency.get('currentStudentCompetency'),
            statement = competency.get('Statement'),
            demonstrationsAverage, level, demonstrationsRequired, percentComplete;

        if (studentCompetency) {
            demonstrationsAverage = studentCompetency.get('demonstrationsAverage');
            level = studentCompetency.get('Level');
            demonstrationsRequired = competency.getTotalDemonstrationsRequired(level);
            percentComplete = demonstrationsRequired === 0 ? 100 : 100 * studentCompetency.get('demonstrationsComplete') / demonstrationsRequired;
        }

        Ext.suspendLayouts();

        me.setConfig({
            level: studentCompetency ? level : null,
            percentComplete: studentCompetency ? percentComplete : null,
            percentMissed: studentCompetency ? 100 * studentCompetency.get('demonstrationsMissed') / demonstrationsRequired : null,
            demonstrationsAverage: studentCompetency ? demonstrationsAverage : null,
            isAverageLow: studentCompetency && percentComplete !== null ? percentComplete >= 50 && demonstrationsAverage !== null && demonstrationsAverage < studentCompetency.get('minimumAverage') : null,
            baselineRating: studentCompetency ? studentCompetency.get('BaselineRating') : null,
            growth: studentCompetency ? studentCompetency.get('growth') : null
        });

        if (me.rendered) {
            me.codeEl.update(htmlEncode(competency.get('Code')));
            me.descriptorEl.update(htmlEncode(competency.get('Descriptor')));
            me.explainerEl.setDisplayed(Boolean(statement));
            me.statementEl.update(htmlEncode(statement));
            me.lookupTpl('skillsTpl').overwrite(me.skillsCt, me.buildSkillsTplData(competency));
        }

        Ext.resumeLayouts(true);
    },

    updateLevel: function (newLevel, oldLevel) {
        var me = this;

        if (oldLevel) {
            me.removeCls('cbl-level-' + oldLevel);
        }

        if (newLevel) {
            me.addCls('cbl-level-' + newLevel);
        }

        if (me.rendered) {
            me.meterLevelEl.update(
                newLevel
                    ? Ext.util.Format.htmlEncode(
                        Slate.cbl.util.Config.getTitleForLevel(newLevel)
                    )
                    : ''
            );
        }
    },

    applyPercentComplete: function (percentComplete) {
        return percentComplete || 0;
    },

    updatePercentComplete: function (percentComplete) {
        var me = this;

        if (me.rendered) {
            percentComplete = Ext.util.Format.number(percentComplete, me.getPercentFormat());

            me.meterBarEl.setStyle('width', percentComplete);
            me.meterBarMissedEl.setStyle('left', percentComplete);
            me.meterPercentEl.update(percentComplete);
        }
    },

    applyPercentMissed: function (percentMissed) {
        return percentMissed || 0;
    },

    updatePercentMissed: function (percentMissed) {
        var me = this;

        if (me.rendered) {
            percentMissed = Ext.util.Format.number(percentMissed, me.getPercentFormat());
            me.meterBarMissedEl.setStyle('width', percentMissed);
        }
    },

    updateDemonstrationsAverage: function (demonstrationsAverage) {
        var me = this;

        if (me.rendered) {
            me.averageEl.update(Ext.util.Format.number(demonstrationsAverage, me.getAverageFormat()));
        }
    },

    updateIsAverageLow: function (isAverageLow) {
        if (this.rendered) {
            this.meterEl.toggleCls('is-average-low', isAverageLow);
        }
    },

    updateBaselineRating: function (baselineRating) {
        var me = this;

        if (me.rendered) {
            me.baselineRatingEl.update(Ext.util.Format.number(baselineRating, me.getAverageFormat()));
        }
    },

    updateGrowth: function (growth) {
        var me = this;

        if (me.rendered) {
          me.growthEl.update(Ext.util.Format.sign(growth,"-","+","") + Ext.util.Format.number(Math.abs(growth), me.getGrowthFormat()));
        }
    },


    // event handlers
    onDemoCellClick: function (ev, target) {
        target = Ext.get(target);

        this.fireEvent(
            'democellclick',
            this,
            {
                targetEl: target,
                skill: target.up('.cbl-skill').getAttribute('data-skill'),
                demonstration: parseInt(target.getAttribute('data-demonstration'), 10)
            },
            ev
        );
    },


    // internal methods
    buildSkillsTplData: function (competency) {
        var studentCompetency = competency.get('currentStudentCompetency'),
            level = studentCompetency && studentCompetency.get('Level'),
            demonstrationsBySkill = studentCompetency && studentCompetency.get('effectiveDemonstrationsData'),

            skills = competency.get('Skills'),
            skillsLength = skills.length,
            skillIndex = 0, skill,
            requirements, demonstrationsRequired, demonstrations, demonstrationsCount, lastDemonstration, isSkillComplete,
            tplData = [],
            sorter;

        for (; skillIndex < skillsLength; skillIndex++) {
            skill = skills[skillIndex];
            requirements = skill.DemonstrationsRequired;

            demonstrationsRequired = requirements[level];
            if (typeof demonstrationsRequired == 'undefined') {
                demonstrationsRequired = requirements.default;
                if (typeof demonstrationsRequired == 'undefined') {
                    demonstrationsRequired = 1;
                }
            }

            demonstrations = Ext.Array.clone(demonstrationsBySkill && demonstrationsBySkill[skill.ID] || []);
            demonstrationsCount = demonstrations.length;
            lastDemonstration = demonstrationsCount && demonstrations[demonstrationsCount - 1];

            /* eslint-disable no-extra-parens */
            isSkillComplete = (
                // mark complete if any override is present...
                lastDemonstration && lastDemonstration.Override

                // ...or every skill is marked with non-M demos
                || (
                    demonstrationsCount >= demonstrationsRequired
                    && demonstrations.every((demo) => demo.DemonstratedLevel > 0)
                )
            );
            /* eslint-enable no-extra-parens */

            // fill demonstrations array with undefined items
            demonstrations.length = demonstrationsRequired || 1;

            tplData.push(Ext.applyIf({
                isLevelComplete: isSkillComplete,
                demonstrations: demonstrations
            }, skill));
        }

        // sort by Skill Code
        sorter = new Slate.sorter.Code({
            codeFn: function (item) {
                return item.Code;
            }
        });

        return Ext.Array.sort(tplData, Ext.util.Sortable.createComparator([sorter]));
    }
});
