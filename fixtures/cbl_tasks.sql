/*!40103 SET TIME_ZONE='+00:00' */;
/*!40101 SET character_set_client = utf8 */;

CREATE TABLE `cbl_tasks` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Class` enum('Slate\\CBL\\Tasks\\Task','Slate\\CBL\\Tasks\\ExperienceTask') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `SectionID` int(10) unsigned DEFAULT NULL,
  `Title` varchar(255) NOT NULL,
  `Handle` varchar(255) NOT NULL,
  `ParentTaskID` int(10) unsigned DEFAULT NULL,
  `ClonedTaskID` int(10) unsigned DEFAULT NULL,
  `Shared` enum('course','school','public') DEFAULT NULL,
  `Status` enum('private','shared','archived','deleted') NOT NULL DEFAULT 'private',
  `Instructions` text,
  `DueDate` timestamp NULL DEFAULT NULL,
  `ExpirationDate` timestamp NULL DEFAULT NULL,
  `ExperienceType` varchar(255) DEFAULT 'Studio',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Handle` (`Handle`),
  KEY `SectionID` (`SectionID`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

INSERT INTO `cbl_tasks` VALUES (1,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,2,'ELA Task One','ela_task_one',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (2,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,2,'ELA Task Two','ela_task_two',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (3,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,4,'Current Year any Term Task','current_year_any_term_task',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (4,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,3,'Un-Enrolled Section Task','un-enrolled_section_task',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (5,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,5,'Previous Year Task','previous_year_task',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');


CREATE TABLE `history_cbl_tasks` (
  `RevisionID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ID` int(10) unsigned NOT NULL,
  `Class` enum('Slate\\CBL\\Tasks\\Task','Slate\\CBL\\Tasks\\ExperienceTask') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `SectionID` int(10) unsigned DEFAULT NULL,
  `Title` varchar(255) NOT NULL,
  `Handle` varchar(255) NOT NULL,
  `ParentTaskID` int(10) unsigned DEFAULT NULL,
  `ClonedTaskID` int(10) unsigned DEFAULT NULL,
  `Shared` enum('course','school','public') DEFAULT NULL,
  `Status` enum('private','shared','archived','deleted') NOT NULL DEFAULT 'private',
  `Instructions` text,
  `DueDate` timestamp NULL DEFAULT NULL,
  `ExpirationDate` timestamp NULL DEFAULT NULL,
  `ExperienceType` varchar(255) DEFAULT 'Studio',
  PRIMARY KEY (`RevisionID`),
  KEY `ID` (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `history_cbl_tasks` SELECT NULL AS RevisionID, `cbl_tasks`.* FROM `cbl_tasks`;
