<?php
/*
 The ExtJS/Touch request processor at http://extjs.eu

 Copyright (c) 2014, Jozef Sakalos, Saki

 Author:   Jozef Sakalos, Saki
 Contact:  http://extjs.eu/contact
 Date:     18. May 2014

 Commercial License
 Developer, or the specified number of developers, may use this file in any number
 of projects during the license period in accordance with the license purchased.

 Uses other than including the file in a project are prohibited.
 See http://extjs.eu/licensing for details.
 */

// if it was a cross-domain xhr request client sends
// an OPTIONS request - we just ignore it to save
// the bandwidth
if('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
    return;
}

// include sqlite helper class
require("csql.php");

// split path after service.php into array
$path = $_SERVER["PATH_INFO"];
$args = explode("/", $path);
array_shift($args);

// get table, action and id
$table = array_key_exists(0, $args) ? $args[0] : null;
$action = array_key_exists(1, $args) ? $args[1] : null;
$id = array_key_exists(2, $args) ? $args[2] : null;
$id = $id ? $id : isset($_REQUEST["id"]) ? $_REQUEST["id"] : null;

// action mangling to support synonyms
$action = $action ? $action : "read";
//$action = "create" === $action ? "save" : $action;
$action = "update" === $action ? "save" : $action;
$action = "destroy" === $action ? "delete" : $action;
$action = "list" === $action ? "read" : $action;


