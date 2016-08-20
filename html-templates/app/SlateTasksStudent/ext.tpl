{extends app/slate-ext.tpl}

{block meta}
    {capture assign=title}Tasks Student Dashboard &mdash; {Site::$title|escape}{/capture}
    {$dwoo.parent}
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