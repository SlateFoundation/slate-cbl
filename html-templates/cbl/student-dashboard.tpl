{extends "designs/site.tpl"}

{block "css"}
    {$dwoo.parent}
    {cssmin "student-dashboard.css"}
{/block}

{block "content"}
    {$allContentAreas = Slate\CBL\ContentArea::getAll()}

    {*
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
    *}

    <header class="page-header">
        <h2 class="header-title">{$Student->FullName|escape}</h2>

        {*
        <div class="cbl-labeled-meter">
            <h3 class="cbl-meter-label">Graduation Progress</h3>
            <div class="cbl-progress-meter cbl-level-10">
                <div class="cbl-progress-bar" style="width:40%"></div>
                <div class="cbl-progress-level">L10</div>
                <div class="cbl-progress-percent">40%</div>
            </div>
        </div>
        *}
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
            <button class="button primary">Show Rubric Details</button>
            {if Slate\CBL\CBL::$continuaUrl}
                <a class="button primary" href="{Slate\CBL\CBL::$continuaUrl}" target="_blank">View the Continua</a>
            {/if}
        </div>
    </form>

    {if $ContentArea}
        <ul class="cbl-competency-panels competencies-unloaded" id="studentDashboardCompetenciesList"></ul>
    {/if}
{/block}

{block js-bottom}
    {if $ContentArea}
        <script type="text/javascript">
            var SiteEnvironment = SiteEnvironment || { };
            SiteEnvironment.user = {$.User->getData()|json_encode};
            SiteEnvironment.cblStudent = {JSON::translateObjects($Student, true)|json_encode};
            SiteEnvironment.cblContentArea = {JSON::translateObjects($ContentArea)|json_encode};
        </script>

        {$dwoo.parent}

        {if $.get.jsdebug}
            {sencha_bootstrap
                patchLoader=false
                packageRequirers=array('sencha-workspace/pages/src/page/StudentCompetencyDashboard.js')
            }
        {else}
            <script src="{Site::getVersionedRootUrl('js/pages/StudentCompetencyDashboard.js')}"></script>
        {/if}

        <script>
            Ext.require('Site.page.StudentCompetencyDashboard');
        </script>
    {/if}
{/block}