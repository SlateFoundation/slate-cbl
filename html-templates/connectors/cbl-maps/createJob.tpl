{extends designs/site.tpl}

{block title}Pull from {Slate\CBL\MapsConnector::$title|escape} &mdash; {$dwoo.parent}{/block}

{block content}
    <h1>Pull from {Slate\CBL\MapsConnector::$title|escape}</h1>
    <h2>Instructions</h2>
	<ul>
		<li>Set the Google Sheet sharing options so that <strong>anyone with a link</strong> can <strong>view</strong></li>
		<li>Open the sharing link in an incognito Chrome window and open the Network inspector</li>
		<li>Activate the desired worksheet and select File &rarr; Download as &rarr; Comma-seperated values (.csv, current sheet)</li>
        <li>Find the red <strong>export</strong> request in the network log, right click it, and select <strong>Copy link address</strong></li>
	</ul>

	<h2>Input</h2>
    <h3>Run from template</h3>
    <ul>
        {foreach item=TemplateJob from=$templates}
            <li><a href="{$connectorBaseUrl}/synchronize/{$TemplateJob->Handle}" title="{$TemplateJob->Config|http_build_query|escape}">Job #{$TemplateJob->ID} &mdash; created by {$TemplateJob->Creator->Username} on {$TemplateJob->Created|date_format:'%c'}</a></li>
        {/foreach}
    </ul>

    <h3>Run or save a new job</h3>
	<form method="POST">
        <fieldset>
            <legend>Job Configuration</legend>
    		<p>
    			<label>
    				Pretend
    				<input type="checkbox" name="pretend" value="true" {refill field=pretend checked="true" default="true"}>
    			</label>
    			<span class="hint">Check to prevent saving any changes to the database</span>
    		</p>
    		<p>
    			<label>
    				Create Template
    				<input type="checkbox" name="createTemplate" value="true" {refill field=createTemplate checked="true"}>
    			</label>
    			<span class="hint">Check to create a template job that can be repeated automatically instead of running it now</span>
    		</p>
        	<p>
    			<label>
    				Email report
    				<input type="text" name="reportTo" {refill field=reportTo} length="100">
    			</label>
    			<span class="hint">Email recipient or list of recipients to send post-sync report to</span>
    		</p>
            <p>
    			<label>
    				Update Existing Content Areas
    				<input type="checkbox" name="updateExiting" value="true" disabled {refill field=updateExiting}>
    			</label>
    		</p>

            {$defaultCsvUrl = Slate\CBL\MapsConnector::$defaultCsvUrl}
            <p>
        		<label>
    				Maps Index CSV
    				<input type="text" name="indexCsv" value="{refill field=indexCsv default=$defaultCsvUrl}" length="255">
    			</label>
    			<span class="hint">URL captured by downloading a <strong>maps index</strong> worksheet as CSV from a public link</span>
    		</p>
        </fieldset>

		<input type="submit" value="Synchronize">
	</form>
{/block}