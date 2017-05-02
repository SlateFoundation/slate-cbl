{extends app/slate-ext.tpl}

{block meta}
    {capture assign=title}Tasks Student Dashboard &mdash; {Site::$title|escape}{/capture}
    {$dwoo.parent}
{/block}

{block body}
    {$dwoo.parent}

    <div class="wrapper site">
        <main class="content site" role="main">
            <div id="slateapp-viewport">
                <!-- app renders here -->
            </div>
        </main>
    </div>
{/block}

{block js-data}
    {$dwoo.parent}
    {literal}
        <script type="text/javascript">
            var SiteEnvironment = SiteEnvironment || {};

            SiteEnvironment.googleAppsDomain = '{/literal}{\Google\API::$domain}{literal}';
            SiteEnvironment.googleAppsDeveloperKey = 'REPLACE_WITH_DEVELOPER_KEY';
            SiteEnvironment.googleAppsClientId = 'REPLACE_WITH_CLIENT_ID'; // https://developers.google.com/drive/v3/web/enable-sdk
        </script>
    {/literal}
{/block}

{block base}
    {$dwoo.parent}
    <script type="text/javascript" src="//apis.google.com/js/api.js"></script>
{/block}