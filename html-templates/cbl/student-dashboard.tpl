{extends "designs/site.tpl"}

{block title}Student Competencies Dashboard &mdash; {$dwoo.parent}{/block}

{block "css"}
    {$dwoo.parent}
    {cssmin "cbl/student-dashboard.css"}
    <link rel="stylesheet" type="text/css" href="{Sencha_App::getByName('CompetencyTracker')->getVersionedPath('build/production/resources/CompetencyTracker-all.css')}">
{/block}

{block "content"}
    {$allContentAreas = Slate\CBL\ContentArea::getAll()}

    <aside id="studentDashboardRecentProgress">
    </aside>

    <header class="page-header">
        <h2 class="header-title">{$Student->FullName|escape}</h2>
        
        {* <div class="cbl-labeled-meter cbl-grad-progress">
            <h3 class="cbl-meter-label level-color">Graduation Progress</h3>
            <div class="cbl-progress-meter cbl-level-10">
                <div class="cbl-progress-bar" style="width:40%"></div>
                <div class="cbl-progress-level">L10</div>
                <div class="cbl-progress-percent">40%</div>
            </div>
        </div> *}
    </header>

    <form method="GET">
        {if $.get.student}
            <input type="hidden" name="student" value="{refill student}">
        {/if}
        <div class="inline-fields">
            <div class="field">
                <select class="field-control" name="content-area">
                    {if !$ContentArea}
                        <option value="">Select a rubric</option>
                    {/if}
                    {foreach item=availableArea from=$allContentAreas}
                        <option value="{$availableArea->Code}" {refill field=content-area selected=$availableArea->Code}>{$availableArea->Title|escape}</option>
                    {/foreach}
                </select>
            </div>
            <button class="button primary">Refresh</button>
            {if Slate\CBL\CBL::$continuaUrl}
                <a class="button" href="{Slate\CBL\CBL::$continuaUrl|escape}" target="_blank">View the Continua</a>
            {/if}

        </div>
    </form>

    {if $ContentArea}
        <div id="studentDashboardCt"></div>
    {/if}
{/block}

{block js-bottom}
    {if $ContentArea}

        {$dwoo.parent}

        {if $.get.jsdebug}
            {sencha_bootstrap
            patchLoader=false
            packages=array('slate-theme')
            packageRequirers=array('sencha-workspace/pages/src/page/StudentCompetencyDashboard.js')
            }
        {else}
            <script src="{Site::getVersionedRootUrl('js/pages/StudentCompetencyDashboard.js')}"></script>
        {/if}

        <script>
            Ext.require('Site.page.StudentCompetencyDashboard');
        </script>
    {else}
        {$dwoo.parent}
    {/if}
{/block}
