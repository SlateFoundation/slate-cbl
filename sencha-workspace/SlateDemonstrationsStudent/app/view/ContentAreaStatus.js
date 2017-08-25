Ext.define('SlateDemonstrationsStudent.view.ContentAreaStatus', {
    extend: 'Ext.Component',
    xtype: 'slate-demonstrations-student-contentareastatus',
    requires: [
    ],

    config: {
        cls: [
            'cbl-level-10', // TODO remove, set dynamically instead
            'cbl-competency-panel',
            'cbl-contentarea-status'
        ]
    },

    // TODO remove this block of fake data
    renderData: {
        percentComplete: 40,
        level: 10
    },

    // TODO this is pretty much shared with CompetencyCard... refactor?
    renderTpl: [
        '<header class="panel-header">',
            '<h3 class="header-title">My English Competencies</h3>', // TODO dynamic
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
                        '<th>Missed Skills</th>',
                        '<th>Overall Performance Level</th>',
                        '<th>Overall Growth</th>',
                    '<tbody>',
                        '<td>2</td>',
                        '<td>{[ this.getPerformanceLevel(values) ]}</td>',
                        '<td>0.8 yr</td>',
                    '</tbody>',
                '</table>',
            '</div>',
        '</div>',
        {
            getPerformanceLevel: function(values) {
                var level = false;

                if (values.demonstrationsAverage && values.$comp.getAverageFormat()) {
                    level = Ext.util.Format.number(values.demonstrationsAverage, values.$comp.getAverageFormat());
                }

                return level || '&mdash;';
            }
        }
    ]

});