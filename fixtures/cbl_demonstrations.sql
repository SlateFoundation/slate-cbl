/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cbl_demonstrations` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Class` enum('Slate\\CBL\\Demonstrations\\Demonstration','Slate\\CBL\\Demonstrations\\ExperienceDemonstration','Slate\\CBL\\Demonstrations\\OverrideDemonstration') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `StudentID` int(10) unsigned NOT NULL,
  `Demonstrated` timestamp NULL DEFAULT NULL,
  `ArtifactURL` varchar(255) DEFAULT NULL,
  `Comments` text,
  `ExperienceType` varchar(255) DEFAULT NULL,
  `Context` varchar(255) DEFAULT NULL,
  `PerformanceType` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `StudentID` (`StudentID`)
) ENGINE=MyISAM AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `cbl_demonstrations` VALUES (1,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,4,'2019-01-01 00:01:00',NULL,NULL,'Studio','ELA Studio','ELA Task One');
INSERT INTO `cbl_demonstrations` VALUES (2,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,4,'2019-01-01 00:02:00',NULL,NULL,'Presentation of Learning','ELA Demonstration One','Argumentative Essay');
INSERT INTO `cbl_demonstrations` VALUES (3,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,6,'2019-01-01 00:03:00',NULL,NULL,'Studio','ELA Studio','ELA Task Two');
INSERT INTO `cbl_demonstrations` VALUES (4,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,6,'2019-01-01 00:04:00',NULL,NULL,'Studio','ELA Studio','ELA Task One');
INSERT INTO `cbl_demonstrations` VALUES (5,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,4,'2019-01-01 00:05:00',NULL,NULL,'Studio','ELA Studio','ELA Task Two');
INSERT INTO `cbl_demonstrations` VALUES (6,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:06:00',NULL,NULL,'Studio','Testing','Annotated Writing');
INSERT INTO `cbl_demonstrations` VALUES (7,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:07:00',NULL,NULL,'Studio','Testing','Photo Essay');
INSERT INTO `cbl_demonstrations` VALUES (8,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:08:00',NULL,NULL,'Studio','Testing','Argumentative Essay');
INSERT INTO `cbl_demonstrations` VALUES (9,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:09:00',NULL,NULL,'Studio','Testing','Argumentative Essay');
INSERT INTO `cbl_demonstrations` VALUES (10,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:10:00',NULL,NULL,'Studio','Testing','Written Proposal');
INSERT INTO `cbl_demonstrations` VALUES (11,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:11:00',NULL,NULL,'Studio','Testing','Engineering Design');
INSERT INTO `cbl_demonstrations` VALUES (12,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:12:00',NULL,NULL,'Studio','Testing','Narrative');
INSERT INTO `cbl_demonstrations` VALUES (13,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:13:00',NULL,NULL,'Studio','Testing','Narrative');
INSERT INTO `cbl_demonstrations` VALUES (14,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:14:00',NULL,NULL,'Studio','Testing','Debate');
INSERT INTO `cbl_demonstrations` VALUES (15,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:15:00',NULL,NULL,'Studio','Testing','Research Paper');
INSERT INTO `cbl_demonstrations` VALUES (16,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:16:00',NULL,NULL,'Studio','Testing','Engineering Design');
INSERT INTO `cbl_demonstrations` VALUES (17,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:17:00',NULL,NULL,'Studio','Testing','Engineering Design');
INSERT INTO `cbl_demonstrations` VALUES (18,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:18:00',NULL,NULL,'Studio','Testing','Data Analysis Task');
INSERT INTO `cbl_demonstrations` VALUES (19,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:19:00',NULL,NULL,'Studio','Testing','Document-based Questions');
INSERT INTO `cbl_demonstrations` VALUES (20,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:20:00',NULL,NULL,'Studio','Testing','Data Analysis Task');
INSERT INTO `cbl_demonstrations` VALUES (21,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:21:00',NULL,NULL,'Studio','Testing','Argumentative Essay');
INSERT INTO `cbl_demonstrations` VALUES (22,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:22:00',NULL,NULL,'Studio','Testing','Data Analysis Task');
INSERT INTO `cbl_demonstrations` VALUES (23,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:23:00',NULL,NULL,'Studio','Testing','Document-based Questions');
INSERT INTO `cbl_demonstrations` VALUES (24,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:24:00',NULL,NULL,'Studio','Testing','Debate');
INSERT INTO `cbl_demonstrations` VALUES (25,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:25:00',NULL,NULL,'Studio','Testing','Annotated Writing');
INSERT INTO `cbl_demonstrations` VALUES (26,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:26:00',NULL,NULL,'Studio','Testing','Document-based Questions');
INSERT INTO `cbl_demonstrations` VALUES (27,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:27:00',NULL,NULL,'Studio','Testing','Data Analysis Task');
INSERT INTO `cbl_demonstrations` VALUES (28,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,4,'2019-01-01 00:28:00',NULL,NULL,'Studio','Testing','Data Analysis Task');
INSERT INTO `cbl_demonstrations` VALUES (29,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,4,'2019-01-01 00:29:00',NULL,NULL,'Studio','Testing','Build/Design Project');
INSERT INTO `cbl_demonstrations` VALUES (30,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:30:00',NULL,NULL,'Studio','Testing','Document-based Questions');
INSERT INTO `cbl_demonstrations` VALUES (31,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:31:00',NULL,NULL,'Studio','Testing','Engineering Design');
INSERT INTO `cbl_demonstrations` VALUES (32,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:32:00',NULL,NULL,'Studio','Testing','Infographic');
INSERT INTO `cbl_demonstrations` VALUES (33,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:33:00',NULL,NULL,'Studio','Testing','Debate');
INSERT INTO `cbl_demonstrations` VALUES (34,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:34:00',NULL,NULL,'Studio','Testing','Data Analysis Task');
INSERT INTO `cbl_demonstrations` VALUES (35,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:35:00',NULL,NULL,'Studio','Testing','Document-based Questions');
INSERT INTO `cbl_demonstrations` VALUES (36,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,6,'2019-01-01 00:36:00',NULL,NULL,'test','test','test');
INSERT INTO `cbl_demonstrations` VALUES (37,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,6,'2019-01-01 00:37:00',NULL,NULL,'test','test','est');
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `history_cbl_demonstrations` (
  `RevisionID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ID` int(10) unsigned NOT NULL,
  `Class` enum('Slate\\CBL\\Demonstrations\\Demonstration','Slate\\CBL\\Demonstrations\\ExperienceDemonstration','Slate\\CBL\\Demonstrations\\OverrideDemonstration') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `StudentID` int(10) unsigned NOT NULL,
  `Demonstrated` timestamp NULL DEFAULT NULL,
  `ArtifactURL` varchar(255) DEFAULT NULL,
  `Comments` text,
  `ExperienceType` varchar(255) DEFAULT NULL,
  `Context` varchar(255) DEFAULT NULL,
  `PerformanceType` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`RevisionID`),
  KEY `ID` (`ID`)
) ENGINE=MyISAM AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `history_cbl_demonstrations` VALUES (1,1,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,4,'2019-01-01 00:01:00',NULL,NULL,'Studio','ELA Studio','ELA Task One');
INSERT INTO `history_cbl_demonstrations` VALUES (2,2,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,4,'2019-01-01 00:02:00',NULL,NULL,'Presentation of Learning','ELA Demonstration One','Argumentative Essay');
INSERT INTO `history_cbl_demonstrations` VALUES (3,3,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,6,'2019-01-01 00:03:00',NULL,NULL,'Studio','ELA Studio','ELA Task Two');
INSERT INTO `history_cbl_demonstrations` VALUES (4,4,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,6,'2019-01-01 00:04:00',NULL,NULL,'Studio','ELA Studio','ELA Task One');
INSERT INTO `history_cbl_demonstrations` VALUES (5,5,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,4,'2019-01-01 00:05:00',NULL,NULL,'Studio','ELA Studio','ELA Task Two');
INSERT INTO `history_cbl_demonstrations` VALUES (6,6,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:06:00',NULL,NULL,'Studio','Testing','Annotated Writing');
INSERT INTO `history_cbl_demonstrations` VALUES (7,7,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:07:00',NULL,NULL,'Studio','Testing','Photo Essay');
INSERT INTO `history_cbl_demonstrations` VALUES (8,8,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:08:00',NULL,NULL,'Studio','Testing','Argumentative Essay');
INSERT INTO `history_cbl_demonstrations` VALUES (9,9,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:09:00',NULL,NULL,'Studio','Testing','Argumentative Essay');
INSERT INTO `history_cbl_demonstrations` VALUES (10,10,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:10:00',NULL,NULL,'Studio','Testing','Written Proposal');
INSERT INTO `history_cbl_demonstrations` VALUES (11,11,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:11:00',NULL,NULL,'Studio','Testing','Engineering Design');
INSERT INTO `history_cbl_demonstrations` VALUES (12,11,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:11:00',NULL,NULL,'Studio','Testing','Engineering Design');
INSERT INTO `history_cbl_demonstrations` VALUES (13,12,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:12:00',NULL,NULL,'Studio','Testing','Narrative');
INSERT INTO `history_cbl_demonstrations` VALUES (14,13,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:13:00',NULL,NULL,'Studio','Testing','Narrative');
INSERT INTO `history_cbl_demonstrations` VALUES (15,12,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:12:00',NULL,NULL,'Studio','Testing','Narrative');
INSERT INTO `history_cbl_demonstrations` VALUES (16,14,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:14:00',NULL,NULL,'Studio','Testing','Debate');
INSERT INTO `history_cbl_demonstrations` VALUES (17,15,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:15:00',NULL,NULL,'Studio','Testing','Research Paper');
INSERT INTO `history_cbl_demonstrations` VALUES (18,16,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:16:00',NULL,NULL,'Studio','Testing','Engineering Design');
INSERT INTO `history_cbl_demonstrations` VALUES (19,17,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:17:00',NULL,NULL,'Studio','Testing','Engineering Design');
INSERT INTO `history_cbl_demonstrations` VALUES (20,18,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:18:00',NULL,NULL,'Studio','Testing','Data Analysis Task');
INSERT INTO `history_cbl_demonstrations` VALUES (21,19,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:19:00',NULL,NULL,'Studio','Testing','Document-based Questions');
INSERT INTO `history_cbl_demonstrations` VALUES (22,19,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:19:00',NULL,NULL,'Studio','Testing','Document-based Questions');
INSERT INTO `history_cbl_demonstrations` VALUES (23,20,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:20:00',NULL,NULL,'Studio','Testing','Data Analysis Task');
INSERT INTO `history_cbl_demonstrations` VALUES (24,21,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:21:00',NULL,NULL,'Studio','Testing','Argumentative Essay');
INSERT INTO `history_cbl_demonstrations` VALUES (25,22,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:22:00',NULL,NULL,'Studio','Testing','Data Analysis Task');
INSERT INTO `history_cbl_demonstrations` VALUES (26,23,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:23:00',NULL,NULL,'Studio','Testing','Document-based Questions');
INSERT INTO `history_cbl_demonstrations` VALUES (27,24,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:24:00',NULL,NULL,'Studio','Testing','Debate');
INSERT INTO `history_cbl_demonstrations` VALUES (28,25,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:25:00',NULL,NULL,'Studio','Testing','Annotated Writing');
INSERT INTO `history_cbl_demonstrations` VALUES (29,26,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:26:00',NULL,NULL,'Studio','Testing','Document-based Questions');
INSERT INTO `history_cbl_demonstrations` VALUES (30,27,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:27:00',NULL,NULL,'Studio','Testing','Data Analysis Task');
INSERT INTO `history_cbl_demonstrations` VALUES (31,27,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:27:00',NULL,NULL,'Studio','Testing','Data Analysis Task');
INSERT INTO `history_cbl_demonstrations` VALUES (32,28,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,4,'2019-01-01 00:28:00',NULL,NULL,'Studio','Testing','Data Analysis Task');
INSERT INTO `history_cbl_demonstrations` VALUES (33,29,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,4,'2019-01-01 00:29:00',NULL,NULL,'Studio','Testing','Build/Design Project');
INSERT INTO `history_cbl_demonstrations` VALUES (34,30,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:30:00',NULL,NULL,'Studio','Testing','Document-based Questions');
INSERT INTO `history_cbl_demonstrations` VALUES (35,31,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:31:00',NULL,NULL,'Studio','Testing','Engineering Design');
INSERT INTO `history_cbl_demonstrations` VALUES (36,32,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:32:00',NULL,NULL,'Studio','Testing','Infographic');
INSERT INTO `history_cbl_demonstrations` VALUES (37,33,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:33:00',NULL,NULL,'Studio','Testing','Debate');
INSERT INTO `history_cbl_demonstrations` VALUES (38,34,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:34:00',NULL,NULL,'Studio','Testing','Data Analysis Task');
INSERT INTO `history_cbl_demonstrations` VALUES (39,35,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:35:00',NULL,NULL,'Studio','Testing','Document-based Questions');
INSERT INTO `history_cbl_demonstrations` VALUES (40,35,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,7,'2019-01-01 00:35:00',NULL,NULL,'Studio','Testing','Document-based Questions');
INSERT INTO `history_cbl_demonstrations` VALUES (41,36,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,6,'2019-01-01 00:36:00',NULL,NULL,'test','test','test');
INSERT INTO `history_cbl_demonstrations` VALUES (42,37,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2019-01-02 03:04:05',3,NULL,NULL,6,'2019-01-01 00:37:00',NULL,NULL,'test','test','est');
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

