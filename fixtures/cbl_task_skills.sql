/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cbl_task_skills` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Class` enum('Slate\\CBL\\Tasks\\TaskSkill') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `TaskID` int(10) unsigned NOT NULL,
  `SkillID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Task` (`TaskID`,`SkillID`)
) ENGINE=MyISAM AUTO_INCREMENT=69 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `cbl_task_skills` VALUES (1,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,1);
INSERT INTO `cbl_task_skills` VALUES (2,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,2);
INSERT INTO `cbl_task_skills` VALUES (3,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,3);
INSERT INTO `cbl_task_skills` VALUES (4,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,4);
INSERT INTO `cbl_task_skills` VALUES (5,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,5);
INSERT INTO `cbl_task_skills` VALUES (6,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,6);
INSERT INTO `cbl_task_skills` VALUES (7,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,7);
INSERT INTO `cbl_task_skills` VALUES (8,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,8);
INSERT INTO `cbl_task_skills` VALUES (9,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,9);
INSERT INTO `cbl_task_skills` VALUES (10,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,10);
INSERT INTO `cbl_task_skills` VALUES (11,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,11);
INSERT INTO `cbl_task_skills` VALUES (12,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,12);
INSERT INTO `cbl_task_skills` VALUES (13,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,13);
INSERT INTO `cbl_task_skills` VALUES (14,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,14);
INSERT INTO `cbl_task_skills` VALUES (15,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,15);
INSERT INTO `cbl_task_skills` VALUES (16,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,16);
INSERT INTO `cbl_task_skills` VALUES (17,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,17);
INSERT INTO `cbl_task_skills` VALUES (18,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,18);
INSERT INTO `cbl_task_skills` VALUES (19,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,19);
INSERT INTO `cbl_task_skills` VALUES (20,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,20);
INSERT INTO `cbl_task_skills` VALUES (21,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,21);
INSERT INTO `cbl_task_skills` VALUES (22,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,22);
INSERT INTO `cbl_task_skills` VALUES (23,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,23);
INSERT INTO `cbl_task_skills` VALUES (24,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,24);
INSERT INTO `cbl_task_skills` VALUES (25,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,25);
INSERT INTO `cbl_task_skills` VALUES (26,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,26);
INSERT INTO `cbl_task_skills` VALUES (27,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,27);
INSERT INTO `cbl_task_skills` VALUES (28,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,28);
INSERT INTO `cbl_task_skills` VALUES (29,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,29);
INSERT INTO `cbl_task_skills` VALUES (30,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,30);
INSERT INTO `cbl_task_skills` VALUES (31,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,31);
INSERT INTO `cbl_task_skills` VALUES (32,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,32);
INSERT INTO `cbl_task_skills` VALUES (33,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,33);
INSERT INTO `cbl_task_skills` VALUES (34,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,34);
INSERT INTO `cbl_task_skills` VALUES (35,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,1);
INSERT INTO `cbl_task_skills` VALUES (36,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,2);
INSERT INTO `cbl_task_skills` VALUES (37,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,3);
INSERT INTO `cbl_task_skills` VALUES (38,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,4);
INSERT INTO `cbl_task_skills` VALUES (39,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,5);
INSERT INTO `cbl_task_skills` VALUES (40,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,6);
INSERT INTO `cbl_task_skills` VALUES (41,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,7);
INSERT INTO `cbl_task_skills` VALUES (42,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,8);
INSERT INTO `cbl_task_skills` VALUES (43,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,9);
INSERT INTO `cbl_task_skills` VALUES (44,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,10);
INSERT INTO `cbl_task_skills` VALUES (45,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,11);
INSERT INTO `cbl_task_skills` VALUES (46,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,12);
INSERT INTO `cbl_task_skills` VALUES (47,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,13);
INSERT INTO `cbl_task_skills` VALUES (48,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,14);
INSERT INTO `cbl_task_skills` VALUES (49,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,15);
INSERT INTO `cbl_task_skills` VALUES (50,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,16);
INSERT INTO `cbl_task_skills` VALUES (51,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,17);
INSERT INTO `cbl_task_skills` VALUES (52,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,18);
INSERT INTO `cbl_task_skills` VALUES (53,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,19);
INSERT INTO `cbl_task_skills` VALUES (54,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,20);
INSERT INTO `cbl_task_skills` VALUES (55,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,21);
INSERT INTO `cbl_task_skills` VALUES (56,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,22);
INSERT INTO `cbl_task_skills` VALUES (57,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,23);
INSERT INTO `cbl_task_skills` VALUES (58,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,24);
INSERT INTO `cbl_task_skills` VALUES (59,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,25);
INSERT INTO `cbl_task_skills` VALUES (60,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,26);
INSERT INTO `cbl_task_skills` VALUES (61,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,27);
INSERT INTO `cbl_task_skills` VALUES (62,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,28);
INSERT INTO `cbl_task_skills` VALUES (63,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,29);
INSERT INTO `cbl_task_skills` VALUES (64,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,30);
INSERT INTO `cbl_task_skills` VALUES (65,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,31);
INSERT INTO `cbl_task_skills` VALUES (66,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,32);
INSERT INTO `cbl_task_skills` VALUES (67,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,33);
INSERT INTO `cbl_task_skills` VALUES (68,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,34);
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `history_cbl_task_skills` (
  `RevisionID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ID` int(10) unsigned NOT NULL,
  `Class` enum('Slate\\CBL\\Tasks\\TaskSkill') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `TaskID` int(10) unsigned NOT NULL,
  `SkillID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`RevisionID`),
  KEY `ID` (`ID`)
) ENGINE=MyISAM AUTO_INCREMENT=69 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `history_cbl_task_skills` VALUES (1,1,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,1);
INSERT INTO `history_cbl_task_skills` VALUES (2,2,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,2);
INSERT INTO `history_cbl_task_skills` VALUES (3,3,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,3);
INSERT INTO `history_cbl_task_skills` VALUES (4,4,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,4);
INSERT INTO `history_cbl_task_skills` VALUES (5,5,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,5);
INSERT INTO `history_cbl_task_skills` VALUES (6,6,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,6);
INSERT INTO `history_cbl_task_skills` VALUES (7,7,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,7);
INSERT INTO `history_cbl_task_skills` VALUES (8,8,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,8);
INSERT INTO `history_cbl_task_skills` VALUES (9,9,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,9);
INSERT INTO `history_cbl_task_skills` VALUES (10,10,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,10);
INSERT INTO `history_cbl_task_skills` VALUES (11,11,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,11);
INSERT INTO `history_cbl_task_skills` VALUES (12,12,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,12);
INSERT INTO `history_cbl_task_skills` VALUES (13,13,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,13);
INSERT INTO `history_cbl_task_skills` VALUES (14,14,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,14);
INSERT INTO `history_cbl_task_skills` VALUES (15,15,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,15);
INSERT INTO `history_cbl_task_skills` VALUES (16,16,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,16);
INSERT INTO `history_cbl_task_skills` VALUES (17,17,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,17);
INSERT INTO `history_cbl_task_skills` VALUES (18,18,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,18);
INSERT INTO `history_cbl_task_skills` VALUES (19,19,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,19);
INSERT INTO `history_cbl_task_skills` VALUES (20,20,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,20);
INSERT INTO `history_cbl_task_skills` VALUES (21,21,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,21);
INSERT INTO `history_cbl_task_skills` VALUES (22,22,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,22);
INSERT INTO `history_cbl_task_skills` VALUES (23,23,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,23);
INSERT INTO `history_cbl_task_skills` VALUES (24,24,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,24);
INSERT INTO `history_cbl_task_skills` VALUES (25,25,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,25);
INSERT INTO `history_cbl_task_skills` VALUES (26,26,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,26);
INSERT INTO `history_cbl_task_skills` VALUES (27,27,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,27);
INSERT INTO `history_cbl_task_skills` VALUES (28,28,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,28);
INSERT INTO `history_cbl_task_skills` VALUES (29,29,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,29);
INSERT INTO `history_cbl_task_skills` VALUES (30,30,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,30);
INSERT INTO `history_cbl_task_skills` VALUES (31,31,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,31);
INSERT INTO `history_cbl_task_skills` VALUES (32,32,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,32);
INSERT INTO `history_cbl_task_skills` VALUES (33,33,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,33);
INSERT INTO `history_cbl_task_skills` VALUES (34,34,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,1,34);
INSERT INTO `history_cbl_task_skills` VALUES (35,35,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,1);
INSERT INTO `history_cbl_task_skills` VALUES (36,36,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,2);
INSERT INTO `history_cbl_task_skills` VALUES (37,37,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,3);
INSERT INTO `history_cbl_task_skills` VALUES (38,38,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,4);
INSERT INTO `history_cbl_task_skills` VALUES (39,39,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,5);
INSERT INTO `history_cbl_task_skills` VALUES (40,40,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,6);
INSERT INTO `history_cbl_task_skills` VALUES (41,41,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,7);
INSERT INTO `history_cbl_task_skills` VALUES (42,42,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,8);
INSERT INTO `history_cbl_task_skills` VALUES (43,43,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,9);
INSERT INTO `history_cbl_task_skills` VALUES (44,44,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,10);
INSERT INTO `history_cbl_task_skills` VALUES (45,45,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,11);
INSERT INTO `history_cbl_task_skills` VALUES (46,46,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,12);
INSERT INTO `history_cbl_task_skills` VALUES (47,47,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,13);
INSERT INTO `history_cbl_task_skills` VALUES (48,48,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,14);
INSERT INTO `history_cbl_task_skills` VALUES (49,49,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,15);
INSERT INTO `history_cbl_task_skills` VALUES (50,50,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,16);
INSERT INTO `history_cbl_task_skills` VALUES (51,51,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,17);
INSERT INTO `history_cbl_task_skills` VALUES (52,52,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,18);
INSERT INTO `history_cbl_task_skills` VALUES (53,53,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,19);
INSERT INTO `history_cbl_task_skills` VALUES (54,54,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,20);
INSERT INTO `history_cbl_task_skills` VALUES (55,55,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,21);
INSERT INTO `history_cbl_task_skills` VALUES (56,56,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,22);
INSERT INTO `history_cbl_task_skills` VALUES (57,57,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,23);
INSERT INTO `history_cbl_task_skills` VALUES (58,58,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,24);
INSERT INTO `history_cbl_task_skills` VALUES (59,59,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,25);
INSERT INTO `history_cbl_task_skills` VALUES (60,60,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,26);
INSERT INTO `history_cbl_task_skills` VALUES (61,61,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,27);
INSERT INTO `history_cbl_task_skills` VALUES (62,62,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,28);
INSERT INTO `history_cbl_task_skills` VALUES (63,63,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,29);
INSERT INTO `history_cbl_task_skills` VALUES (64,64,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,30);
INSERT INTO `history_cbl_task_skills` VALUES (65,65,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,31);
INSERT INTO `history_cbl_task_skills` VALUES (66,66,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,32);
INSERT INTO `history_cbl_task_skills` VALUES (67,67,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,33);
INSERT INTO `history_cbl_task_skills` VALUES (68,68,'Slate\\CBL\\Tasks\\TaskSkill','2019-01-02 03:04:05',3,NULL,NULL,2,34);
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

