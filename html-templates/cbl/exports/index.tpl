{extends designs/site.tpl}

{block content}
    {foreach from=$data key=scriptName item=script implode="<hr>"}
        <h2>{$scriptName}</h2>

        <form method="POST" action="/cbl/exports/{$scriptName}">
            {field inputName=from placeholder="Enter Date" label="Start Time"}

            {field inputName=to placeholder="Enter Date" label="End Time"}

            {field inputName=students placeholder="Students" label=Students}

            <button>Download</button>
        </form>
    {/foreach}

{/block}