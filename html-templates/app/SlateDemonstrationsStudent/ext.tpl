{extends app/slate-ext.tpl}

{block meta}
    {capture assign=title}Demonstrations Student Dashboard &mdash; {Site::$title|escape}{/capture}
    {$dwoo.parent}
{/block}

{block js-data}
    {$dwoo.parent}

    <script type="text/javascript">
        var SiteEnvironment = SiteEnvironment || { };
        SiteEnvironment.cblStudent = {JSON::translateObjects($Student, true)|json_encode};
        SiteEnvironment.cblContentArea = {JSON::translateObjects($ContentArea)|json_encode};
        SiteEnvironment.cblCompetencies = {JSON::translateObjects($ContentArea->Competencies, false, array('totalDemonstrationsRequired', 'minimumAverageOffset'))|json_encode};
    </script>
{/block}

{block body}
    {$dwoo.parent}

    {$allContentAreas = Slate\CBL\ContentArea::getAll()}

    <div class="wrapper site">
        <header class="page-header">
            <h2 class="header-title">{$Student->FullName|escape}</h2>
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

        <main class="content site" role="main">
            <div id="slateapp-viewport" class="inner">
                <!-- app renders here -->
            </div>
        </main>
    </div>
{/block}