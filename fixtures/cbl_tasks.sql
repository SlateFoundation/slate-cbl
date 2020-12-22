/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `cbl_tasks` VALUES (1,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,2,'ELA Task One','ela_task_one',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (2,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,2,'ELA Task Two','ela_task_two',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (3,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,4,'Current Year any Term Task','current_year_any_term_task',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (4,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,3,'Un-Enrolled Section Task','un-enrolled_section_task',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (5,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,5,'Previous Year Task','previous_year_task',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `history_cbl_tasks` VALUES (1,1,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,2,'ELA Task One','ela_task_one',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
INSERT INTO `history_cbl_tasks` VALUES (2,2,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,2,'ELA Task Two','ela_task_two',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
INSERT INTO `history_cbl_tasks` VALUES (3,3,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,4,'Current Year any Term Task','current_year_any_term_task',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
INSERT INTO `history_cbl_tasks` VALUES (4,4,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,3,'Un-Enrolled Section Task','un-enrolled_section_task',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
INSERT INTO `history_cbl_tasks` VALUES (5,5,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,5,'Previous Year Task','previous_year_task',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

