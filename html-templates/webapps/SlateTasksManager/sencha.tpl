{extends "webapps/slate-sencha.tpl"}

{block meta}
    {capture assign=title}Tasks Manager &mdash; {Site::$title|escape}{/capture}
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