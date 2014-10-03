{extends "designs/site.tpl"}

{block "css"}
    {$dwoo.parent}
    {cssmin cbl-grid.css}
    <link rel="stylesheet" href="/app/ext-5.0.0/build/packages/ext-theme-crisp-touch/build/resources/ext-theme-crisp-touch-all.css">
{/block}

{block "js-bottom"}
    {$dwoo.parent}
    <script>{literal}
        Ext.onReady(function() {
            var table = Ext.getBody().down('.cbl-grid');

            Ext.select('.cbl-grid-progress-row', true).on('click', function(ev, t) {
                var progressRow = ev.getTarget('tr', null, true),
                    progressCells = progressRow.select('td'),
                    skillsRow = progressRow.next('.cbl-grid-skills-row'),
                    skillRows = skillsRow.select('.cbl-grid-skill-row');
                
                skillsRow.down('.cbl-grid-skills-ct').toggleCls('is-expanded');

                progressCells.each(function(el, all, i) {
                    var level = el.getAttribute('data-level');

                    skillRows.each(function(el, all) {
                        var skillCells = el.select('td');
                        skillCells.item(i).addCls('cbl-level-' + level);
                    });
                });
            });

            var skillsPopover = Ext.create('Ext.Component', {
                autoEl: 'aside',
                componentCls: 'popover',
                cls: 'point-left',
                defaultAlign: 'tl-tr',
                floating: true,
                tpl: [
                    '<h1 class="popover-title">',
                        '<svg class="popover-pointer-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 10" aria-hidden="true" role="presentation">',
                            '<polygon class="popover-pointer" points="0,5 5,0 5,10" />',
                        '</svg>',
                        '{title}',
                    '</h1>',
                    '<div class="popover-body">{body}</div>'
                ]
            });
            
            Ext.select('.cbl-grid-skills-grid', true).on('mouseover', function(ev, t) {
                if (skillsPopover.isHidden() || !skillsPopover.rendered) {
                    var skillCell = Ext.get(t),
                        skillName = skillCell.getAttribute('data-skill-name'),
                        skillDesc = skillCell.getAttribute('data-skill-description');
    
                    if (skillName && skillDesc) {
                        skillsPopover.showBy(t);
                        skillsPopover.update({ title: skillName, body: skillDesc });
                    }
                }
            }, this, { delegate: '.cbl-grid-skill-name' });
            
            Ext.select('.cbl-grid-skills-grid', true).on('mouseout', function(ev, t) {
                skillsPopover.hide();
            });
        });
    {/literal}</script>
{/block}

