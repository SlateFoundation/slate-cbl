/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.view.student.Dashboard', {
    extend: 'Ext.Component',
    xtype: 'slate-cbl-student-dashboard',
    requires:[
        'Slate.cbl.view.student.DashboardController',
        'Slate.cbl.model.ContentArea',
        'Slate.cbl.model.Competency',
        'Slate.cbl.model.ContentArea',
        'Slate.cbl.widget.Popover'
    ],

    controller: 'slate-cbl-student-dashboard',

    config: {
        contentArea: null,
        popover: {
            pointer: 'none'
        }
    },

    competenciesTpl: [
        '<tpl for="competencies">',
        '{%var level = 9%}', // TODO: real level
        '{%var studentCompletion = values.studentCompletions[parent.student.ID] || {}%}',
        '{%var percent = Math.round(100 * (studentCompletion.demonstrationsCount || 0) / values.totalDemonstrationsRequired)%}',
        '{%var isAverageLow = studentCompletion.demonstrationsAverage < values.minimumAverage && percent >= 50%}',
        '<li class="panel cbl-competency-panel cbl-level-{[level]}" data-competency="{ID}">',
        '<header class="panel-header">',
        '<h3 class="header-title">{Descriptor}</h3>',
        '</header>',

        '<div class="panel-body">',
        '<div class="cbl-progress-meter {[isAverageLow ? "is-average-low" : ""]}">',
        '<div class="cbl-progress-bar" style="width:{[percent]}%"></div>',
        '<div class="cbl-progress-level no-select">L{[level]}</div>',
        '<div class="cbl-progress-percent">{[percent]}%</div>',
        '<div class="cbl-progress-average" title="Average">{[fm.number(studentCompletion.demonstrationsAverage, "0.##")]}</div>',
        '</div>',

        '<div class="explainer">',
        '<p>{Statement}</p>',
        '</div>',

        '<ul class="cbl-skill-meter skills-unloaded"></ul>',
        '</div>',
        '</li>',
        '</tpl>'
    ],
    
    skillsTpl: [
        '<tpl for=".">',
            '<li class="cbl-skill">',
                '<h5 class="cbl-skill-name" data-descriptor="{Descriptor}" data-statement="{Statement}">{Descriptor}</h5>',
                '<ul class="cbl-skill-demos" data-skill="{ID}">',
                    '<tpl for="this.getDemonstrationBlocks(values)">',
                        '<li class="cbl-skill-demo <tpl if="values.Level==0"> cbl-grid-demo-missed</tpl>" <tpl if="DemonstrationID">data-demonstration="{DemonstrationID}"</tpl>>',
                            '<tpl if="values.Level &gt;= 0">',
                                '{[values.Level == 0 ? "M" : values.Level]}',
                            '<tpl else>',
                                '&nbsp;',
                            '</tpl>',
                        '</li>',
                    '</tpl>',
                '</ul>',
                '<div class="cbl-skill-description"><p>{Statement}</p></div>',
//                '<div class="cbl-skill-complete-indicator cbl-level-{parent.level} is-checked">',
//                    '<svg class="check-mark-image" width="16" height="16">',
//                        '<polygon class="check-mark" points="13.824,2.043 5.869,9.997 1.975,6.104 0,8.079 5.922,14.001 15.852,4.07"/>',
//                    '</svg>',
//                '</div>',
            '</li>',
        '</tpl>',
        
        {
            sortDemonstrations: function sortDemonstrations(demonstrations, limit) {
                'use strict';
                demonstrations = Ext.isArray(demonstrations) ? demonstrations : [];
                
                var len = demonstrations.length,
                    x = 0,
                    i = 0,
                    demo,
                    sortedDemonstrations = {},
                    levelsSorted,
                    demos,
                    demosLen,
                    displayDemonstrations = [],
                    scored = [],
                    missed = [];
                
                // If no limit is specified, sort all demonstrations
                limit = isNaN(limit) ? len : limit;

                // Define functions outside of loops
                function sortByNewest(a, b) {
                    // Newest first
                    return a.Demonstrated > b.Demonstrated ? -1 : a.Demonstrated < b.Demonstrated ? 1 : 0;
                }
                
                function sortByOldest(a, b) {
                    // Oldest first
                    return a.Demonstrated > b.Demonstrated ? 1 : a.Demonstrated < b.Demonstrated ? -1 : 0;
                }
                
                // Separate demonstrations by level
                for (x = 0; len > x; x++) {
                    demo = demonstrations[x];
                    sortedDemonstrations[demo.Level] = sortedDemonstrations[demo.Level] || [];
                    sortedDemonstrations[demo.Level].push(demo);
                }
                
                // Sort the levels of demonstrations observed from greatest to least
                levelsSorted = Object.keys(sortedDemonstrations).sort(function (a, b) {
                    a = parseInt(a, 10);
                    b = parseInt(b, 10);
                    return a > b ? -1 : a < b ? 1 : 0;
                });
                
                // Loop over demonstrations starting with the highest levels
                levelLoop:
                for (x = 0, len = levelsSorted.length; len > x; x++) {       
                    // Sort demonstrations for x-level by date (newest first)
                    demos = sortedDemonstrations[levelsSorted[x]].sort(sortByNewest);
            
                    // Get limit-number of demonstrations
                    for (i = 0, demosLen = demos.length; demosLen > i; i++) {
                        displayDemonstrations.push(demos[i]);
                        if (--limit === 0) {
                            // Break out early
                            break levelLoop;
                        }
                    }
                }
                
                // Split up scored and missed demonstrations while keeping order by date (oldest first)
                displayDemonstrations.sort(sortByOldest).forEach(function(demo) {
                    if (demo.Level > 0) {
                        scored.push(demo);
                    } else {
                        missed.push(demo);
                    }
                });
                
                // Scored demonstrations go on the left, missed demonstrations go on the right
                return scored.concat(missed);
            },
    
            getDemonstrationBlocks: function(skill, studentId) {
                var demonstrationsRequired = skill.DemonstrationsRequired,
                    blocks = this.sortDemonstrations(skill.demonstrations, demonstrationsRequired);
                    
                // add empty blocks
                while (blocks.length < demonstrationsRequired) {
                    blocks.push({});
                }

                return blocks;
            }
        }
    ],

    html: [
        '<ul class="cbl-competency-panels competencies-unloaded" id="studentDashboardCompetenciesList"></ul>'
    ],

    listeners: {
        scope: 'this',
        click: {
            fn: 'onListClick',
            element: 'el',
            delegate: '.cbl-competency-panels, .cbl-competency-panels'
        }
    },

    applyPopover: function(newPopover, oldPopover) {
        return Ext.factory(newPopover, 'Slate.cbl.widget.Popover', oldPopover);
    },

    applyContentArea: function(contentArea) {
        if (!contentArea) {
            return null;
        }

        if (contentArea.isModel) {
            return contentArea;
        }

        if (contentArea === true) {
            contentArea = {};
        }

        return Ext.create('Slate.cbl.model.ContentArea', contentArea);
    },

    updateContentArea: function(newContentArea, oldContentArea) {
        this.fireEvent('contentareachange', this, newContentArea, oldContentArea);
    },

    onListClick: function(ev, t) {
        var me = this,
            targetEl;

        if (targetEl = ev.getTarget('.cbl-skill-demo', me.el, true)) {
            me.fireEvent('democellclick', me, ev, targetEl);
        }
    }
});
