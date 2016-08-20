{extends app/slate-ext.tpl}

{block meta}
    {capture assign=title}Tasks Teacher Dashboard &mdash; {Site::$title|escape}{/capture}
    {$dwoo.parent}
{/block}