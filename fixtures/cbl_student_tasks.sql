/*!40103 SET TIME_ZONE='+00:00' */;
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
  UNIQUE KEY `StudentTask` (`TaskID`,`StudentID`),
  UNIQUE KEY `DemonstrationID` (`DemonstrationID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `cbl_student_tasks` VALUES (1,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,1,4,'completed',1,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (2,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,1,6,'completed',4,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (3,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,2,4,'completed',5,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (4,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,2,6,'completed',3,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (5,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,3,4,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (6,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,4,4,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (7,'Slate\\CBL\\Tasks\\StudentTask','2019-01-02 03:04:05',3,NULL,NULL,5,4,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (8,'Slate\\CBL\\Tasks\\StudentTask','2021-05-28 21:20:40',3,NULL,NULL,6,23,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (9,'Slate\\CBL\\Tasks\\StudentTask','2021-05-28 21:20:40',3,NULL,NULL,6,24,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (10,'Slate\\CBL\\Tasks\\StudentTask','2021-05-28 21:20:40',3,NULL,NULL,6,25,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (11,'Slate\\CBL\\Tasks\\StudentTask','2021-05-28 21:20:40',3,NULL,NULL,6,26,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (12,'Slate\\CBL\\Tasks\\StudentTask','2021-05-28 21:33:54',3,NULL,NULL,7,23,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (13,'Slate\\CBL\\Tasks\\StudentTask','2021-05-28 21:33:54',3,NULL,NULL,7,24,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (14,'Slate\\CBL\\Tasks\\StudentTask','2021-05-28 21:33:54',3,NULL,NULL,7,25,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (15,'Slate\\CBL\\Tasks\\StudentTask','2021-05-28 21:33:54',3,NULL,NULL,7,26,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (16,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 11:39:00',3,NULL,NULL,8,23,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (17,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 11:39:00',3,NULL,NULL,8,24,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (18,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 11:39:00',3,NULL,NULL,8,25,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (19,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 11:39:00',3,NULL,NULL,8,26,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (20,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 11:41:56',3,NULL,NULL,9,23,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (21,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 11:41:56',3,NULL,NULL,9,24,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (22,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 11:41:56',3,NULL,NULL,9,25,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (23,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 11:41:56',3,NULL,NULL,9,26,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (24,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 11:47:38',3,NULL,NULL,10,23,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (25,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 11:47:38',3,NULL,NULL,10,24,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (26,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 11:47:38',3,NULL,NULL,10,25,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (27,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 11:47:38',3,NULL,NULL,10,26,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (28,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 11:55:05',3,NULL,NULL,11,23,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (29,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 11:55:05',3,'2021-11-23 20:23:25',3,11,24,'re-assigned',225,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (30,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 11:55:05',3,NULL,NULL,11,25,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (31,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 11:55:05',3,NULL,NULL,11,26,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (32,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:02:01',3,NULL,NULL,12,23,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (33,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:02:01',3,NULL,NULL,12,24,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (34,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:02:01',3,NULL,NULL,12,25,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (35,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:02:01',3,NULL,NULL,12,26,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (36,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:05:34',3,NULL,NULL,13,23,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (37,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:05:34',3,'2021-11-23 21:10:08',3,13,24,'assigned',226,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (38,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:05:34',3,NULL,NULL,13,25,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (39,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:05:34',3,NULL,NULL,13,26,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (40,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:08:26',3,NULL,NULL,14,23,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (41,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:08:26',3,NULL,NULL,14,24,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (42,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:08:26',3,NULL,NULL,14,25,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (43,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:08:26',3,NULL,NULL,14,26,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (44,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:12:48',3,NULL,NULL,15,23,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (45,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:12:48',3,NULL,NULL,15,24,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (46,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:12:48',3,NULL,NULL,15,25,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (47,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:12:48',3,NULL,NULL,15,26,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (48,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:23:00',3,NULL,NULL,16,23,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (49,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:23:00',3,NULL,NULL,16,24,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (50,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:23:00',3,NULL,NULL,16,25,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (51,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:23:00',3,NULL,NULL,16,26,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (52,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:38:45',3,NULL,NULL,17,23,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (53,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:38:45',3,NULL,NULL,17,24,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (54,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:38:45',3,NULL,NULL,17,25,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (55,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:38:45',3,NULL,NULL,17,26,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (56,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:43:03',3,NULL,NULL,18,23,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (57,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:43:03',3,NULL,NULL,18,24,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (58,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:43:03',3,NULL,NULL,18,25,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (59,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:43:03',3,NULL,NULL,18,26,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (60,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:45:38',3,NULL,NULL,19,23,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (61,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:45:38',3,NULL,NULL,19,24,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (62,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:45:38',3,NULL,NULL,19,25,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (63,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:45:38',3,NULL,NULL,19,26,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (64,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:46:29',3,NULL,NULL,20,23,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (65,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:46:29',3,NULL,NULL,20,24,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (66,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:46:29',3,NULL,NULL,20,25,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (67,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:46:29',3,NULL,NULL,20,26,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (68,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:51:19',3,NULL,NULL,21,23,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (69,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:51:19',3,NULL,NULL,21,24,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (70,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:51:19',3,NULL,NULL,21,25,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (71,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 12:51:19',3,NULL,NULL,21,26,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (72,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:16:26',5,NULL,NULL,22,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (73,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:16:26',5,NULL,NULL,22,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (74,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:16:26',5,NULL,NULL,22,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (75,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:16:26',5,NULL,NULL,22,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (76,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:16:26',5,NULL,NULL,22,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (77,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:20:17',5,NULL,NULL,23,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (78,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:20:17',5,NULL,NULL,23,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (79,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:20:17',5,NULL,NULL,23,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (80,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:20:17',5,NULL,NULL,23,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (81,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:20:17',5,NULL,NULL,23,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (82,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:21:56',5,NULL,NULL,24,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (83,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:21:56',5,NULL,NULL,24,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (84,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:21:56',5,NULL,NULL,24,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (85,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:21:56',5,NULL,NULL,24,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (86,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:21:56',5,NULL,NULL,24,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (87,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:25:29',5,NULL,NULL,25,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (88,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:25:29',5,NULL,NULL,25,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (89,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:25:29',5,NULL,NULL,25,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (90,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:25:29',5,NULL,NULL,25,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (91,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:25:29',5,NULL,NULL,25,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (92,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:29:42',5,NULL,NULL,26,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (93,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:29:42',5,NULL,NULL,26,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (94,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:29:42',5,NULL,NULL,26,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (95,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:29:42',5,NULL,NULL,26,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (96,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:29:42',5,NULL,NULL,26,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (97,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:32:51',5,NULL,NULL,27,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (98,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:32:51',5,NULL,NULL,27,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (99,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:32:51',5,NULL,NULL,27,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (100,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:32:51',5,NULL,NULL,27,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (101,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:32:51',5,NULL,NULL,27,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (102,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:34:32',5,NULL,NULL,28,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (103,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:34:32',5,NULL,NULL,28,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (104,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:34:32',5,NULL,NULL,28,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (105,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:34:32',5,NULL,NULL,28,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (106,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:34:32',5,NULL,NULL,28,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (107,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:39:33',5,NULL,NULL,29,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (108,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:39:33',5,NULL,NULL,29,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (109,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:39:33',5,NULL,NULL,29,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (110,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:39:33',5,NULL,NULL,29,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (111,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:39:33',5,NULL,NULL,29,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (112,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:41:58',5,NULL,NULL,30,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (113,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:41:58',5,NULL,NULL,30,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (114,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:41:58',5,NULL,NULL,30,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (115,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:41:58',5,NULL,NULL,30,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (116,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:41:58',5,NULL,NULL,30,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (117,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:46:19',5,NULL,NULL,31,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (118,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:46:19',5,NULL,NULL,31,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (119,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:46:19',5,NULL,NULL,31,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (120,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:46:19',5,NULL,NULL,31,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (121,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:46:19',5,NULL,NULL,31,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (122,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:48:06',5,NULL,NULL,32,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (123,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:48:06',5,NULL,NULL,32,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (124,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:48:06',5,NULL,NULL,32,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (125,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:48:06',5,NULL,NULL,32,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (126,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:48:06',5,NULL,NULL,32,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (127,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:50:14',5,NULL,NULL,33,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (128,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:50:14',5,NULL,NULL,33,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (129,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:50:14',5,NULL,NULL,33,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (130,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:50:14',5,NULL,NULL,33,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (131,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:50:14',5,NULL,NULL,33,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (132,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:52:54',5,NULL,NULL,34,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (133,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:52:54',5,NULL,NULL,34,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (134,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:52:54',5,NULL,NULL,34,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (135,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:52:54',5,NULL,NULL,34,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (136,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:52:54',5,NULL,NULL,34,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (137,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:56:07',5,NULL,NULL,35,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (138,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:56:07',5,NULL,NULL,35,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (139,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:56:07',5,NULL,NULL,35,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (140,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:56:07',5,NULL,NULL,35,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (141,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:56:07',5,NULL,NULL,35,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (142,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:58:54',5,NULL,NULL,36,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (143,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:58:54',5,NULL,NULL,36,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (144,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:58:54',5,NULL,NULL,36,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (145,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:58:54',5,NULL,NULL,36,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (146,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 13:58:54',5,NULL,NULL,36,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (147,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:01:08',5,NULL,NULL,37,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (148,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:01:08',5,NULL,NULL,37,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (149,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:01:08',5,NULL,NULL,37,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (150,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:01:08',5,NULL,NULL,37,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (151,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:01:08',5,NULL,NULL,37,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (152,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:03:31',5,NULL,NULL,38,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (153,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:03:31',5,NULL,NULL,38,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (154,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:03:31',5,NULL,NULL,38,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (155,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:03:31',5,NULL,NULL,38,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (156,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:03:31',5,NULL,NULL,38,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (157,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:05:08',5,NULL,NULL,39,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (158,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:05:08',5,NULL,NULL,39,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (159,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:05:08',5,NULL,NULL,39,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (160,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:05:08',5,NULL,NULL,39,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (161,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:05:08',5,NULL,NULL,39,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (162,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:06:55',5,NULL,NULL,40,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (163,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:06:55',5,NULL,NULL,40,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (164,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:06:55',5,NULL,NULL,40,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (165,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:06:55',5,NULL,NULL,40,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (166,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:06:55',5,NULL,NULL,40,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (167,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:08:27',5,NULL,NULL,41,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (168,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:08:27',5,NULL,NULL,41,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (169,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:08:27',5,NULL,NULL,41,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (170,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:08:27',5,NULL,NULL,41,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (171,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:08:27',5,NULL,NULL,41,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (172,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:09:56',5,NULL,NULL,42,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (173,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:09:56',5,NULL,NULL,42,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (174,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:09:56',5,NULL,NULL,42,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (175,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:09:56',5,NULL,NULL,42,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (176,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:09:56',5,NULL,NULL,42,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (177,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:11:20',5,NULL,NULL,43,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (178,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:11:20',5,NULL,NULL,43,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (179,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:11:20',5,NULL,NULL,43,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (180,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:11:20',5,NULL,NULL,43,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (181,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:11:20',5,NULL,NULL,43,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (182,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:12:54',5,NULL,NULL,44,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (183,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:12:54',5,NULL,NULL,44,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (184,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:12:54',5,NULL,NULL,44,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (185,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:12:54',5,NULL,NULL,44,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (186,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:12:54',5,NULL,NULL,44,12,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (187,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:14:45',5,NULL,NULL,45,8,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (188,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:14:45',5,NULL,NULL,45,9,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (189,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:14:45',5,NULL,NULL,45,10,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (190,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:14:45',5,NULL,NULL,45,11,'assigned',NULL,NULL,NULL);
INSERT INTO `cbl_student_tasks` VALUES (191,'Slate\\CBL\\Tasks\\StudentTask','2021-05-29 14:14:45',5,NULL,NULL,45,12,'assigned',NULL,NULL,NULL);


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
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `history_cbl_student_tasks` SELECT NULL AS RevisionID, `cbl_student_tasks`.* FROM `cbl_student_tasks`;
