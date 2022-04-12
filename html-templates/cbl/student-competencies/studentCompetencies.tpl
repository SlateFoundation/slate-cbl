{extends "designs/site.tpl"}

{block "title"}Student Competencies &middot; {$dwoo.parent}{/block}

{block "content"}
    {load_templates "subtemplates/paging.tpl"}

    <header class="page-header">
        <h2 class="header-title">Student Competencies</h2>

        <div class="page-buttons">
            <span class="button-group">
                <label class="muted">Download all results:&nbsp;</label>
                <a class="button small" href="?{refill_query format=json limit=0 offset=0}">JSON</a>
                <a class="button small" href="?{refill_query format=csv limit=0 offset=0}">CSV</a>
            </span>
        </div>
    </header>

    <form class="filter-list">
        <fieldset class="inline-fields">
            <h4 class="section-title">Filters</h4>

            {field
                inputName=student
                default=$.get.student
                label='Student'
                placeholder='jdoe'
            }

            {field
                inputName=competency
                default=$.get.competency
                label='Competency'
                placeholder='ABC.2'
            }

            {field
                inputName=content_area
                default=$.get.content_area
                label='Content area'
                placeholder='ABC'
            }

            {selectField
                inputName=level
                default=$.get.level
                label='Level'
                options=DB::allValues('Level', 'SELECT DISTINCT Level FROM cbl_student_competencies ORDER BY Level')
                useKeyAsValue=no
                blankOption='Any'
            }

            {selectField
                inputName=entered_via
                default=$.get.entered_via
                label='Entered Via'
                options=Slate\CBL\StudentCompetency::getFieldOptions(EnteredVia, values)
                useKeyAsValue=no
                blankOption='Any'
            }

            <div class="submit-area">
                <input type="submit" value="Apply Filters">
                <a href="{Slate\CBL\StudentCompetency::$collectionRoute}" class="button">Reset Filters</a>
            </div>
        </fieldset>
    </form>


    <table class="auto-width row-stripes row-highlight">
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Student</th>
                <th scope="col">Competency</th>
                <th scope="col">Level</th>
                <th scope="col">Entered Via</th>
                <th scope="col">Baseline Rating</th>
                <th scope="col">Growth</th>
                <th scope="col">Progress</th>
            </tr>
        </thead>
        <tbody>
        {foreach item=StudentCompetency from=$data}
            <tr>
                <td><a href="{$StudentCompetency->getUrl()|escape}">#{$StudentCompetency->ID}</td>
                <td>{contextLink $StudentCompetency->Student}</td>
                <td>{contextLink $StudentCompetency->Competency}</td>
                <td>{$StudentCompetency->Level}</td>
                <td>{$StudentCompetency->EnteredVia|escape}</td>
                <td>{$StudentCompetency->BaselineRating|default:'&mdash;'}</td>
                <td>{$StudentCompetency->getGrowth()|default:'&mdash;'}</td>
                <td>{$StudentCompetency->getProgress()|default:'&mdash;'}</td>
            </tr>
        {/foreach}
        </tbody>
    </table>

    {pagingArrows count($data) $total $limit $offset}
{/block}