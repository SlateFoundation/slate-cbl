{extends designs/site.tpl}

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
        </div>

        <form method="GET" class="inline-fields">
            {capture assign=studioSelect}
                <select name="students" onchange="this.form.submit()" disabled>
                    <option>-select-</option>
                </select>
            {/capture}
            {labeledField html=$studioSelect type=select label=Group}
            
            {capture assign=contentAreaSelect}
                <select name="content-area" onchange="this.form.submit()">
                    <option value="">-select-</option>
                    {foreach item=availableArea from=$allContentAreas}
                        <option value="{$availableArea->Code}" {refill field=content-area selected=$availableArea->Code}>{$availableArea->Title|escape}</option>
                    {/foreach}
                </select>
            {/capture}
            {labeledField html=$contentAreaSelect type=select label="Content Area"}
        </form>
    </header>

    {if $ContentArea}
        <div id='teacherDashboardCt'><div class="text-center"><img class="loading-spinner" src="/img/loaders/spinner.gif" alt=""> Loading teacher dashboard&hellip;</div></div>
    {else}
        <p>Select a content area:</p>
        <ul>
            {foreach item=availableArea from=$allContentAreas}
                <li><a href="?content-area={$availableArea->Code}">{$availableArea->Title|escape}</a></li>
            {/foreach}
        </ul>
    {/if}
{/block}

{block js-bottom}
    {if $ContentArea}
        <script type="text/javascript">
            var SiteEnvironment = SiteEnvironment || { };
            SiteEnvironment.user = {$.User->getData()|json_encode};
            SiteEnvironment.cblStudents = {JSON::translateObjects($students, true)|json_encode};
            SiteEnvironment.cblContentArea = {JSON::translateObjects($ContentArea)|json_encode};
        </script>
    
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
    {/if}
{/block}