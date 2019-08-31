{extends designs/site.tpl}

{block title}Enroll Students in Competencies &mdash; {$dwoo.parent}{/block}

{block content}
    <form method="POST">
        {capture assign=studentsSelect}
            <select class="field-control inline medium" name="students">
                <option value="">&ndash;select&ndash;</option>
                {if count($.User->CurrentCourseSections)}
                    <optgroup label="My Sections">
                        {foreach item=Section from=$.User->CurrentCourseSections}
                            <option value="section {$Section->Code|escape}" {refill field=students selected="section $Section->Code"}>{$Section->Code|escape}</option>
                        {/foreach}
                    </optgroup>
                {else}
                    {$Term = Slate\Term::getClosest()}
                    {if $Term}
                        {$termIds = $Term->getRelatedTermIDs()|implode:','}
                        <optgroup label="All Sections in {$Term->Title}">
                            {foreach item=Section from=Slate\Courses\Section::getAllByWhere("TermID IN ($termIds)")}
                                <option value="section {$Section->Code|escape}" {refill field=students selected="section $Section->Code"}>{$Section->Code|escape}</option>
                            {/foreach}
                        </optgroup>
                    {/if}
                {/if}
                <optgroup label="All Groups">
                    {foreach item=Group from=Emergence\People\Groups\Group::getAll(array(order=array(Left=ASC)))}
                        <option value="group {$Group->Handle|escape}" {refill field=students selected="group $Group->Handle"}>{$Group->getFullPath(' ▸ ')|escape}</option>
                    {/foreach}
                </optgroup>
            </select>
        {/capture}
        {labeledField html=$studentsSelect type=select label=Students class=auto-width}

        {capture assign=contentAreaSelect}
            <select class="field-control inline medium" name="content-area[]" multiple style="height:15em">
                {foreach item=availableArea from=Slate\CBL\ContentArea::getAll(array('order' => 'Code'))}
                    <option value="{$availableArea->Code}" {refill field=content-area selected=$availableArea->Code}>{$availableArea->Code|escape}: {$availableArea->Title|escape}</option>
                {/foreach}
            </select>
        {/capture}
        {labeledField html=$contentAreaSelect type=select label="Content Area" class=auto-width}

        {field label='Initial Level' inputName=level default=9 type=number class=tiny attribs="min=1"}
        {field label='Baseline Rating' inputName=baselineRating type=number class=small attribs="min=.01 step=.01"}

        <input type="submit" value="Enroll students in all selected competencies">
    </form>
{/block}