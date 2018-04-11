{extends app/slate-ext.tpl}

{block meta}
    {capture assign=title}Demonstrations Teacher Dashboard &mdash; {Site::$title|escape}{/capture}
    {$dwoo.parent}
{/block}

{block js-data}
    {$dwoo.parent}

    {if $ContentArea && $students}
        <script type="text/javascript">
            var SiteEnvironment = SiteEnvironment || { };
            SiteEnvironment.cblStudents = {JSON::translateObjects($students, true)|json_encode};
            SiteEnvironment.cblContentArea = {JSON::translateObjects($ContentArea)|json_encode};
            SiteEnvironment.cblCompetencies = {JSON::translateObjects($ContentArea->Competencies, false, array('totalDemonstrationsRequired', 'minimumAverageOffset'))|json_encode};
            SiteEnvironment.cblExperienceTypeOptions = {Slate\CBL\Demonstrations\ExperienceDemonstration::$experienceTypeOptions|json_encode};
            SiteEnvironment.cblContextOptions = {Slate\CBL\Demonstrations\ExperienceDemonstration::$contextOptions|json_encode};
            SiteEnvironment.cblPerformanceTypeOptions = {Slate\CBL\Demonstrations\ExperienceDemonstration::$performanceTypeOptions|json_encode};
        </script>
    {/if}
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

                    <form method="GET" class="inline-fields">
                        {capture assign=studentsSelect}
                            <select class="field-control inline xlarge" name="students" onchange="this.form.submit()">
                                <option value="">&ndash;select&ndash;</option>
                                {if count($.User->CurrentCourseSections)}
                                    <optgroup label="My Sections">
                                        {foreach item=Section from=$.User->CurrentCourseSections}
                                            <option value="section {$Section->Code|escape}" {refill field=students selected="section $Section->Code"}>{$Section->Term->Title|escape} {$Section->Title|escape}  {$Section->Schedule->Title|escape}</option>
                                        {/foreach}
                                    </optgroup>
                                {else}
                                    {$Term = Slate\Term::getClosest()}
                                    {if $Term}
                                        {$termIds = $Term->getRelatedTermIDs()|implode:','}
                                        <optgroup label="All Sections in {$Term->Title}">
                                            {foreach item=Section from=Slate\Courses\Section::getAllByWhere("TermID IN ($termIds)")}
                                                <option value="section {$Section->Code|escape}" {refill field=students selected="section $Section->Code"}>{$Section->Title|escape} {$Section->Schedule->Title|escape}</option>
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
                            <select class="field-control inline medium" name="content-area" onchange="this.form.submit()">
                                <option value="">&ndash;select&ndash;</option>
                                {foreach item=availableArea from=$allContentAreas}
                                    <option value="{$availableArea->Code}" {refill field=content-area selected=$availableArea->Code}>{$availableArea->Title|escape}</option>
                                {/foreach}
                            </select>
                        {/capture}
                        {labeledField html=$contentAreaSelect type=select label="Content Area" class=auto-width}
                    </form>
                </header>

                {if !$ContentArea || !is_array($students)}
                    <p class="notify">Select a student group and content area above to begin</p>
                {elseif !count($students)}
                    <p class="notify error">There are currently no students enrolled in the selected group</p>
                {/if}

                <div id="slateapp-viewport">
                    <!-- app renders here -->
                </div>
            </div>
        </main>
    </div>
{/block}