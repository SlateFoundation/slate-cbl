{extends designs/site.tpl}

{block content}
    <h3>Graduate Students</h3>
    {if count($studentsGraduating)}
        <ul>
        {foreach item=Student key=StudentID from=$studentsGraduating}
            <li>
                {$Student.name} {if $pretend}is eligible to graduate{else}has been graduated{/if} in the following competencies:
                <ul>
                    {foreach item=competency from=$Student.competencies}
                        <li>{$competency.currentLevel} &rarr; {$competency.nextLevel} in {$competency.code}</li>
                    {/foreach}
                </ul>
            </li>
        {/foreach}
        </ul>
    {elseif $.server.REQUEST_METHOD == POST}
        <em>No students are eligible to graduate a level</em>
    {/if}

    <form method="POST">
        <label for="pretend">Pretend</label>
        <input type="hidden" name="pretend" value="0">
        <input id="pretend" type="checkbox" name="pretend" value="1" {refill field=pretend checked=1 default=1}>
        <input type="submit">
    </form>
{/block}