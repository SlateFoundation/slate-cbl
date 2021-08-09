/*!40103 SET TIME_ZONE='+00:00' */;
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
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

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
INSERT INTO `cbl_demonstrations` VALUES (38,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-29 14:21:48',3,NULL,NULL,10,'2021-05-29 14:18:39',NULL,NULL,'Studio','Freedom','Task 1');
INSERT INTO `cbl_demonstrations` VALUES (39,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-29 14:26:27',3,NULL,NULL,9,'2021-05-29 14:21:47',NULL,NULL,'Studio','Freedom','Task 1');
INSERT INTO `cbl_demonstrations` VALUES (40,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-30 23:43:30',3,NULL,NULL,12,'2021-05-30 23:42:19',NULL,NULL,'Studio','Freedom','Task 1');
INSERT INTO `cbl_demonstrations` VALUES (41,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-30 23:44:48',3,NULL,NULL,8,'2021-05-30 23:43:31',NULL,NULL,'Studio','Freedom','Task 1');
INSERT INTO `cbl_demonstrations` VALUES (42,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-30 23:45:45',3,NULL,NULL,11,'2021-05-30 23:44:49',NULL,NULL,'Studio','Freedom','Task 1');
INSERT INTO `cbl_demonstrations` VALUES (43,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-30 23:46:31',3,NULL,NULL,11,'2021-05-30 23:46:29',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (44,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-30 23:46:38',3,NULL,NULL,11,'2021-05-30 23:46:37',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (45,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-30 23:46:44',3,NULL,NULL,11,'2021-05-30 23:46:43',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (46,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-30 23:46:51',3,NULL,NULL,11,'2021-05-30 23:46:50',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (47,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-30 23:47:31',3,NULL,NULL,11,'2021-05-30 23:47:30',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (48,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-30 23:47:36',3,NULL,NULL,11,'2021-05-30 23:47:36',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (49,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-30 23:47:43',3,NULL,NULL,11,'2021-05-30 23:47:42',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (50,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-30 23:50:05',3,NULL,NULL,10,'2021-05-30 23:48:48',NULL,NULL,'Studio','In the Face of Injustice','Task 2');
INSERT INTO `cbl_demonstrations` VALUES (51,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-30 23:51:10',3,NULL,NULL,9,'2021-05-30 23:50:06',NULL,NULL,'Studio','In the Face of Injustice','Task 2');
INSERT INTO `cbl_demonstrations` VALUES (52,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-30 23:52:16',3,NULL,NULL,12,'2021-05-30 23:51:10',NULL,NULL,'Studio','In the Face of Injustice','Task 2');
INSERT INTO `cbl_demonstrations` VALUES (53,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-30 23:53:04',3,NULL,NULL,8,'2021-05-30 23:52:17',NULL,NULL,'Studio','In the Face of Injustice','Task 2');
INSERT INTO `cbl_demonstrations` VALUES (54,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-30 23:53:48',3,NULL,NULL,11,'2021-05-30 23:53:05',NULL,NULL,'Studio','In the Face of Injustice','Task 2');
INSERT INTO `cbl_demonstrations` VALUES (55,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-30 23:57:16',5,NULL,NULL,10,'2021-05-30 23:55:58',NULL,NULL,'Studio','American Identity','Task 3');
INSERT INTO `cbl_demonstrations` VALUES (56,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-30 23:58:33',5,NULL,NULL,9,'2021-05-30 23:57:17',NULL,NULL,'Studio','American Identity','Task 4');
INSERT INTO `cbl_demonstrations` VALUES (57,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-30 23:59:04',5,NULL,NULL,12,'2021-05-30 23:58:34',NULL,NULL,'Studio','American Identity','Task 4');
INSERT INTO `cbl_demonstrations` VALUES (58,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:00:12',5,NULL,NULL,8,'2021-05-30 23:59:04',NULL,NULL,'Studio','American Identity','Task 4');
INSERT INTO `cbl_demonstrations` VALUES (59,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:01:54',5,NULL,NULL,11,'2021-05-31 00:00:15',NULL,NULL,'Studio','American Identity','Task 4');
INSERT INTO `cbl_demonstrations` VALUES (60,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:02:41',5,NULL,NULL,11,'2021-05-31 00:02:40',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (61,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:02:45',5,NULL,NULL,11,'2021-05-31 00:02:44',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (62,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:02:49',5,NULL,NULL,11,'2021-05-31 00:02:48',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (63,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:02:54',5,NULL,NULL,11,'2021-05-31 00:02:53',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (64,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:07:52',5,NULL,NULL,11,'2021-05-31 00:07:50',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (65,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:08:01',5,NULL,NULL,11,'2021-05-31 00:08:00',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (66,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:08:06',5,NULL,NULL,11,'2021-05-31 00:08:05',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (67,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:08:10',5,NULL,NULL,11,'2021-05-31 00:08:09',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (68,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:08:26',5,NULL,NULL,11,'2021-05-31 00:08:25',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (69,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:08:36',5,NULL,NULL,11,'2021-05-31 00:08:35',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (70,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:08:40',5,NULL,NULL,11,'2021-05-31 00:08:39',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (71,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:08:44',5,NULL,NULL,11,'2021-05-31 00:08:44',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (72,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:08:48',5,NULL,NULL,11,'2021-05-31 00:08:48',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (73,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:08:52',5,NULL,NULL,11,'2021-05-31 00:08:51',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (74,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:08:56',5,NULL,NULL,11,'2021-05-31 00:08:55',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (75,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:09:02',5,NULL,NULL,11,'2021-05-31 00:09:02',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (76,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:09:07',5,NULL,NULL,11,'2021-05-31 00:09:06',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (77,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:09:12',5,NULL,NULL,11,'2021-05-31 00:09:12',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (78,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:09:17',5,NULL,NULL,11,'2021-05-31 00:09:16',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (79,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:09:21',5,NULL,NULL,11,'2021-05-31 00:09:20',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (80,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:09:25',5,NULL,NULL,11,'2021-05-31 00:09:24',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (81,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:09:30',5,NULL,NULL,11,'2021-05-31 00:09:30',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (82,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:09:35',5,NULL,NULL,11,'2021-05-31 00:09:34',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (83,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:09:39',5,NULL,NULL,11,'2021-05-31 00:09:38',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (84,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:09:42',5,NULL,NULL,11,'2021-05-31 00:09:42',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (85,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:09:47',5,NULL,NULL,11,'2021-05-31 00:09:46',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (86,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:09:52',5,NULL,NULL,11,'2021-05-31 00:09:51',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (87,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:09:59',5,NULL,NULL,11,'2021-05-31 00:09:58',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (88,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:10:04',5,NULL,NULL,11,'2021-05-31 00:10:03',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (89,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:10:09',5,NULL,NULL,11,'2021-05-31 00:10:08',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (90,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:10:16',5,NULL,NULL,11,'2021-05-31 00:10:15',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (91,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:10:19',5,NULL,NULL,11,'2021-05-31 00:10:19',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (92,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:10:24',5,NULL,NULL,11,'2021-05-31 00:10:23',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (93,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:10:29',5,NULL,NULL,11,'2021-05-31 00:10:27',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (94,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:15:10',5,NULL,NULL,10,'2021-05-31 00:13:36',NULL,NULL,'Studio','Small Spaces, Big Impact','Task 5');
INSERT INTO `cbl_demonstrations` VALUES (95,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:15:53',5,NULL,NULL,9,'2021-05-31 00:15:11',NULL,NULL,'Studio','Small Spaces, Big Impact','Task 5');
INSERT INTO `cbl_demonstrations` VALUES (96,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:16:48',5,NULL,NULL,12,'2021-05-31 00:15:54',NULL,NULL,'Studio','Small Spaces, Big Impact','Task 5');
INSERT INTO `cbl_demonstrations` VALUES (97,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:17:44',5,NULL,NULL,8,'2021-05-31 00:16:49',NULL,NULL,'Studio','Small Spaces, Big Impact','Task 1');
INSERT INTO `cbl_demonstrations` VALUES (98,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:18:30',5,NULL,NULL,11,'2021-05-31 00:17:45',NULL,NULL,'Studio','Small Spaces, Big Impact','Task 5');
INSERT INTO `cbl_demonstrations` VALUES (99,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:21:43',5,'2021-05-31 01:13:01',5,10,'2021-05-31 00:19:41',NULL,NULL,'Independent Project','All Rise','Task 6');
INSERT INTO `cbl_demonstrations` VALUES (100,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:22:24',5,NULL,NULL,9,'2021-05-31 00:21:44',NULL,NULL,'Studio','All Rise','Task 6');
INSERT INTO `cbl_demonstrations` VALUES (101,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:23:08',5,NULL,NULL,12,'2021-05-31 00:22:25',NULL,NULL,'Studio','All Rise','Task 6');
INSERT INTO `cbl_demonstrations` VALUES (102,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:24:25',5,NULL,NULL,8,'2021-05-31 00:23:08',NULL,NULL,'Studio','All Rise','Task 6');
INSERT INTO `cbl_demonstrations` VALUES (103,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:25:12',5,NULL,NULL,11,'2021-05-31 00:24:29',NULL,NULL,'Studio','All Rise','Task 6');
INSERT INTO `cbl_demonstrations` VALUES (104,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:27:37',5,NULL,NULL,10,'2021-05-31 00:25:26',NULL,NULL,'Studio','Why Vote','Task 7');
INSERT INTO `cbl_demonstrations` VALUES (105,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:28:40',5,NULL,NULL,9,'2021-05-31 00:27:38',NULL,NULL,'Studio','Why Vote','Task 7');
INSERT INTO `cbl_demonstrations` VALUES (106,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:29:37',5,NULL,NULL,12,'2021-05-31 00:28:41',NULL,NULL,'Studio','Why Vote','Task 7');
INSERT INTO `cbl_demonstrations` VALUES (107,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:30:30',5,NULL,NULL,8,'2021-05-31 00:29:38',NULL,NULL,'Studio','Why Vote','Task 7');
INSERT INTO `cbl_demonstrations` VALUES (108,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:31:28',5,NULL,NULL,11,'2021-05-31 00:30:32',NULL,NULL,'Studio','Why Vote','Task 7');
INSERT INTO `cbl_demonstrations` VALUES (109,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:33:33',5,'2021-05-31 01:13:49',5,10,'2021-05-31 00:32:04',NULL,NULL,'Online Course','West Wing','Task 8');
INSERT INTO `cbl_demonstrations` VALUES (110,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:34:29',5,NULL,NULL,9,'2021-05-31 00:33:34',NULL,NULL,'Studio','West Wing','Task 8');
INSERT INTO `cbl_demonstrations` VALUES (111,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:35:18',5,NULL,NULL,12,'2021-05-31 00:34:30',NULL,NULL,'Studio','West Wing','Task 8');
INSERT INTO `cbl_demonstrations` VALUES (112,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:36:23',5,NULL,NULL,8,'2021-05-31 00:35:19',NULL,NULL,'Studio','West Wing','Task 8');
INSERT INTO `cbl_demonstrations` VALUES (113,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:37:24',5,NULL,NULL,11,'2021-05-31 00:36:24',NULL,NULL,'Studio','West Wing','Task 8');
INSERT INTO `cbl_demonstrations` VALUES (114,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:40:01',3,'2021-05-31 01:13:32',5,10,'2021-05-31 00:38:15',NULL,NULL,'Intensive','Power Struggle','Task 9');
INSERT INTO `cbl_demonstrations` VALUES (115,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:40:53',3,NULL,NULL,9,'2021-05-31 00:40:03',NULL,NULL,'Studio','Power Struggle','Task 9');
INSERT INTO `cbl_demonstrations` VALUES (116,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:41:47',3,NULL,NULL,12,'2021-05-31 00:40:54',NULL,NULL,'Studio','Power Struggle','Task 9');
INSERT INTO `cbl_demonstrations` VALUES (117,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:43:40',3,NULL,NULL,8,'2021-05-31 00:41:48',NULL,NULL,'Studio','Power Struggle','Task 9');
INSERT INTO `cbl_demonstrations` VALUES (118,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:44:23',3,NULL,NULL,11,'2021-05-31 00:43:41',NULL,NULL,'Studio','Power Struggle','Task 9');
INSERT INTO `cbl_demonstrations` VALUES (119,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:45:32',3,NULL,NULL,10,'2021-05-31 00:44:24',NULL,NULL,'Studio','Civil Rights','Task 10');
INSERT INTO `cbl_demonstrations` VALUES (120,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:46:12',3,NULL,NULL,9,'2021-05-31 00:45:33',NULL,NULL,'Studio','Civil Rights','Task 10');
INSERT INTO `cbl_demonstrations` VALUES (121,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:46:54',3,NULL,NULL,12,'2021-05-31 00:46:13',NULL,NULL,'Studio','Civil Rights','Task 10');
INSERT INTO `cbl_demonstrations` VALUES (122,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:47:46',3,NULL,NULL,8,'2021-05-31 00:46:55',NULL,NULL,'Studio','Civil Rights','Task 10');
INSERT INTO `cbl_demonstrations` VALUES (123,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:48:23',3,NULL,NULL,11,'2021-05-31 00:47:47',NULL,NULL,'Studio','Civil Rights','Task 10');
INSERT INTO `cbl_demonstrations` VALUES (124,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:49:55',3,NULL,NULL,10,'2021-05-31 00:48:23',NULL,NULL,'Studio','One Government to Rule Them All','Task 11');
INSERT INTO `cbl_demonstrations` VALUES (125,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:50:32',3,NULL,NULL,9,'2021-05-31 00:49:56',NULL,NULL,'Studio','One Government to Rule Them All','Task 11');
INSERT INTO `cbl_demonstrations` VALUES (126,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:51:13',3,NULL,NULL,12,'2021-05-31 00:50:34',NULL,NULL,'Studio','One Government to Rule Them All','Task 11');
INSERT INTO `cbl_demonstrations` VALUES (127,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:52:00',3,NULL,NULL,8,'2021-05-31 00:51:14',NULL,NULL,'Studio','One Government to Rule Them All','Task 11');
INSERT INTO `cbl_demonstrations` VALUES (128,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:52:28',3,NULL,NULL,11,'2021-05-31 00:52:01',NULL,NULL,'Studio','One Government to Rule Them All','Task 11');
INSERT INTO `cbl_demonstrations` VALUES (129,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:53:24',3,NULL,NULL,10,'2021-05-31 00:52:29',NULL,NULL,'Studio','Student Activism','Task 12');
INSERT INTO `cbl_demonstrations` VALUES (130,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:53:51',3,NULL,NULL,9,'2021-05-31 00:53:24',NULL,NULL,'Studio','Student Activism','Task 12');
INSERT INTO `cbl_demonstrations` VALUES (131,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:54:25',3,NULL,NULL,12,'2021-05-31 00:53:52',NULL,NULL,'Studio','Student Activism','Task 12');
INSERT INTO `cbl_demonstrations` VALUES (132,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:55:23',3,NULL,NULL,8,'2021-05-31 00:54:25',NULL,NULL,'Studio','Student Activism','Task 12');
INSERT INTO `cbl_demonstrations` VALUES (133,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 00:55:53',3,NULL,NULL,11,'2021-05-31 00:55:24',NULL,NULL,'Studio','Student Activism','Task 12');
INSERT INTO `cbl_demonstrations` VALUES (134,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:56:44',3,NULL,NULL,8,'2021-05-31 00:56:43',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (135,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:56:50',3,NULL,NULL,8,'2021-05-31 00:56:49',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (136,'Slate\\CBL\\Demonstrations\\OverrideDemonstration','2021-05-31 00:56:55',3,NULL,NULL,8,'2021-05-31 00:56:54',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `cbl_demonstrations` VALUES (137,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:02:19',3,NULL,NULL,10,'2021-05-31 01:01:27',NULL,NULL,'Studio','Voices of Vietnam','Task 13');
INSERT INTO `cbl_demonstrations` VALUES (138,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:02:45',3,NULL,NULL,9,'2021-05-31 01:02:20',NULL,NULL,'Studio','Voices of Vietnam','Task 13');
INSERT INTO `cbl_demonstrations` VALUES (139,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:03:10',3,NULL,NULL,12,'2021-05-31 01:02:46',NULL,NULL,'Studio','Voices of Vietnam','Task 13');
INSERT INTO `cbl_demonstrations` VALUES (140,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:03:46',3,NULL,NULL,8,'2021-05-31 01:03:11',NULL,NULL,'Studio','Voices of Vietnam','Task 13');
INSERT INTO `cbl_demonstrations` VALUES (141,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:04:04',3,NULL,NULL,11,'2021-05-31 01:03:47',NULL,NULL,'Studio','Voices of Vietnam','Task 13');
INSERT INTO `cbl_demonstrations` VALUES (142,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:04:52',3,NULL,NULL,10,'2021-05-31 01:04:04',NULL,NULL,'Studio','Mo\' Money Mo\' Problems','Task 14');
INSERT INTO `cbl_demonstrations` VALUES (143,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:05:16',3,NULL,NULL,9,'2021-05-31 01:04:53',NULL,NULL,'Studio','Mo\' Money Mo\' Problems','Task 14');
INSERT INTO `cbl_demonstrations` VALUES (144,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:05:36',3,NULL,NULL,12,'2021-05-31 01:05:17',NULL,NULL,'Studio','Mo\' Money Mo\' Problems','Task 14');
INSERT INTO `cbl_demonstrations` VALUES (145,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:05:59',3,NULL,NULL,8,'2021-05-31 01:05:36',NULL,NULL,'Studio','Mo\' Money Mo\' Problems','Task 14');
INSERT INTO `cbl_demonstrations` VALUES (146,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:06:21',3,NULL,NULL,11,'2021-05-31 01:06:00',NULL,NULL,'Studio','Mo\' Money Mo\' Problems','Task 14');
INSERT INTO `cbl_demonstrations` VALUES (147,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:07:38',3,NULL,NULL,10,'2021-05-31 01:06:22',NULL,NULL,'Studio','Waiting on the World to Change','Task 15');
INSERT INTO `cbl_demonstrations` VALUES (148,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:08:05',3,NULL,NULL,9,'2021-05-31 01:07:39',NULL,NULL,'Studio','Waiting on the World to Change','Task 15');
INSERT INTO `cbl_demonstrations` VALUES (149,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:08:39',3,NULL,NULL,8,'2021-05-31 01:08:05',NULL,NULL,'Studio','Waiting on the World to Change','Task 15');
INSERT INTO `cbl_demonstrations` VALUES (150,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:30:36',5,NULL,NULL,4,'2021-05-31 01:28:45',NULL,NULL,'Growth Testing','Growth Testing','Growth Testing');
INSERT INTO `cbl_demonstrations` VALUES (151,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:31:58',5,NULL,NULL,4,'2021-05-31 01:31:37',NULL,NULL,'Growth Testing','Growth Testing','Growth Testing');
INSERT INTO `cbl_demonstrations` VALUES (152,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:33:16',5,NULL,NULL,4,'2021-05-31 01:33:01',NULL,NULL,'Growth Testing','Growth Testing','Growth Testing');
INSERT INTO `cbl_demonstrations` VALUES (153,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:33:33',5,NULL,NULL,4,'2021-05-31 01:33:20',NULL,NULL,'Growth Testing','Growth Testing','Growth Testing');
INSERT INTO `cbl_demonstrations` VALUES (154,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:43:21',2,NULL,NULL,27,'2021-05-31 01:42:50',NULL,NULL,'Studio','Testing','Annotated Writing');
INSERT INTO `cbl_demonstrations` VALUES (155,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:44:50',2,NULL,NULL,27,'2021-05-31 01:44:04',NULL,NULL,'Studio','Testing','Photo Essay');
INSERT INTO `cbl_demonstrations` VALUES (156,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:46:01',2,NULL,NULL,27,'2021-05-31 01:45:38',NULL,NULL,'Studio','Testing','Argumentative Essay');
INSERT INTO `cbl_demonstrations` VALUES (157,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:46:21',2,NULL,NULL,27,'2021-05-31 01:46:02',NULL,NULL,'Studio','Testing','Argumentative Essay');
INSERT INTO `cbl_demonstrations` VALUES (158,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:48:06',2,NULL,NULL,27,'2021-05-31 01:47:34',NULL,NULL,'Studio','Testing','Expository/Informational Essay');
INSERT INTO `cbl_demonstrations` VALUES (159,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:48:36',2,NULL,NULL,27,'2021-05-31 01:48:06',NULL,NULL,'Studio','Testing','Expository/Informational Essay');
INSERT INTO `cbl_demonstrations` VALUES (160,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:50:55',2,NULL,NULL,27,'2021-05-31 01:48:37',NULL,NULL,'Studio','Testing','Narrative');
INSERT INTO `cbl_demonstrations` VALUES (161,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:54:12',2,NULL,NULL,27,'2021-05-31 01:53:51',NULL,NULL,'Studio','Testing','Narrative');
INSERT INTO `cbl_demonstrations` VALUES (162,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:56:10',2,NULL,NULL,27,'2021-05-31 01:55:43',NULL,NULL,'Studio','Testing','Socratic Seminar');
INSERT INTO `cbl_demonstrations` VALUES (163,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 01:59:57',2,NULL,NULL,27,'2021-05-31 01:59:29',NULL,NULL,'Studio','Testing','Research Paper');
INSERT INTO `cbl_demonstrations` VALUES (164,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 02:00:55',2,NULL,NULL,27,'2021-05-31 01:59:57',NULL,NULL,'Studio','Testing','Document-based Questions');
INSERT INTO `cbl_demonstrations` VALUES (165,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 11:34:39',2,NULL,NULL,28,'2021-05-31 11:34:08',NULL,NULL,'Studio','Testing','Infographic');
INSERT INTO `cbl_demonstrations` VALUES (167,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 11:36:49',2,NULL,NULL,28,'2021-05-31 11:36:13',NULL,NULL,'Studio','Testing','Document-based Questions');
INSERT INTO `cbl_demonstrations` VALUES (168,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 11:38:33',2,NULL,NULL,28,'2021-05-31 11:36:44',NULL,NULL,'Studio','Testing','Argumentative Essay');
INSERT INTO `cbl_demonstrations` VALUES (169,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 11:38:57',2,NULL,NULL,28,'2021-05-31 11:38:28',NULL,NULL,'Studio','Testing','Argumentative Essay');
INSERT INTO `cbl_demonstrations` VALUES (170,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 11:40:34',2,NULL,NULL,28,'2021-05-31 11:38:52',NULL,NULL,'Studio','Testing','Expository/Informational Essay');
INSERT INTO `cbl_demonstrations` VALUES (171,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 11:40:55',2,NULL,NULL,28,'2021-05-31 11:40:29',NULL,NULL,'Studio','Testing','Expository/Informational Essay');
INSERT INTO `cbl_demonstrations` VALUES (172,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 11:42:07',2,NULL,NULL,28,'2021-05-31 11:40:50',NULL,NULL,'Studio','Testing','Narrative');
INSERT INTO `cbl_demonstrations` VALUES (173,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 11:43:23',2,NULL,NULL,28,'2021-05-31 11:42:02',NULL,NULL,'Studio','Testing','Debate');
INSERT INTO `cbl_demonstrations` VALUES (175,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 11:45:17',2,NULL,NULL,28,'2021-05-31 11:44:38',NULL,NULL,'Studio','Testing','Research Paper');
INSERT INTO `cbl_demonstrations` VALUES (176,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 11:45:37',2,NULL,NULL,28,'2021-05-31 11:45:12',NULL,NULL,'Studio','Testing','Research Paper');
INSERT INTO `cbl_demonstrations` VALUES (180,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 12:06:05',2,NULL,NULL,27,'2021-05-31 12:05:18',NULL,NULL,'Studio','Testing','Science Investigation');
INSERT INTO `cbl_demonstrations` VALUES (181,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 12:06:27',2,NULL,NULL,27,'2021-05-31 12:06:00',NULL,NULL,'Studio','Testing','Science Investigation');
INSERT INTO `cbl_demonstrations` VALUES (182,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 12:23:04',2,NULL,NULL,27,'2021-05-31 12:20:20',NULL,NULL,'Studio','Testing','Build/Design Project');
INSERT INTO `cbl_demonstrations` VALUES (183,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 12:23:30',2,NULL,NULL,27,'2021-05-31 12:22:59',NULL,NULL,'Studio','Testing','Engineering Design');
INSERT INTO `cbl_demonstrations` VALUES (184,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 12:27:06',2,NULL,NULL,27,'2021-05-31 12:26:01',NULL,NULL,'Studio','Testing','Learning Experience');
INSERT INTO `cbl_demonstrations` VALUES (185,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 12:27:39',2,NULL,NULL,27,'2021-05-31 12:27:01',NULL,NULL,'Studio','Testing','Learning Experience');
INSERT INTO `cbl_demonstrations` VALUES (186,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 12:27:54',2,NULL,NULL,27,'2021-05-31 12:27:34',NULL,NULL,'Studio','Testing','Learning Experience');
INSERT INTO `cbl_demonstrations` VALUES (187,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 12:28:10',2,NULL,NULL,27,'2021-05-31 12:27:49',NULL,NULL,'Studio','Testing','Learning Experience');
INSERT INTO `cbl_demonstrations` VALUES (188,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 12:35:36',2,NULL,NULL,27,'2021-05-31 12:34:30',NULL,NULL,'Studio','Testing','Plan an Event');
INSERT INTO `cbl_demonstrations` VALUES (189,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 12:39:22',2,NULL,NULL,27,'2021-05-31 12:35:31',NULL,NULL,'Studio','Testing','Plan an Event');
INSERT INTO `cbl_demonstrations` VALUES (190,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 12:39:56',2,NULL,NULL,27,'2021-05-31 12:39:17',NULL,NULL,'Studio','Testing','Plan an Event');
INSERT INTO `cbl_demonstrations` VALUES (191,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 12:43:42',2,NULL,NULL,27,'2021-05-31 12:42:29',NULL,NULL,'Presentation of Learning','Testing','Plan an Event');
INSERT INTO `cbl_demonstrations` VALUES (192,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 12:44:34',2,NULL,NULL,27,'2021-05-31 12:43:37',NULL,NULL,'Studio','Testing','Plan an Event');
INSERT INTO `cbl_demonstrations` VALUES (193,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 12:44:54',2,NULL,NULL,27,'2021-05-31 12:44:29',NULL,NULL,'Celebration of Learning','Testing','Plan an Event');
INSERT INTO `cbl_demonstrations` VALUES (194,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 13:11:07',2,NULL,NULL,6,'2021-05-31 13:10:15',NULL,NULL,'Celebration of Learning','Testing','Argumentative Essay');
INSERT INTO `cbl_demonstrations` VALUES (195,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 13:15:17',2,NULL,NULL,27,'2021-05-31 13:14:39',NULL,NULL,'Presentation of Learning','Testing','Build/Design Project');
INSERT INTO `cbl_demonstrations` VALUES (196,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-05-31 13:15:46',2,NULL,NULL,27,'2021-05-31 13:15:13',NULL,NULL,'Studio','Testing','Build/Design Project');
INSERT INTO `cbl_demonstrations` VALUES (197,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-08-09 00:22:58',2,NULL,NULL,6,'2021-08-09 00:22:03',NULL,NULL,'Studio','Testing CBL Archiving','Test');
INSERT INTO `cbl_demonstrations` VALUES (198,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-08-09 00:24:10',2,NULL,NULL,6,'2021-08-09 00:23:14',NULL,NULL,'Studio','Testing CBL Arching','Test');
INSERT INTO `cbl_demonstrations` VALUES (199,'Slate\\CBL\\Demonstrations\\ExperienceDemonstration','2021-08-09 00:35:08',1,NULL,NULL,6,'2021-08-09 00:34:31',NULL,NULL,'Studio','Testing CBL Archiving','Test');


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
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `history_cbl_demonstrations` SELECT NULL AS RevisionID, `cbl_demonstrations`.* FROM `cbl_demonstrations`;
