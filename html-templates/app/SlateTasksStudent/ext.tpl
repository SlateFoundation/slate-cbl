{extends app/slate-ext.tpl}

{block meta}
    {capture assign=title}Tasks Student Dashboard &mdash; {Site::$title|escape}{/capture}
    {$dwoo.parent}
{/block}

{block css-loader}
    {$dwoo.parent}
    {$slateAppFullWidth = false}
{/block}