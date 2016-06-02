<?php

// vim: ts=4:sw=4:fdc=4:nu:nospell
/**
 * Lightweight SQL class suitable for public use and sqlite access
 * 
 * @author     Ing. Jozef Sakáloš
 * @copyright  (c) 2008, by Ing. Jozef Sakáloš
 * @date       31. March 2008
 * @date       18. May 2014 (newest Ext/Touch compatibility update)
 * @version    $Id: csql.php 826 2010-02-23 20:37:16Z jozo $
 */

// {{{
/**
  * regexp: callback for sqlite REGEXP operator
  *
  * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
  * @date      01. April 2008
  * @return    boolean true if value matches regular expression
  * @param     string $search string to find
  * @param     string $value string to search in
  */
function regexp($search, $value) {
	// case insensitive hard coded
	return @preg_match("/$search/i", $value);
}
// }}}

/**
  * concat_ws: sqlite custom function
  *
  * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
  * @date      11. May 2008
  * @return    string
  * @param     mixed
  */
function concat_ws() {
	$args = func_get_args();
	$sep = array_shift($args);
	return implode($sep, $args);
} // eo function concat_ws
// {{{
/**
  * Quote array callback function
  *
  * This is walk array callback function that 
  * surrounds array element with quotes.
  *
  * @date    08. September 2003
  * @access  public
  * @return  void
  * @param   string &$val Array element to be quouted
  * @param   mixed $key Dummy. Not used in the function.
  * @param   string $quot Quoute to use. Double quote by default
  */
function quote_array(&$val, $key, $quot = '"') {
	$quot_right = array_key_exists(1, (array) $quot) ? $quot[1] : $quot[0];
	$val = is_null($val) ? "null" : $quot[0] . preg_replace("/'/", "''", $val) . $quot_right;
}
// }}}

/**
  * csql class
  *
  * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
  * @copyright (c) 2008 by Ing. Jozef Sakáloš
  * @date      31. March 2008
  */
class csql {

