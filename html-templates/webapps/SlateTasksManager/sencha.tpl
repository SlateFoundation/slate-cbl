{extends "webapps/slate-sencha.tpl"}

{block meta}
    {capture assign=title}Tasks Manager &mdash; {Site::$title|escape}{/capture}
    {$dwoo.parent}
{/block}