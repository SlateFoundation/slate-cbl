{extends designs/site.tpl}

{block title}Teacher Competencies Dashboard &mdash; {$dwoo.parent}{/block}

{block "css"}
    {cssmin fonts/font-awesome.css}
    <link rel="stylesheet" type="text/css" href="{Sencha_App::getByName('CompetencyTracker')->getVersionedPath('build/production/resources/CompetencyTracker-all.css')}" />

    {$dwoo.parent}
{/block}

{block content}
    {$allContentAreas = Slate\CBL\ContentArea::getAll()}
    <header class="page-header">
        <div class="header-buttons">
            <button type="button" class="primary" data-action="demonstration-create">Log a Demonstration</button>
            {if Slate\CBL\CBL::$continuaUrl}
                <a class="button primary" href="{Slate\CBL\CBL::$continuaUrl|escape}" target="_blank">View the Continua</a>
            {/if}
        </div>

        <form method="GET" class="inline-fields">
            {capture assign=studentsSelect}
                <select class="field-control inline medium" name="students" onchange="this.form.submit()">
                    <option value="">&ndash;select&ndash;</option>
                    {if count($.User->CurrentCourseSections)}
                        <optgroup label="My Sections">
                            {foreach item=Section from=$.User->CurrentCourseSections}
                                <option value="section {$Section->Code|escape}" {refill field=students selected="section $Section->Code"}>{$Section->Code|escape}</option>
                            {/foreach}
                        </optgroup>
                    {else}
                        {$Term = Slate\Term::getClosest()}
                        {if $Term}
                            {$termIds = $Term->getRelatedTermIDs()|implode:','}
                            <optgroup label="All Sections in {$Term->Title}">
                                {foreach item=Section from=Slate\Courses\Section::getAllByWhere("TermID IN ($termIds)")}
                                    <option value="section {$Section->Code|escape}" {refill field=students selected="section $Section->Code"}>{$Section->Code|escape}</option>
                                {/foreach}
                            </optgroup>
                        {/if}
                    {/if}
                    <optgroup label="All Groups">
                        {foreach item=Group from=Emergence\People\Groups\Group::getAll(array(order=array(Left=ASC)))}
                            <option value="group {$Group->Handle|escape}" {refill field=students selected="group $Group->Handle"}>{$Group->getFullPath(' ▸ ')|escape}</option>
                        {/foreach}
                    </optgroup>
                </select>
            {/capture}
            {labeledField html=$studentsSelect type=select label=Students class=auto-width}
            
            {capture assign=contentAreaSelect}
                <select class="field-control inline medium" name="content-area" onchange="this.form.submit()">
                    <option value="">&ndash;select&ndash;</option>
                    {foreach item=availableArea from=$allContentAreas}
                        <option value="{$availableArea->Code}" {refill field=content-area selected=$availableArea->Code}>{$availableArea->Title|escape}</option>
                    {/foreach}
                </select>
            {/capture}
            {labeledField html=$contentAreaSelect type=select label="Content Area" class=auto-width}
        </form>
    </header>

    {if $ContentArea && $students}
        <div id='teacherDashboardCt'><div class="text-center"><img class="loading-spinner" src="/img/loaders/spinner.gif" alt=""> Loading teacher dashboard&hellip;</div></div>
    {elseif is_array($students) && $ContentArea}
        <p class="notify error">There are currently no students enrolled in the selected group</p>
    {else}
        <p class="notify">Select a student group and content area above to begin</p>
    {/if}
{/block}

{block js-bottom}
    {if $ContentArea && $students}
    
        {$dwoo.parent}
    
        {if $.get.jsdebug}
            {sencha_bootstrap
                patchLoader=false
                packages=array('slate-theme')
                packageRequirers=array('sencha-workspace/pages/src/page/TeacherCompetencyDashboard.js')
            }
        {else}
            <script src="{Site::getVersionedRootUrl('js/pages/TeacherCompetencyDashboard.js')}"></script>
        {/if}
    
        <script>
            Ext.require('Site.page.TeacherCompetencyDashboard');
        </script>
    {else}
        {$dwoo.parent}
    {/if}
{/block}