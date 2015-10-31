{extends designs/site.tpl}

{block content}
    <h3>Graduate Users</h3>
    {foreach item=Student key=StudentID from=$data}
        <span>{$Student["Name"]} {if $pretend}can graduate from{else}was enrolled in{/if} the following competencies:</span>
        <ul>
            {foreach item=Code from=$Student["Competencies"]}
                <li>{$Code}</li>
            {/foreach}
        </ul>
        <br>
    {foreachelse}
        <span>{if $noStudents}All student competencies up to date.{/if}</span>
    {/foreach}

    <form method="POST">
        <label for="pretend">Pretend</label>
        <input type="hidden" name="pretend" value="0">
        <input id="pretend" type="checkbox" name="pretend" value="1" {refill field=pretend checked=1 default=1}>
        <input type="submit">
    </form>
{/block}