{block "content"}
    <header class="page-header">
        <div class="header-buttons">
            <a class="button" href="/demonstrations/create">Log a Demonstration</a>
        </div>

        <div class="inline-fields">
            {capture assign=studioSelect}
                <select>
                    <option>Studio</option>
                </select>
            {/capture}
            {labeledField html=$studioSelect type=select label=Group}
            
            {capture assign=contentAreaSelect}
                <select>
                    <option>Math</option>
                </select>
            {/capture}
            {labeledField html=$contentAreaSelect type=select label="Content Area"}
        </div>
    </header>
    
    {$students = array(
        "Jessie Cunningham",
        "Christian Kunkel",
        "Christopher Alfano",
        "Jonathan Thomas Fazio III",
        "Alexandra Wiest",
        "Daniel Harvith",
        "Jesse Cleverpork",
        "Buddhist Crinkle",
        "Topher Falafel",
        "Luke Lombardi",
        "Ally Eist",
        "Manfred Kaplan",
    )}
    
    {$competencies = array(
        "Number & Quantity",
        "Algebra",
        "Functions",
        "Geometry",
        "Data",
        "Mathematical Practice"
    )}
    
    {$skills = array(
        array(name="Congruence",                    demosNeeded = 5, description="Lorem ipsum dolor sit amet, consectetur adipiscing elitnean molestie massa sed eros aliquam suscipit. Morbi sagittis lorem nec massa laoreet, ac varius massa aliquet. Praesent eget imperdiet eros, vitae tempus lacus. Mauris molestie mattis lacus massa aliquet."),
        array(name="Similarity, right triangles, and trigonometry",   demosNeeded = 2, description="Lorem ipsum dolor sit amet, consectetur adipiscing elitnean molestie massa sed eros aliquam suscipit. Morbi sagittis lorem nec massa laoreet, ac varius massa aliquet. Praesent eget imperdiet eros, vitae tempus lacus. Mauris molestie mattis lacus massa aliquet."),
        array(name="Circles",                       demosNeeded = 3, description="Lorem ipsum dolor sit amet, consectetur adipiscing elitnean molestie massa sed eros aliquam suscipit. Morbi sagittis lorem nec massa laoreet, ac varius massa aliquet. Praesent eget imperdiet eros, vitae tempus lacus. Mauris molestie mattis lacus massa aliquet."),
        array(name="Properties of equality",        demosNeeded = 4, description="Lorem ipsum dolor sit amet, consectetur adipiscing elitnean molestie massa sed eros aliquam suscipit. Morbi sagittis lorem nec massa laoreet, ac varius massa aliquet. Praesent eget imperdiet eros, vitae tempus lacus. Mauris molestie mattis lacus massa aliquet."),
        array(name="Measurement and dimensions",    demosNeeded = 3, description="Lorem ipsum dolor sit amet, consectetur adipiscing elitnean molestie massa sed eros aliquam suscipit. Morbi sagittis lorem nec massa laoreet, ac varius massa aliquet. Praesent eget imperdiet eros, vitae tempus lacus. Mauris molestie mattis lacus massa aliquet."),
        array(name="Modeling",                      demosNeeded = 6, description="Lorem ipsum dolor sit amet, consectetur adipiscing elitnean molestie massa sed eros aliquam suscipit. Morbi sagittis lorem nec massa laoreet, ac varius massa aliquet. Praesent eget imperdiet eros, vitae tempus lacus. Mauris molestie mattis lacus massa aliquet.")
    )}
    
    <div class="cbl-grid-ct">
        <table class="cbl-grid">
            <colgroup class="cbl-grid-competency-col"></colgroup>
            <colgroup span="12" class="cbl-grid-progress-col"></colgroup>

            <thead>
                <tr>
                    <td class="cbl-grid-corner-cell"></td>
                    {foreach item=student from=$students}<th class="cbl-grid-student-name">{$student}</th>{/foreach}
                </tr>
            </thead>

            <tbody>
                {foreach item=comp from=$competencies}
                    <tr class="cbl-grid-progress-row">
                        <th class="cbl-grid-competency-name"><div class="ellipsis">{$comp}</div></th>
                        {foreach item=student from=$students}
                            {$level = rand(9, 12)}
                            {$percent = rand(0, 99)}
                            <td class="cbl-grid-progress-cell cbl-level-{$level}" data-level="{$level}">
                                <span class="cbl-grid-progress-bar" style="width: {$percent}%"></span>
                                <span class="cbl-grid-progress-level">L{$level}</span>
                                <span class="cbl-grid-progress-percent">{$percent}%</span>
                                <span class="cbl-grid-progress-average">9.25</span>
                            </td>
                        {/foreach}
                    </tr>
                    <tr class="cbl-grid-skills-row">
                        <td class="cbl-grid-skills-cell" colspan="13">
                            <div class="cbl-grid-skills-ct">
                                <table class="cbl-grid-skills-grid">
                                    <colgroup class="cbl-grid-skill-col"></colgroup>
                                    <colgroup span="12" class="cbl-grid-demos-col"></colgroup>
                                    <tbody>
                                        {foreach item=skill from=$skills}
                                            <tr class="cbl-grid-skill-row">
                                                <th class="cbl-grid-skill-name" data-skill-name="{$skill.name}" data-skill-description="{$skill.description}">
                                                    <div class="ellipsis">{$skill.name}</div>
                                                </th>
                                                {foreach item=student from=$students}
                                                    {$level = rand(9, 12)}
                                                    {$demosComplete = rand(0, $skill.demosNeeded)}
                                                    <td class="cbl-grid-demos-cell">
                                                        <ul class="cbl-grid-demos">
                                                            {for demo from=1 to=$skill.demosNeeded}
                                                                <li class="cbl-grid-demo {if $demo lte $demosComplete}is-complete{/if}"></li>
                                                            {/for}
                                                        </ul>
                                                    </td>
                                                {/foreach}
                                            </tr>
                                        {/foreach}
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                {/foreach}
            </tbody>
            
            <tfoot>
                <tr>
                    <td colspan="13" class="cbl-grid-legend">
                        {for level 9 12}<span class="cbl-grid-legend-item cbl-level-{$level}">L{$level}</span>{/for}
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
{/block}