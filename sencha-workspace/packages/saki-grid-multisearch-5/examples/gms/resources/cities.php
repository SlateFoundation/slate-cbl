<?php
// vim: sw=4:ts=4:nu:nospell:fdc=4
/*
 This file is part of Saki Grid MultiSearch Plugin Example Application

 Copyright (c) 2014, Jozef Sakalos, Saki

 Package:  saki-grid-multisearch
 Author:   Jozef Sakalos, Saki
 Contact:  http://extjs.eu/contact
 Date:     6. March 2014

 Commercial License
 Developer, or the specified number of developers, may use this file in any number
 of projects during the license period in accordance with the license purchased.

 Uses other than including the file in the project are prohibited.
 See http://extjs.eu/licensing for details.
 */

if('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
    return;
}

require("csql.php");

if(!isset($_REQUEST["cmd"])) {
	return;
}

$objects = array(
	// {{{
	// company
	"company"=>array(
		 "table"=>"company"
		,"idName"=>"compID"
		,"fields"=>array(
			 "compID"
			,"company"
			,"price"
			,"change"
			,"pctChange"
			,"lastChange"
			,"industry"
			,"action1"
			,"qtip1"
			,"action2"
			,"qtip2"
			,"action3"
			,"qtip3"
			,"note"
		)
	)
	,"person"=>array(
		"table"=>"person left join phone on person.persID=phone.persID"
		,"idName"=>"persID"
		,"groupBy"=>"person.persID"
		,"fields"=>array(
			  "person.persID"
			 ,"persFirstName"
			 ,"persMidName"
			 ,"persLastName"
			 ,"persNote"
			 ,"group_concat(concat_ws('~',phoneType,phoneNumber),'|') as phones"
		)
	)
	,"person2"=>array(
		"table"=>"person2"
		,"idName"=>"person2.persID"
		,"fields"=>array(
			  "persID"
			 ,"persFirstName"
			 ,"persMidName"
			 ,"persLastName"
		)
	)
	,"cities"=>array(
		 "table"=>"cities"
		,"idName"=>"geotagId"
		,"fields"=>array(
			 "geonameId"
			,"name"
			,"latitude"
			,"longitude"
			,"countryCode"
			,"population"
			,"elevation"
			,"gtopo30"
			,"timezone"
			,"lastUpdated"
		)
	)
	,"countries"=>array(
		 "table"=>"countries"
		,"idName"=>"ISO"
		,"fields"=>array(
			 "ISO"
			,"Country"
			,"Capital"
			,"Population"
			,"Area"
			,"Continent"
			,"CurrencyName"
			,"CurrencyCode"
			,"Phone"
		)
	)
    ,"resource"=>array(
         "table"=>"resource"
        ,"idName"=>"id"
        ,"fields"=>array(
             "id"
            ,"userid"
            ,"name"
            ,"occupation"
            ,"type"
            ,"grade"
            ,"fromlanguages"
            ,"workarea"
            ,"role"
            ,"room"
            ,"status"
            ,"userstatus"
        )
    )
    ,"event"=>array(
         "table"=>"event"
        ,"idName"=>"id"
        ,"fields"=>array(
             "id"
            ,"userid"
            ,"jobnum"
            ,"assignmenttype"
            ,"type"
            ,"schstartdate"
            ,"schenddate"
        )
    )
	// }}}
);

// create PDO object and execute command
$osql = new csql("sqlite", "geonames.sqlite3");
$_REQUEST["cmd"]($osql);

// command processors
// {{{
/**
  * getData: Outputs data to client
  *
  * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
  * @date      31. March 2008
  * @return    void
  * @param     PDO $osql
  */
function getData($osql) {
	global $objects;
	$params = $objects[$_REQUEST["objName"]];
	$params["start"] = isset($_REQUEST["start"]) ? $_REQUEST["start"] : null;
	$params["limit"] = isset($_REQUEST["limit"]) ? $_REQUEST["limit"] : null;
	$params["search"] = isset($_REQUEST["fields"]) ? json_decode($_REQUEST["fields"]) : null;
	$params["filters"] = isset($_REQUEST["filters"]) ? json_decode($_REQUEST["filters"]) : null;
	$params["query"] = isset($_REQUEST["query"]) ? $_REQUEST["query"] : null;
	$params["sort"] = isset($_REQUEST["sort"]) ? $_REQUEST["sort"] : null;
	$params["dir"] = isset($_REQUEST["dir"]) ? $_REQUEST["dir"] : null;

	// next line necessary for Ext 3 as it doesn't send start currently (27. April 2009)
	$params["start"] = $params["start"] ? $params["start"] : 0;

    // standard Ext filter takes precedence
    if(isset($_REQUEST["filter"])) {
        $filter = json_decode($_REQUEST["filter"]);
        $filters = new stdClass();
        $filters->fields = array();
        if(is_array($filter)) {
            foreach($filter as $o) {
                $filters->fields[$o->property] = $o->value;
            }
        }
        $params["filters"] = $filters;
    }

	$response = array(
		 "success"=>true
		,"totalCount"=>$osql->getCount($params)
		,"rows"=>$osql->getData($params)
	);
	$osql->output($response);

} // eo function getData
// }}}
// {{{
/**
  * saveData: saves data to table
  *
  * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
  * @date      02. April 2008
  * @return    void
  * @param     PDO $osql
  */
function saveData($osql) {
	global $objects;
	$params = $objects[$_REQUEST["objName"]];
	unset($params["fields"]);

	$params["data"] = json_decode($_REQUEST["data"]);
	$osql->output($osql->saveData($params));

} // eo function saveData
// }}}

// eof
?>