	// protected functions
	// {{{
	/**
	  * getOdb: Creates PDO object
	  *
	  * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
	  * @date      31. March 2008
	  * @access    protected
	  * @return    PDO
	  * @param     string $engine
	  * @param     string $file
	  */
	protected function getOdb($engine, $file) {
		switch($engine) {
			case "sqlite":
				if("/" !== $file[0]) {
					$file = realpath(".") . "/$file";
				}
				$odb = new PDO("sqlite:$file");
				$odb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$odb->sqliteCreateFunction("regexp", "regexp", 2);
				$odb->sqliteCreateFunction("concat_ws", "concat_ws");
			break;
		}

		return $odb;
	} // eo function getOdb
	// }}}
	// {{{
    /**
     * getWhere: return where clause
     *
     * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
     * @date      01. April 2008
     * @access    protected
     * @return    string where clause including where keyword
     * @param     array $params
     * @param     string $ignoreFilter
     */
	protected function getWhere($params, $ignoreFilter = "") {
		extract($params);

		$where = isset($where) ? "where $where" : "";

		if($filters && $filters->fields) {
			$a = array();
			foreach($filters->fields as $f=>$value) {
				if($f === $ignoreFilter) {
					continue;
				}
				if(is_array($value)) {
					if(sizeof($value)) {
						array_walk($value, "quote_array", "'");
						$a[] = "$f in (" . implode(",", $value) . ")";
					}
				}
				else {
					$value = trim($value);
					$ab = preg_split("/(>)|(<)|(=)|(!)/", $value, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
					if(preg_match("/\|/", $value)) {
						$value = preg_replace("/\s*\|\s*/", "|", $value);
						$aa = explode("|", $value);
						for($i = 0; $i < sizeof($aa); $i++) {
							$aa[$i] = "'" . $aa[$i] . "'";
						}
						$a[] = "$f in (" . implode(",", $aa) . ")";
					}
					else if(1 < sizeof($ab)) {
						$value = array_pop($ab);
						$operator = "";
						for($i = 0; $i < sizeof($ab); $i++) {
	//						$operator .= ($ab[$i] === "!" ? "not " : $ab[$i]);
							$operator .= $ab[$i];
						}
						$a[] = "$f $operator '$value'";
					}
					else {
						$a[] = "$f regexp '$value'";
					}
				}
			}
			if(sizeof($a)) {
				$where .= $where ? " and(" : "where (";
				$where .= implode(" and ", $a) . ")";
			}
		}

		if($query && is_array($search) && sizeof($search)) {
			$a = array();
			foreach($search as $f) {
				$a[] = "$f regexp '$query'";
			}
			$where .= $where ? " and(" : "where (";
			$where .= implode(" or ", $a) . ")";
		}

		error_log("Where = " . $where);
		return $where;

	} // eo function getWhere
	// }}}

	// public functions
	// {{{
    /**
     * __construct: Constructs the csql instance
     *
     * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
     * @date      31. March 2008
     * @access    public
     * @return    csql
     * @param     string $file sqlite database file
     * @param     string $engine database engine to use
     */
    public function __construct($file = "db.sqlite",$engine = "sqlite") {
		$this->odb = $this->getOdb($engine, $file);
        return $this;
	} // eo constructor
	// }}}
	// {{{
	/**
	  * getCount: Returns count of records in a table
	  *
	  * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
	  * @date      31. March 2008
	  * @access    public
	  * @return    integer number of records
	  * @param     array $params
	  */
	public function getCount($params) {
		$count = null;
		$countArg = $params["distinct"] ? "distinct " . $params["distinct"] : "*";
        $sql = "select count($countArg) from {$params['table']} " . $this->getWhere($params);
//        error_log($sql);
        try {
            $ostmt = $this->odb->prepare($sql);
            $ostmt->bindColumn(1, $count);
            $ostmt->execute();
            $ostmt->fetch();
		    return (int) $count;
        } catch(PDOException $e) {
            echo $e->__toString();
            die();
        }
	} // eo function getCount
	// }}}
	// {{{
	/**
	  * getData: Retrieves data and returns array of objects
	  *
	  * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
	  * @date      31. March 2008
	  * @access    public
	  * @return    array
	  * @param     array $params Associative array with:
	  * - string  table (Mandatory)
	  * - array   field (Mandatory)
	  * - integer start (Optional)
	  * - integer limit (Optional)
	  * - string  sort (Optional)
	  * - array   search (Optional) fields to search in
	  * - string  where (Optional)
	  */
	public function getData($params) {
		// params to variables
		extract($params);

		$sql  = "select " . ($distinct ? "distinct " : "");
		$sql .= implode(",", $fields);
		$sql .= " from $table " . (isset($joins) && is_array($joins) ? implode(" ", $joins) : "") . " ";
        $sql .= $this->getWhere($params);
		$sql .= isset($groupBy) && $groupBy ? " group by $groupBy" : "";

		if(!is_null($sort)) {
            $sort = is_string($sort) ? json_decode($sort) : $sort;
            $asort = array();
            foreach($sort as $o) {
                $asort[] = $o->property . " " . $o->direction;
            }
//			$sql .= " order by " . $sort[0]->property . " " . $sort[0]->direction;
            $sql .= " order by " . implode(",", $asort);
		}
		if(!is_null($start) && !is_null($limit)) {
			$sql .= " limit $start,$limit";
		}

//        error_log($sql);

        try {
            $ostmt = $this->odb->query($sql);
            $data = $ostmt->fetchAll(PDO::FETCH_OBJ);
            return $data;
        } catch(PDOException $e) {
            echo $e->__toString();
            die();
        }

	} // eo function getData
	// }}}

    public function getAssociated($params) {
        extract($params);

        $data = array();

        $sql  = "select " . ($distinct ? "distinct " : "");
        $sql .= implode(",", $fields);
        $sql .= " from $table " . (isset($joins) && is_array($joins) ? implode(" ", $joins) : "") . " ";
        $sql .= $this->getWhere($params);
        $sql .= isset($groupBy) && $groupBy ? " group by $groupBy" : "";
        if(!is_null($sort)) {
            try {
                $sort = json_decode($sort);
            }
            catch(Exception $e){};

            if(is_array($sort)) {
                $asort = array();
                foreach($sort as $o) {
                    $asort[] = $o->property . " " . $o->direction;
                }
                $sql .= " order by " . implode(",", $asort);
            }
        }
        if(!is_null($start) && !is_null($limit)) {
            $sql .= " limit $start,$limit";
        }

        $ostmt = $this->odb->query($sql);
        while($record = $ostmt->fetch(PDO::FETCH_OBJ)) {
            $aData = array();
            $totalName = "total" . ucfirst($assoc["aKey"]);
            $foreignId = $record->$idName;

            $sql  = "select * from ${assoc['table']} where ${assoc['fKey']}='$foreignId'";
//            error_log('assoc=' . print_r($assoc,1));
            $ostmtAssoc = $this->odb->query($sql);

            $aData = $ostmtAssoc->fetchAll(PDO::FETCH_OBJ);

            $record->$totalName = sizeof($aData);
            $record->$assoc["aKey"] = $aData;
            array_push($data, $record);
        }
        return $data;

    } // eo function getAssociated


    /**
     * getFilterRows: short description of
     *
     * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
     * @date      05. February 2010
     * @access    public
     * @return    mixed Description
     * @param     string $name
     * @param     array $params
     * @param     bool $ignoreMyself
     */
	public function getFilterRows($name, $params, $ignoreMyself = false) {
		extract($params);
		$ignoreFilter = $ignoreMyself ? $name : "";
		$sql = "select distinct $name from $table " . $this->getWhere($params, $ignoreFilter) . " order by $name";
//		error_log($sql);
		$ostmt = $this->odb->query($sql);
		$rows = $ostmt->fetchAll(PDO::FETCH_NUM);
		$a = array();
		foreach($rows as $row) {
			$a[] = $row[0];
		}
		return $a;
//		return $rows;
	} // eo function getFilterRows

	// {{{
	/**
	  * insertRecord: inserts record to table
	  *
	  * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
	  * @date      01. April 2008
	  * @access    public
	  * @return    integer id of the inserted record
	  * @param     array $params
	  */
	public function insertRecord($params) {
		// params to vars
		extract($params);

		$o = new stdClass();
		$o->success = false;

		$a = "object" === gettype($data) ? get_object_vars($data) : $data;
		unset($a["newRecord"]);
		if($idName) {
			unset($a[$idName]);
		}
		$fields = array_keys($a);
		$values = array_values($a);
		array_walk($values, "quote_array", "'");

		$sql = "insert into $table (" . implode(",", $fields) . ") values (" . implode(",", $values) . ")";

		try {
			$this->odb->exec($sql);
			$o->success = true;
			$o->insertId = $this->odb->lastInsertId();
		}
		catch(PDOException $e) {
			$o->error = "$e";
		}

		return $o;

	} // eo function insertRecord
	// }}}
    // {{{
    /**
     * removeRecord: deletes record(s) from the table
     *
     * @author    Ing. Jozef Sakáloš <jsakalos@extjs.eu>
     * @date      09. May 2014
     * @access    public
     * @return    object with results
     * @param     array $params
     */
    public function removeRecord($params) {
        extract($params);

        $o = new stdClass();
        $o->success = false;
        $o->data = array();

        if(!$table || !is_array($data) || !$idName) {
            $o->error = "Table, data or idName is missing";
            return $o;
        }

        $this->odb->exec("begin transaction");

        foreach($data as $orec) {
            $sql = "delete from $table where $idName='{$orec->$idName}'";

            try {
                $this->odb->exec($sql);
                array_push($o->data, $orec);

            } catch(PDOException $e) {
                $o->error = "$e";
                $this->odb->exec("rollback");
                return $o;
            }
        }

        $this->odb->exec("commit");
        $o->success = true;

        return $o;

    } // eo function removeRecord
    // }}}
	// {{{
	/**
	  * saveData: saves data (updates or inserts)
	  *
	  * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
	  * @date      01. April 2008
	  * @access    public
	  * @return    object either {success:true} or {success:false,error:message}
	  * @param     array $params
	  */
	public function saveData($params) {
		// params to vars
		extract($params);

		// return object
		$o = new stdClass;
		$o->success = false;
        $o->data = array();

		if(!$table || !is_array($data) || !$idName) {
			$o->error = "Table, data or idName is missing";
			return $o;
		}

		// record loop
		$p = array(
			 "table"=>$table
			,"idName"=>$idName
		);
		$this->odb->exec("begin transaction");

		foreach($data as $orec) {
			$p["data"] = $orec;


			// insert/update switch
			if(!$orec->$idName || $create) {
				$result = $this->insertRecord($p);
			}
			else {
				$result = $this->updateRecord($p);
			}

			// handle error
			if(true !== $result->success) {
				$o->success = false;
				$o->error = $result->error;
				$this->odb->exec("rollback");
				return $o;
			}
			else {
				$o->success = true;
			}

			// handle insertId if any
			if(isset($result->insertId)) {
				$orec->$idName = $result->insertId;
			}

            array_push($o->data, $orec);

		} // eo record loop
		
		$this->odb->exec("commit");
		return $o;
	} // eo function saveData
	// }}}
	// {{{
	/**
	  * updateRecord: updtates one record in table
	  *
	  * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
	  * @date      31. March 2008
	  * @access    public
	  * @return    object either {success:true} or {success:false,error:message}
	  * @param     array $params with:
	  * - string   table (Mandatory)
	  * - string   idName (Mandatory) name of id field
	  * - object   data (Mandatory) Name/value pairs object or associative array
	  */
	public function updateRecord($params) {
		// array to vars
		extract($params);

		$o = new stdClass();
		$o->success = false;

		if(!isset($table) || !isset($idName) || !isset($data)) {
			$o->error = "Table, idName or data not set.";
			return $o;
		}
		$asets = array();
		$where = "";

		foreach($data as $field => $value) {
			if($idName === $field) {
				$where = " where $field='$value'";
				continue;
			}
			array_push($asets, "$field=" . (is_null($value) ? "null" : "'$value'"));
		}
		if(!$where) {
			$o->error = "idName not found in data";
			return $o;
		}

		$sql = "update $table set " . implode(",", $asets) . $where;

		try {
			$this->odb->exec($sql);
			$o->success = true;
		}
		catch(PDOException $e) {
			$o->error = "$e";
		}

		return $o;

	} // eo function updateRecord
	// }}}
	// {{{
	/**
	  * output: Encodes json object and sends it to client
	  *
	  * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
	  * @date      31. March 2008
	  * @access    protected
	  * @return    void
	  * @param     object/array $o
	  * @param     string $contentType
	  */
	public function output($o = null, $contentType = "application/json; charset=utf-8") {
		$o = $o ? $o : $this->o;
		$buff = json_encode($o);
		header("Content-Type: {$contentType}");
		header("Content-Size: " . strlen($buff));
		echo $buff;
	} // eo function output
	// }}}

} // eo class csql

// eof
