{extends designs/site.tpl}

{block content}
    {load_templates "subtemplates/slate-forms.tpl"}

    {foreach key=scriptPath item=script from=$scripts implode="<hr>"}
        <h2>{$script.title|escape}</h2>

        {if $script.description}
            {$script.description|markdown}
        {/if}

        <form method="GET" action="/exports/{$scriptPath|escape}">
            {foreach key=key item=value from=$script.query}
                {$label = strtr(ucfirst($key), '_', ' ')}

                {if $key == 'students'}
                    {field
                        inputName=$key
                        label=$label
                        default=$value
                        placeholder='123,345'
                        hint='List of student IDs, group:grouphandle, or section:sectioncode, or all'
                    }
                {elseif $key == 'term'}
                    {termField
                        inputName=$key
                        label=$label
                        default=$value
                        blankOption='any'
                        currentOption='current'
                    }
                {elseif $key == 'course'}
                    {courseField
                        inputName=$key
                        label=$label
                        default=$value
                        blankOption='any'
                    }
                {elseif $key == 'location'}
                    {locationField
                        inputName=$key
                        label=$label
                        default=$value
                        blankOption='any'
                    }
                {elseif $key == 'schedule'}
                    {scheduleField
                        inputName=$key
                        label=$label
                        default=$value
                        blankOption='any'
                    }
                {elseif $key == 'content_area'}
                    {selectField
                        inputName=$key
                        label='Competency Area'
                        default=$value
                        options=DB::valuesTable('Code', 'Title', 'SELECT Code, Title FROM cbl_content_areas ORDER BY Code')
                        blankOption='any'
                    }
                {elseif $key == 'level'}
                    {$levels = DB::allValues('Level', 'SELECT DISTINCT Level FROM cbl_student_competencies ORDER BY Level')}
                    {selectField
                        inputName=$key
                        label='Portfolio'
                        default=$value
                        options=array_merge($levels, array('highest'))
                        useKeyAsValue=no
                        blankOption='all'
                    }
                {elseif is_bool($value)}
                    {checkbox
                        inputName=$key
                        value=yes
                        unsetValue=''
                        label=$label
                        default=$value
                        placeholder='any'
                    }
                {elseif is_int($value)}
                    {field
                        type='number'
                        inputName=$key
                        label=$label
                        default=$value
                        placeholder='any'
                    }
                {elseif $key == 'date' || substr($key, 0, 5) == 'date_'}
                    {field
                        type='date'
                        inputName=$key
                        label=$label
                        default=$value
                        blankOption='any'
                    }
                {else}
                    {field
                        inputName=$key
                        label=$label
                        default=$value
                        placeholder='any'
                    }
                {/if}
            {/foreach}

            <button>Download</button>
        </form>
    {/foreach}
{/block}