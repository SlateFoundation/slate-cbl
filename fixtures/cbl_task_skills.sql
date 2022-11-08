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
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

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
INSERT INTO `cbl_task_skills` VALUES (69,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-28 21:20:40',3,NULL,NULL,6,39);
INSERT INTO `cbl_task_skills` VALUES (70,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-28 21:20:40',3,NULL,NULL,6,40);
INSERT INTO `cbl_task_skills` VALUES (71,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 11:47:38',3,NULL,NULL,10,45);
INSERT INTO `cbl_task_skills` VALUES (72,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 11:47:38',3,NULL,NULL,10,46);
INSERT INTO `cbl_task_skills` VALUES (73,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 11:55:05',3,NULL,NULL,11,1);
INSERT INTO `cbl_task_skills` VALUES (74,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 12:02:01',3,NULL,NULL,12,3);
INSERT INTO `cbl_task_skills` VALUES (75,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 12:02:01',3,NULL,NULL,12,4);
INSERT INTO `cbl_task_skills` VALUES (76,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 12:05:34',3,NULL,NULL,13,2);
INSERT INTO `cbl_task_skills` VALUES (77,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 12:08:26',3,NULL,NULL,14,29);
INSERT INTO `cbl_task_skills` VALUES (78,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 12:08:26',3,NULL,NULL,14,30);
INSERT INTO `cbl_task_skills` VALUES (79,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 12:12:48',3,NULL,NULL,15,28);
INSERT INTO `cbl_task_skills` VALUES (80,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 12:23:00',3,NULL,NULL,16,6);
INSERT INTO `cbl_task_skills` VALUES (81,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 12:38:44',3,NULL,NULL,17,5);
INSERT INTO `cbl_task_skills` VALUES (82,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 12:38:44',3,NULL,NULL,17,6);
INSERT INTO `cbl_task_skills` VALUES (83,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 12:38:45',3,NULL,NULL,17,7);
INSERT INTO `cbl_task_skills` VALUES (85,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 12:43:03',3,NULL,NULL,18,9);
INSERT INTO `cbl_task_skills` VALUES (86,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 12:45:38',3,NULL,NULL,19,8);
INSERT INTO `cbl_task_skills` VALUES (87,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 12:46:29',3,NULL,NULL,20,8);
INSERT INTO `cbl_task_skills` VALUES (88,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 12:51:19',3,NULL,NULL,21,38);
INSERT INTO `cbl_task_skills` VALUES (89,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 12:51:19',3,NULL,NULL,21,39);
INSERT INTO `cbl_task_skills` VALUES (90,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 12:51:19',3,NULL,NULL,21,119);
INSERT INTO `cbl_task_skills` VALUES (91,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 13:16:26',5,NULL,NULL,22,158);
INSERT INTO `cbl_task_skills` VALUES (92,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 13:20:17',5,NULL,NULL,23,168);
INSERT INTO `cbl_task_skills` VALUES (93,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 13:21:56',5,NULL,NULL,24,167);
INSERT INTO `cbl_task_skills` VALUES (94,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 13:25:29',5,NULL,NULL,25,30);
INSERT INTO `cbl_task_skills` VALUES (95,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 13:32:51',5,NULL,NULL,27,28);
INSERT INTO `cbl_task_skills` VALUES (96,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 13:34:32',5,NULL,NULL,28,29);
INSERT INTO `cbl_task_skills` VALUES (97,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 13:39:32',5,NULL,NULL,29,161);
INSERT INTO `cbl_task_skills` VALUES (98,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 13:48:06',5,NULL,NULL,32,158);
INSERT INTO `cbl_task_skills` VALUES (99,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 13:50:14',5,NULL,NULL,33,162);
INSERT INTO `cbl_task_skills` VALUES (100,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 13:52:54',5,NULL,NULL,34,168);
INSERT INTO `cbl_task_skills` VALUES (102,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 13:58:54',5,NULL,NULL,36,160);
INSERT INTO `cbl_task_skills` VALUES (103,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 14:01:08',5,NULL,NULL,37,159);
INSERT INTO `cbl_task_skills` VALUES (104,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 14:03:31',5,NULL,NULL,38,31);
INSERT INTO `cbl_task_skills` VALUES (105,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 14:03:31',5,NULL,NULL,38,32);
INSERT INTO `cbl_task_skills` VALUES (106,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 14:03:31',5,NULL,NULL,38,33);
INSERT INTO `cbl_task_skills` VALUES (107,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 14:03:31',5,NULL,NULL,38,34);
INSERT INTO `cbl_task_skills` VALUES (108,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 14:05:08',5,NULL,NULL,39,15);
INSERT INTO `cbl_task_skills` VALUES (109,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 14:06:55',5,NULL,NULL,40,10);
INSERT INTO `cbl_task_skills` VALUES (110,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 14:08:27',5,NULL,NULL,41,11);
INSERT INTO `cbl_task_skills` VALUES (111,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 14:09:56',5,NULL,NULL,42,12);
INSERT INTO `cbl_task_skills` VALUES (112,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 14:11:20',5,NULL,NULL,43,13);
INSERT INTO `cbl_task_skills` VALUES (113,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 14:12:54',5,NULL,NULL,44,14);
INSERT INTO `cbl_task_skills` VALUES (114,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 14:14:45',5,NULL,NULL,45,38);
INSERT INTO `cbl_task_skills` VALUES (115,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 14:14:45',5,NULL,NULL,45,39);
INSERT INTO `cbl_task_skills` VALUES (116,'Slate\\CBL\\Tasks\\TaskSkill','2021-05-29 14:14:45',5,NULL,NULL,45,119);
INSERT INTO `cbl_task_skills` VALUES (117,'Slate\\CBL\\Tasks\\TaskSkill','2022-10-28 16:16:28',3,NULL,NULL,47,61);
INSERT INTO `cbl_task_skills` VALUES (118,'Slate\\CBL\\Tasks\\TaskSkill','2022-10-28 16:16:28',3,NULL,NULL,47,62);
INSERT INTO `cbl_task_skills` VALUES (119,'Slate\\CBL\\Tasks\\TaskSkill','2022-10-28 16:17:07',3,NULL,NULL,46,61);
INSERT INTO `cbl_task_skills` VALUES (120,'Slate\\CBL\\Tasks\\TaskSkill','2022-10-28 16:17:07',3,NULL,NULL,46,62);


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
