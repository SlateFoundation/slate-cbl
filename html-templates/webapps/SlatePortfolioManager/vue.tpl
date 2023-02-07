{extends "webapps/slate-vue.tpl"}

{block meta}
    {capture assign=title}Portfolio Manager &mdash; {Site::$title|escape}{/capture}
    {$dwoo.parent}
{/block}

{block body}
    {$dwoo.parent}

    <div class="wrapper site">
        <main class="content site" role="main">
            <div id="app-container">
                <!-- app renders here -->
            </div>
        </main>
    </div>
{/block}