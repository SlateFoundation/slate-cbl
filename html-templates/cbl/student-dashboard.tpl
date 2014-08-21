{extends "designs/site.tpl"}

{block "css"}
    {$dwoo.parent}
    {cssmin "student-dashboard.css"}
{/block}

{block "js-bottom"}
    {$dwoo.parent}

    <script>
        Ext.onReady(function(){
            var progressDomains = {
                    "Use the properties": 10,
                    "Use units": 9,
                    "Use irrational numbers": 10,
                    "Use rational numbers": 10
                },
                competencies = [{
                    "name": "Number and Quantity",
                    "level": 9,
                    "progress": 0.66,
                    "skills": [{
                        "name": "Use the properties of rational and irrational numbers",
                        "demos": [9, 10, 10, 10, 10]
                    },{
                        "name": "Use units to solve problems",
                        "demos": [9, 0]
                    },{
                        "name": "Use the properties of rational and irrational numbers",
                        "demos": [9, 10, 0]
                    },{
                        "name": "Use the properties of rational and irrational numbers",
                        "demos": [9, 9, 0, 0]
                    }]
                },{
                    "name": "Algebra",
                    "level": 10,
                    "progress": 0.66,
                    "skills": [{
                        "name": "Use the properties of rational and irrational numbers",
                        "demos": [10, 10, 10, 0]
                    },{
                        "name": "Use the properties of rational and irrational numbers",
                        "demos": [0, 0, 0, 0, 0]
                    },{
                        "name": "Use the properties of rational and irrational numbers",
                        "demos": [10, 11, 0]
                    }]
                }],
                summaryTarget = Ext.get('progress-summary').down('tbody'),
                detailsTarget = Ext.get('progress-details'),
                summaryTpl,
                detailsTpl;
            
            {literal}
            summaryTpl = Ext.create('Ext.XTemplate', [
                '<tpl foreach=".">',
                    '<tr>',
                        '<td class="col-data scoring-domain-col">{$}</td>',
                        '<td class="col-data level-col"><div class="cbl-level-{.}">{.}</div></td>',
                    '</tr>',
                '</tpl>'
            ]).overwrite(summaryTarget, progressDomains);
            
            detailsTpl = Ext.create('Ext.XTemplate', [
                '<tpl for=".">',
                    '<li class="panel cbl-competency-panel">',
                        '<header class="panel-header">',
                            '<h4 class="header-title">{name}</h4>',
                        '</header>',
                        
                        '<div class="panel-body">',
                            '<div class="cbl-progress-meter cbl-level-{level}">',
                                '<div class="cbl-progress-bar" style="width:{progress * 100}%"></div>',
                                '<div class="cbl-progress-level">L{level}</div>',
                                '<div class="cbl-progress-percent">{progress * 100}%</div>',
                            '</div>',

                            '<ul class="cbl-skill-meter">',
                                '<tpl for="skills">',
                                    '{% values.level = parent.level %}', // TODO obviate this workaround
                                    '<li class="cbl-skill">',
                                        '<h5 class="cbl-skill-name">{name}</h5>',
                                        '<ul class="cbl-skill-demos">',
                                            '<tpl for="demos">',
                                                '<li class="cbl-skill-demo <tpl if="values &gt; 0">cbl-level-{parent.level}<tpl else>is-empty</tpl>">',
                                                    '<tpl if="values &gt; 0">',
                                                        '{.}',
                                                        '<tpl else>&nbsp;',
                                                    '</tpl>',
                                                '</li>',
                                            '</tpl>',
                                        '</ul>',
                                        '<div class="cbl-skill-complete-indicator cbl-level-{parent.level} is-checked">',
                                            '<svg class="check-mark-image" width="16" height="16">',
                                                '<polygon class="check-mark" points="13.824,2.043 5.869,9.997 1.975,6.104 0,8.079 5.922,14.001 15.852,4.07"/>',
                                            '</svg>',
                                        '</div>',
                                    '</li>',
                                '</tpl>',
                            '</ul>',
                        '</div>',
                    '</li>',
                '</tpl>'
            ]).overwrite(detailsTarget, competencies);
            {/literal}
        });
    </script>
{/block}

{block "content"}
    <aside class="panel cbl-recent-progress">
        <header class="panel-header">
            <h3 class="header-title">Recent Progress</h3>
        </header>

        <table class="panel-body" id="progress-summary">
            <thead>
                <tr>
                    <th class="col-header scoring-domain-col">Scoring Domain</th>
                    <th class="col-header level-col">Level</th>
                </tr>
            </thead>

            <tbody></tbody>
        </table>
    </aside>

    <header class="page-header">
        <h2 class="header-title">Student Name</h2>
        <div class="cbl-labeled-meter">
            <h3 class="cbl-meter-label">Graduation Progress</h3>
            <div class="cbl-progress-meter cbl-level-10">
                <div class="cbl-progress-bar" style="width:40%"></div>
                <div class="cbl-progress-level">L10</div>
                <div class="cbl-progress-percent">40%</div>
            </div>
        </div>
    </header>
    
    <form>
        <div class="inline-fields">
            <div class="field">
                <select class="field-control">
                    <option>Math</option>
                </select>
            </div>
            <button class="button primary">Show Rubric Details</button>
        </div>
    </form>
    
    <ul class="cbl-competency-panels" id="progress-details"></ul>
{/block}