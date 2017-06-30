{extends app/slate-ext.tpl}

{block meta}
    {capture assign=title}Demonstrations Teacher Dashboard &mdash; {Site::$title|escape}{/capture}
    {$dwoo.parent}
{/block}

{block body}
    {$dwoo.parent}

    {$allContentAreas = Slate\CBL\ContentArea::getAll()}

    {load_templates subtemplates/forms.tpl}

    <div class="wrapper site">
        <main class="content site" role="main">
            <div class="inner">
                <header class="page-header">
                    <div class="header-buttons">
                        <button type="button" class="primary" data-action="demonstration-create">Submit Evidence</button>
                        {if Slate\CBL\CBL::$continuaUrl}
                            <a class="button primary" href="{Slate\CBL\CBL::$continuaUrl|escape}" target="_blank">View the Continua</a>
                        {/if}
                    </div>
                </header>

                <div id="slateapp-viewport">
                    <!-- app renders here -->
                </div>
            </div>
        </main>
    </div>
{/block}