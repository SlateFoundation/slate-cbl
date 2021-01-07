/*!40103 SET TIME_ZONE='+00:00' */;
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
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `history_cbl_task_skills` SELECT NULL AS RevisionID, `cbl_task_skills`.* FROM `cbl_task_skills`;
