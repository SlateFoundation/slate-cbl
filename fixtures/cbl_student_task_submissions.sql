/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cbl_student_task_submissions` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Class` enum('Slate\\CBL\\Tasks\\StudentTaskSubmission') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `StudentTaskID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `cbl_student_task_submissions` VALUES (1,'Slate\\CBL\\Tasks\\StudentTaskSubmission','2019-01-02 03:04:05',4,NULL,NULL,1);
INSERT INTO `cbl_student_task_submissions` VALUES (2,'Slate\\CBL\\Tasks\\StudentTaskSubmission','2019-01-02 03:04:05',4,NULL,NULL,3);
INSERT INTO `cbl_student_task_submissions` VALUES (3,'Slate\\CBL\\Tasks\\StudentTaskSubmission','2019-01-02 03:04:05',6,NULL,NULL,2);
INSERT INTO `cbl_student_task_submissions` VALUES (4,'Slate\\CBL\\Tasks\\StudentTaskSubmission','2019-01-02 03:04:05',6,NULL,NULL,4);
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `history_cbl_student_task_submissions` (
  `RevisionID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ID` int(10) unsigned NOT NULL,
  `Class` enum('Slate\\CBL\\Tasks\\StudentTaskSubmission') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `StudentTaskID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`RevisionID`),
  KEY `ID` (`ID`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `history_cbl_student_task_submissions` VALUES (1,1,'Slate\\CBL\\Tasks\\StudentTaskSubmission','2019-01-02 03:04:05',4,NULL,NULL,1);
INSERT INTO `history_cbl_student_task_submissions` VALUES (2,2,'Slate\\CBL\\Tasks\\StudentTaskSubmission','2019-01-02 03:04:05',4,NULL,NULL,3);
INSERT INTO `history_cbl_student_task_submissions` VALUES (3,3,'Slate\\CBL\\Tasks\\StudentTaskSubmission','2019-01-02 03:04:05',6,NULL,NULL,2);
INSERT INTO `history_cbl_student_task_submissions` VALUES (4,4,'Slate\\CBL\\Tasks\\StudentTaskSubmission','2019-01-02 03:04:05',6,NULL,NULL,4);
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

