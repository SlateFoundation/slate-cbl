{extends designs/site.tpl}

{block content}

    {$statuses = \Google\DriveFile::getFieldOptions('Status', 'values')}
    {capture assign=statusFilterHtml}
        <select name="Status">
            <option value="">Any</option>
            {foreach from=$statuses item=status}
                <option value="{$status}" {refill field=Status selected=$status}>{$status}</option>
            {/foreach}
        </select>
    {/capture}
    
    <form>
        {labeledField html=$statusFilterHtml label=Status}
        <input type="submit" class="button" value="Go">
    </form>

    <table>
        <tr>
            <th>Title</th>
            <th>Owner Email</th>
            <th>Status</th>
        </tr>

        {foreach from=$data item=file}
            <tr>
                <td><a href="{$file->getLink()}" target="_blank" alt="{$file->Title} Google Drive File">{$file->Title}</a></td>
                <td>{$file->OwnerEmail}</td>
                <td>{$file->Status}</td>
            </tr>
        {foreachelse}
            <tr><td>No files found&hellip;</td></tr>
        {/foreach}
    </table>

{/block}