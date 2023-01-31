{extends designs/site.tpl}

{block title}{$data->getTitle()} &middot; {$dwoo.parent}{/block}

{block content}
    {load_templates subtemplates/dli.tpl}

    <header class="page-header">
        <h2 class="header-title">{contextLink $data}</h2>
    </header>

    <dl class="align-right compact">
        {dli label=ID value=$data->ID}
        {dli label=Created value=$data->Created|date_format}
        {dli label=Creator value=$data->Creator->getTitle() url=$data->Creator->getUrl()}
        {dli label=Student value=$data->Student->getTitle() url=$data->Student->getUrl()}
        {dli label=Competency value=$data->Competency->getTitle() url=$data->Competency->getUrl()}
        {dli label='Competency Status' value=$data->Competency->Status}
        {dli label='Content Area' value=$data->Competency->ContentArea->getTitle() url=$data->Competency->ContentArea->getUrl()}
        {dli label='Content Area Status' value=$data->Competency->->ContentArea->Status}
        {dli label=Level value=$data->Level}
        {dli label='Entered Via' value=$data->EnteredVia}
        {dli label='Baseline Rating' value=$data->BaselineRating}
        {dli label='Growth' value=$data->getGrowth()}
        {dli label='Progress' value=$data->getProgress()}
        {dli label='Is Level Complete?' value=tif($data->isLevelComplete(), 'Yes', 'No')}
        {dli label='Demonstrations Average' value=$data->getDemonstrationsAverage()|number_format:2}
        {dli label='Demonstrations Logged' value=$data->getDemonstrationsLogged()|number_format}
        {dli label='Demonstrations Missed' value=$data->getDemonstrationsMissed()|number_format}
        {dli label='Demonstrations Complete' value=$data->getDemonstrationsComplete()|number_format}
        {dli label='Demonstrations Required' value=$data->getDemonstrationsRequired()|number_format}
    </dl>

    <?php
        $this->scope['effectiveDemonstrationSkillIds'] = [];

        foreach ($this->scope['data']->getEffectiveDemonstrationsData() as $demonstrationSkills) {
            foreach ($demonstrationSkills as $demonstrationSkill) {
                $this->scope['effectiveDemonstrationSkillIds'][] = $demonstrationSkill['ID'];
            }
        }
    ?>

    <h3>Skill Demonstrations</h3>
    {if $data->Competency->Status == 'active'}
        <table class="auto-width row-stripes row-highlight">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Created</th>
                    <th scope="col">Creator</th>
                    <th scope="col">Demonstration</th>
                    <th scope="col">DemonstrationDate</th>
                    <th scope="col">Level</th>
                    <th scope="col">Rating</th>
                    <th scope="col">Evidence Weight</th>
                </tr>
            </thead>
            <tbody>
            {foreach item=demonstrationSkills key=skillId from=$data->getDemonstrationsData()}
                <tr>
                    <th colspan="8">{contextLink Slate\CBL\Skill::getById($skillId)}</th>
                </tr>
                {foreach item=DemonstrationSkill from=$demonstrationSkills}
                    {$Demonstration = Slate\CBL\Demonstrations\Demonstration::getById($DemonstrationSkill.DemonstrationID)}
                    <tr class="{tif $DemonstrationSkill.ID|in_array:$effectiveDemonstrationSkillIds ? effective : muted}">
                        <td>#{$DemonstrationSkill.ID}</td>
                        <td>{$DemonstrationSkill.Created|date_format}</td>
                        <td>{contextLink Emergence\People\Person::getById($DemonstrationSkill.CreatorID)}</td>
                        <td>
                            <a href="{$Demonstration->getUrl()|escape}">#{$Demonstration->ID}</a>
                            {if $Demonstration->Class == 'Slate\\CBL\\Demonstrations\\OverrideDemonstration'}
                                (override)
                            {/if}
                        </td>
                        <td>{$DemonstrationSkill.DemonstrationDate|date_format}</td>
                        <td>{$DemonstrationSkill.TargetLevel}</td>
                        {if $DemonstrationSkill.DemonstratedLevel === 0}
                            <td>M</td>
                        {elseif $DemonstrationSkill.DemonstratedLevel === null}
                            <td>&mdash;</td>
                        {else}
                            <td>{$DemonstrationSkill.DemonstratedLevel}</td>
                        {/if}
                        <td>{tif($DemonstrationSkill.EvidenceWeight === null, '&infin;', $DemonstrationSkill.EvidenceWeight)}</td>
                    </tr>
                {/foreach}
            {/foreach}
            </tbody>
        </table>
    {else}
        <p><em>Demonstration data unavailable because this competency is <strong>{$data->Competency->Status}</strong></em></p>
    {/if}
{/block}