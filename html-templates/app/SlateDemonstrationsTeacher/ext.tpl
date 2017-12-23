{extends app/slate-ext.tpl}

{block meta}
    {capture assign=title}Demonstrations Teacher Dashboard &mdash; {Site::$title|escape}{/capture}
    {$dwoo.parent}
{/block}

{block body}
    {$dwoo.parent}

    <div class="wrapper site">
        <main class="content site" role="main">
            <div class="inner">
                <div id="slateapp-viewport">
                    <!-- app renders here -->
                </div>
            </div>
        </main>
    </div>
{/block}