/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cbl_student_tasks` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Class` enum('Slate\\CBL\\Tasks\\StudentTask') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `TaskID` int(10) unsigned NOT NULL,
  `StudentID` int(10) unsigned NOT NULL,
  `TaskStatus` enum('assigned','re-assigned','submitted','re-submitted','completed') NOT NULL DEFAULT 'assigned',
  `DemonstrationID` int(10) unsigned DEFAULT NULL,
  `DueDate` timestamp NULL DEFAULT NULL,
  `ExpirationDate` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `StudentTask` (`TaskID`,`StudentID`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `cbl_student_tasks` VALUES (1,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,1,4,'completed',1,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (2,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,1,6,'completed',4,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (3,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,2,4,'completed',5,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (4,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,2,6,'completed',3,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (5,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,3,4,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (6,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,4,4,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (7,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,5,4,'assigned',NULL,NULL,NULL);
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `history_cbl_student_tasks` (
  `RevisionID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ID` int(10) unsigned NOT NULL,
  `Class` enum('Slate\\CBL\\Tasks\\StudentTask') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `TaskID` int(10) unsigned NOT NULL,
  `StudentID` int(10) unsigned NOT NULL,
  `TaskStatus` enum('assigned','re-assigned','submitted','re-submitted','completed') NOT NULL DEFAULT 'assigned',
  `DemonstrationID` int(10) unsigned DEFAULT NULL,
  `DueDate` timestamp NULL DEFAULT NULL,
  `ExpirationDate` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`RevisionID`),
  KEY `ID` (`ID`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `history_cbl_student_tasks` VALUES (1,1,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,1,4,'completed',1,NULL,NULL);
INSERT INTO `history_cbl_student_tasks` VALUES (2,2,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,1,6,'completed',4,NULL,NULL);
INSERT INTO `history_cbl_student_tasks` VALUES (3,3,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,2,4,'completed',5,NULL,NULL);
INSERT INTO `history_cbl_student_tasks` VALUES (4,4,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,2,6,'completed',3,NULL,NULL);
INSERT INTO `history_cbl_student_tasks` VALUES (5,5,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,3,4,'assigned',NULL,NULL,NULL);
INSERT INTO `history_cbl_student_tasks` VALUES (6,6,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,4,4,'assigned',NULL,NULL,NULL);
INSERT INTO `history_cbl_student_tasks` VALUES (7,7,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,5,4,'assigned',NULL,NULL,NULL);
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