// metadata for tables
$tables = array(
    "person"=>array(
         "table"=>"person"
        ,"idName"=>"id"
        ,"assoc"=>array(
             "table"=>"contact"
            ,"fKey"=>"persId"
            ,"aKey"=>"contacts"
        )
        ,"fields"=>array(
             "id"
            ,"fname"
            ,"lname"
            ,"gender"
            ,"dob"
        )
    )
    ,"person2"=>array(
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
    ,"contact"=>array(
         "table"=>"contact"
        ,"idName"=>"id"
        ,"fields"=>array(
             "id"
            ,"persId"
            ,"type"
            ,"contact"
        )
    )
    ,"company"=>array(
         "table"=>"company"
        ,"idName"=>"compID"
        ,"db"=>"companies.sqlite"
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
    ,"tree"=>array(
         "table"=>"tree"
        ,"idName"=>"id"
        ,"fields"=>array(
             "id"
            ,"treeId"
            ,"parentId"
            ,"text"
            ,"lft+1=rgt as leaf"
            ,"iconColor"
            ,"cls"
            ,"iconCls"
            ,"checked"
        )
    )
    ,"actors"=>array(
         "table"=>"actors"
        ,"idName"=>"id"
        ,"fields"=>array(
             "id"
            ,"fname"
            ,"lname"
            ,"name"
            ,"profile_path"
            ,"birthday"
            ,"deathday"
            ,"place_of_birth"
            ,"biography"
            ,"tmdb_id"
            ,"imdb_id"
            ,"homepage"
            ,"popularity"
        )
    )
    ,"actors1"=>array(
         "table"=>"actors"
        ,"idName"=>"id"
        ,"fields"=>array(
             "id"
            ,"fname"
            ,"lname"
            ,"profile_path"
            ,"birthday"
            ,"tmdb_id"
        )
    )
    ,"cities"=>array(
         "table"=>"cities"
        ,"idName"=>"geotagId"
        ,"db"=>"geonames.sqlite3"
        ,"fields"=>array(
            "geonameId"
            ,"name"
            ,"asciiName"
            ,"alternateNames"
            ,"latitude"
            ,"longitude"
            ,"featureClass"
            ,"featureCode"
            ,"countryCode"
            ,"countryCode2"
            ,"adminCode1"
            ,"adminCode2"
            ,"population"
            ,"elevation"
            ,"gtopo30"
            ,"timezone"
            ,"lastUpdated"
        )
    )
    ,"xcig"=>array(
         "table"=>"company"
        ,"joins"=>array(
            "left join cities on company.geonameId=cities.geonameId"
        )
        ,"idName"=>"compID"
        ,"db"=>"companies.sqlite"
        ,"fields"=>array(
             "compID"
            ,"company"
            ,"company.geonameId"
            ,"cities.name as cityName"
            ,"price"
            ,"lastChange"
            ,"industry"
            ,"note"
        )
    )
    ,"citycombo"=>array(
         "table"=>"cities"
        ,"idName"=>"geonameId"
        ,"db"=>"companies.sqlite"
        ,"fields"=>array(
             "geonameId"
            ,"name as cityName"
        )
        ,"queryProperty"=>"name"
    )
    ,"customer"=>array(
         "table"=>"customer"
        ,"db"=>"invoice.sqlite"
        ,"idName"=>"id"
        ,"assoc"=>array(
             "table"=>"invoice"
            ,"fKey"=>"custId"
            ,"aKey"=>"invoices"
        )
        ,"fields"=>array(
             "id"
            ,"name"
            ,"addrStreet"
            ,"addrCity"
            ,"addrCountry"
            ,"phone"
            ,"website"
            ,"email"
            ,"regId"
            ,"taxId"
            ,"note"
        )
    )
    ,"seller"=>array(
         "table"=>"seller"
        ,"db"=>"invoice.sqlite"
        ,"idName"=>"id"
        ,"fields"=>array(
             "id "
            ,"name"
            ,"addrStreet"
            ,"addrCity"
            ,"addrCountry"
            ,"bank"
            ,"account"
            ,"iban"
            ,"swift"
            ,"regId"
            ,"taxId"
            ,"note"
        )
    )
    ,"invoice"=>array(
         "table"=>"invoice"
        ,"db"=>"invoice.sqlite"
        ,"idName"=>"invoice.id"
        ,"joins"=>array(
             "left join customer on invoice.custId=customer.id"
            ,"left join seller on invoice.sellerId=seller.id"
        )
        ,"assoc"=>array(
             "table"=>"invoiceItem"
            ,"fKey"=>"invoId"
            ,"aKey"=>"invoItems"
        )
        ,"fields"=>array(
             "invoice.id"
            ,"custId"
            ,"customer.name as custName"
            ,"sellerId"
            ,"seller.name as sellerName"
            ,"code"
            ,"invoice.name"
            ,"issueDate"
            ,"dueDate"
            ,"taxDate"
            ,"paidDate"
            ,"total"
            ,"paid"
            ,"currency"
            ,"invoice.note"
        )
    )
    ,"invoiceitem"=>array(
         "table"=>"invoiceItem"
        ,"db"=>"invoice.sqlite"
        ,"idName"=>"id"
        ,"fields"=>array(
             "id"
            ,"invoId"
            ,"text"
            ,"qty"
            ,"unit"
            ,"unitPrice"
            ,"price"
            ,"tax"
            ,"note"
        )
    )
);

// alias (by reference) so that Ext code then looks better
$tables["city"] = $tables["cities"];

// get database file
$dbFile = isset($tables[$table]["db"]) ? $tables[$table]["db"] : "db.sqlite";
$osql = new csql($dbFile);

//error_log("dbFile=$dbFile table=$table action=$action id=$id");

if('tree' === $table) {
    require("ctree.php");
    $otree = new ctree($osql);
    $action .= 'Tree';
//    error_log($action);
    $action($otree);
}
else {
    $action($osql);
}

function readTree($otree) {
    global $tables;
    global $table;
    global $treeId;
    global $id;
    global $osql;


    $params = array_merge($tables[$table], getParams());

    $response = array(
         "success"=>true
    );

    $children = $otree->getChildren($params);
    if(is_array($children)) {
        $response["children"] = $children;
    }
    else {
        $response["success"] = false;
    }

    $id = $params["node"];
    $params =  array_merge($tables[$table], getParams());

//    echo '<pre>' . print_r($params,1) . '</pre>';

//
    $data = $osql->getData($params);
//    echo '<pre>' . print_r($data[0],1) . '</pre>';

//    error_log(print_r($response,1));
    $response = array_merge($response, (array) $data[0]);
    error_log(print_r($data,1));
    $osql->output($response);

} // eo function readTree

function read($osql) {
    global $tables;
    global $table;
    global $id;
    $params = array_merge($tables[$table], getParams());



    $response = array(
         "success"=>true
        ,"total"=>$osql->getCount($params)
        ,"data"=>$osql->getData($params)
//        ,"metaData"=>array(
//            "fields"=>array(
//                array(
//                     "name"=>"id"
//                    ,"type"=>"int"
//                )
//                ,array(
//                     "name"=>"fname"
//                    ,"type"=>"string"
//                )
//                ,array(
//                     "name"=>"lname"
//                    ,"type"=>"string"
//                )
//            )
//        )
    );

    $osql->output($response);

} // eo function read

function assoc($osql) {
    global $tables;
    global $table;

    $params = array_merge($tables[$table], getParams());

    $response = array(
         "success"=>true
        ,"total"=>$osql->getCount($params)
        ,"data"=>$osql->getAssociated($params)
    );

    $osql->output($response);
} // eo function assoc

function create($osql) {
    global $tables;
    global $table;

    $params = $tables[$table];
    $params["create"] = true;
    $params["data"] = json_decode($_REQUEST["data"]);
//    error_log('create = ' . print_r($params,1));
    $osql->output($osql->saveData($params));

} // eo function create

function save($osql) {
    global $tables;
    global $table;

    $params = $tables[$table];
    unset($params["fields"]);

    $params["data"] = json_decode($_REQUEST["data"]);
    $osql->output($osql->saveData($params));

} // eo function save

// {{{
/**
 * deleteData: deletes records from the table
 *
 * @author    Ing. Jozef Sakáloš <jsakalos@extjs.eu>
 * @date      09. May 2014
 * @return    void
 * @param     PDO $osql
 */
function delete($osql) {
    global $tables;
    global $table;

    $params = $tables[$table];
    unset($params["fields"]);

    $params["data"] = json_decode(($_REQUEST["data"]));
    $osql->output($osql->removeRecord($params));
}
// }}}

function getParams() {
    global $id;
    global $tables;
    global $table;

    $params = array();
    $params["start"] = isset($_REQUEST["start"]) ? $_REQUEST["start"] : null;
    $params["limit"] = isset($_REQUEST["limit"]) ? $_REQUEST["limit"] : null;
    $params["search"] = isset($_REQUEST["fields"]) ? json_decode($_REQUEST["fields"]) : null;
    $params["filters"] = isset($_REQUEST["filters"]) ? json_decode($_REQUEST["filters"]) : null;
    $params["query"] = isset($_REQUEST["query"]) ? $_REQUEST["query"] : null;
    $params["sort"] = isset($_REQUEST["sort"]) ? $_REQUEST["sort"] : null;
    $params["dir"] = isset($_REQUEST["dir"]) ? $_REQUEST["dir"] : null;
    $params["distinct"] = isset($_REQUEST["distinct"]) ? $_REQUEST["distinct"] : null;
    $params["node"] = isset($_REQUEST["node"]) ? $_REQUEST["node"] : null;

    $treeId = isset($_REQUEST["treeId"]) ? $_REQUEST["treeId"] : null;
    if($treeId) {
        $params["treeId"] = $treeId;
        $params["node"] = $params["node"] ? $params["node"] : $id;
    }
    else {
        $params["treeId"] = $id;
    }


    // next line necessary for Ext 3 as it doesn't send start currently (27. April 2009)
    $params["start"] = $params["start"] ? $params["start"] : 0;

    // standard Ext filter takes precedence
    if(isset($_REQUEST["filter"])) {
        $filter = json_decode($_REQUEST["filter"]);
        $filters = new stdClass();
        $filters->fields = array();
        if(is_array($filter)) {
            foreach($filter as $o) {
                if(isset($o->operator) && 'in' !== $o->operator && 'like' !== $o->operator) {
                    $o->operator = preg_replace(array(
                         '/gt/'
                        ,'/ge/'
                        ,'/lt/'
                        ,'/le/'
                        ,'/eq/'
                        ,'/ne/'
                    ), array(
                         '>'
                        ,'>='
                        ,'<'
                        ,'<='
                        ,'='
                        ,'!='
                    ), $o->operator);

                    $filters->fields[$o->property] = $o->operator . $o->value;
                }
                else {
                    $filters->fields[$o->property] = $o->value;
                }
            }
        }
        $params["filters"] = $filters;
    } elseif($params["query"] && $params["queryProperty"]) {
        $filters = new stdClass();
        $filters->fields = array();
        $filters->fields[$params["queryProperty"]] = $params["query"];

        $params["filters"] = $filters;
    }

    if($id) {
        $filters = isset($filters) ? $filters : new stdClass();
        $filters->fields = isset($filters->fields) ? $filters->fields : array();
        $filters->fields[$tables[$table]["idName"]] = "=$id";

        $params["filters"] = $filters;
    }
//error_log(print_r($params,1));

    return $params;

} // eo function getParams

// eof
?>