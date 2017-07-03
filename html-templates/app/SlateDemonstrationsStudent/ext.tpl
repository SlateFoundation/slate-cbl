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

    <div class="wrapper site">
        <main class="content site" role="main">
            <div id="slateapp-viewport" class="inner">
                <!-- app renders here -->
            </div>
        </main>
    </div>
{/block}