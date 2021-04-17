/*!40103 SET TIME_ZONE='+00:00' */;
/*!40101 SET character_set_client = utf8 */;

CREATE TABLE `cbl_demonstration_skills` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Class` enum('Slate\\CBL\\Demonstrations\\DemonstrationSkill') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `DemonstrationID` int(10) unsigned NOT NULL,
  `SkillID` int(10) unsigned NOT NULL,
  `TargetLevel` tinyint(4) DEFAULT NULL,
  `DemonstratedLevel` tinyint(3) unsigned DEFAULT NULL,
  `Override` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `DemonstrationSkill` (`DemonstrationID`,`SkillID`),
  KEY `DemonstrationID` (`DemonstrationID`),
  KEY `SkillID` (`SkillID`)
) ENGINE=MyISAM AUTO_INCREMENT=316 DEFAULT CHARSET=utf8;

INSERT INTO `cbl_demonstration_skills` VALUES (1,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,1,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (2,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,2,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (3,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,3,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (4,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,4,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (5,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,5,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (6,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,6,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (7,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,7,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (8,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,8,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (9,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,9,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (10,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,10,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (11,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,11,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (12,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,12,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (13,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,13,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (14,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,14,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (15,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,15,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (16,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,16,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (17,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,17,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (18,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,18,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (19,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,19,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (20,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,20,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (21,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,21,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (22,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,22,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (23,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,23,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (24,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,24,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (25,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,25,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (26,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,26,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (27,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,27,11,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (28,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,28,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (29,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,29,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (30,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,30,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (31,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,31,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (32,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,32,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (33,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,33,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (34,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,1,34,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (35,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,1,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (36,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,2,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (37,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,3,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (38,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,4,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (39,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,5,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (40,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,6,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (41,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,7,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (42,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,8,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (43,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,9,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (44,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,10,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (45,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,11,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (46,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,12,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (47,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,13,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (48,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,14,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (49,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,15,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (50,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,16,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (51,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,17,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (52,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,18,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (53,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,19,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (54,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,20,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (55,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,21,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (56,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,22,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (57,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,23,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (58,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,24,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (59,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,25,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (60,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,26,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (61,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,27,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (62,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,28,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (63,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,29,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (64,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,30,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (65,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,31,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (66,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,32,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (67,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,33,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (68,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,2,34,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (69,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,1,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (70,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,2,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (71,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,3,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (72,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,4,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (73,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,5,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (74,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,6,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (75,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,7,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (76,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,8,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (77,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,9,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (78,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,10,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (79,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,11,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (80,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,12,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (81,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,13,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (82,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,14,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (83,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,15,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (84,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,16,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (85,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,17,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (86,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,18,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (87,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,19,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (88,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,20,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (89,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,21,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (90,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,22,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (91,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,23,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (92,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,24,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (93,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,25,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (94,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,26,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (95,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,27,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (96,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,28,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (97,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,29,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (98,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,30,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (99,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,31,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (100,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,32,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (101,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,33,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (102,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,3,34,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (103,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,1,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (104,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,2,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (105,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,3,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (106,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,4,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (107,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,5,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (108,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,6,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (109,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,7,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (110,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,8,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (111,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,9,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (112,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,10,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (113,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,11,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (114,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,12,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (115,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,13,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (116,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,14,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (117,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,15,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (118,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,16,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (119,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,17,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (120,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,18,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (121,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,19,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (122,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,20,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (123,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,21,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (124,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,22,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (125,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,23,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (126,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,24,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (127,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,25,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (128,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,26,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (129,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,27,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (130,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,28,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (131,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,29,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (132,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,30,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (133,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,31,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (134,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,32,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (135,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,33,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (136,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,4,34,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (137,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,1,9,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (138,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,2,9,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (139,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,3,9,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (140,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,4,9,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (141,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,5,10,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (142,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,6,10,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (143,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,7,10,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (144,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,8,10,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (145,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,9,10,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (146,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,10,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (147,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,11,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (148,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,12,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (149,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,13,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (150,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,14,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (151,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,15,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (152,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,16,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (153,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,17,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (154,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,18,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (155,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,19,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (156,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,20,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (157,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,21,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (158,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,22,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (159,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,23,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (160,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,24,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (161,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,25,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (162,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,26,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (163,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,27,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (164,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,28,10,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (165,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,29,10,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (166,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,30,10,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (167,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,31,10,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (168,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,32,10,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (169,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,33,10,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (170,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,5,34,10,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (171,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,6,1,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (172,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,6,2,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (173,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,6,3,9,7,0);
INSERT INTO `cbl_demonstration_skills` VALUES (174,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,6,4,9,6,0);
INSERT INTO `cbl_demonstration_skills` VALUES (175,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,7,5,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (176,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,7,6,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (177,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,7,7,9,7,0);
INSERT INTO `cbl_demonstration_skills` VALUES (178,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,7,8,9,6,0);
INSERT INTO `cbl_demonstration_skills` VALUES (179,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,8,10,9,7,0);
INSERT INTO `cbl_demonstration_skills` VALUES (180,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,8,11,9,6,0);
INSERT INTO `cbl_demonstration_skills` VALUES (181,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,8,12,9,5,0);
INSERT INTO `cbl_demonstration_skills` VALUES (182,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,8,13,9,6,0);
INSERT INTO `cbl_demonstration_skills` VALUES (183,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,8,15,9,4,0);
INSERT INTO `cbl_demonstration_skills` VALUES (184,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,8,14,9,5,0);
INSERT INTO `cbl_demonstration_skills` VALUES (185,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,9,10,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (186,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,9,11,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (187,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,9,12,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (188,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,9,13,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (189,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,9,14,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (190,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,9,15,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (191,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,10,16,9,5,0);
INSERT INTO `cbl_demonstration_skills` VALUES (192,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,10,17,9,6,0);
INSERT INTO `cbl_demonstration_skills` VALUES (193,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,10,18,9,6,0);
INSERT INTO `cbl_demonstration_skills` VALUES (194,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,10,19,9,7,0);
INSERT INTO `cbl_demonstration_skills` VALUES (195,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,10,20,9,5,0);
INSERT INTO `cbl_demonstration_skills` VALUES (196,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,10,21,9,5,0);
INSERT INTO `cbl_demonstration_skills` VALUES (197,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,11,16,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (198,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,11,17,9,7,0);
INSERT INTO `cbl_demonstration_skills` VALUES (199,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,11,18,9,7,0);
INSERT INTO `cbl_demonstration_skills` VALUES (200,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,11,19,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (201,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,11,20,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (202,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,11,21,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (203,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,12,22,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (204,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,12,23,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (205,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,12,24,9,7,0);
INSERT INTO `cbl_demonstration_skills` VALUES (206,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,12,25,9,6,0);
INSERT INTO `cbl_demonstration_skills` VALUES (207,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,13,22,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (208,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,13,23,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (209,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,13,24,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (210,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,13,25,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (211,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,12,26,9,5,0);
INSERT INTO `cbl_demonstration_skills` VALUES (212,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,14,28,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (213,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,14,29,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (214,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,14,30,9,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (215,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,15,31,9,7,0);
INSERT INTO `cbl_demonstration_skills` VALUES (216,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,15,32,9,6,0);
INSERT INTO `cbl_demonstration_skills` VALUES (217,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,15,33,9,7,0);
INSERT INTO `cbl_demonstration_skills` VALUES (218,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,15,34,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (219,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,16,31,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (220,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,17,143,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (221,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,17,144,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (222,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,17,145,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (223,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,17,146,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (224,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,17,147,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (225,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,17,148,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (226,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,17,149,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (227,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,17,150,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (228,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,17,151,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (229,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,17,152,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (230,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,17,153,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (231,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,17,154,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (232,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,17,155,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (233,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,17,156,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (234,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,17,157,9,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (235,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,18,143,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (236,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,18,144,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (237,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,18,145,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (238,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,18,146,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (239,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,18,147,9,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (240,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,18,148,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (241,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,18,149,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (242,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,18,150,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (243,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,18,151,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (244,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,19,155,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (245,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,19,156,10,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (246,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,20,158,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (247,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,20,159,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (248,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,20,160,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (249,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,20,161,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (250,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,20,162,9,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (251,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,21,158,9,7,0);
INSERT INTO `cbl_demonstration_skills` VALUES (252,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,22,143,10,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (253,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,22,144,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (254,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,22,145,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (255,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,22,146,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (256,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,22,147,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (257,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,22,148,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (258,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,22,149,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (259,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,23,143,10,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (260,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,24,150,10,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (261,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,25,152,10,7,0);
INSERT INTO `cbl_demonstration_skills` VALUES (262,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,26,163,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (263,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,26,164,9,7,0);
INSERT INTO `cbl_demonstration_skills` VALUES (264,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,27,163,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (266,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,28,1,10,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (267,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,28,2,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (268,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,28,3,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (269,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,28,4,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (270,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,29,5,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (271,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,29,6,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (272,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,29,7,11,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (273,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,29,8,11,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (274,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,30,42,9,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (275,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,30,43,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (276,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,30,44,9,11,0);
INSERT INTO `cbl_demonstration_skills` VALUES (277,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,31,42,10,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (278,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,31,44,10,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (279,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,31,43,10,7,0);
INSERT INTO `cbl_demonstration_skills` VALUES (280,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,32,42,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (281,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,32,43,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (282,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,32,44,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (283,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,33,45,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (284,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,33,46,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (285,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,33,47,9,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (286,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,34,45,10,7,0);
INSERT INTO `cbl_demonstration_skills` VALUES (287,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,34,46,10,8,0);
INSERT INTO `cbl_demonstration_skills` VALUES (288,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,34,47,10,7,0);
INSERT INTO `cbl_demonstration_skills` VALUES (289,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,35,45,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (290,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,35,46,10,9,0);
INSERT INTO `cbl_demonstration_skills` VALUES (291,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,35,47,10,10,0);
INSERT INTO `cbl_demonstration_skills` VALUES (292,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,36,5,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (293,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,36,6,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (294,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,36,7,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (295,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,36,8,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (296,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,36,9,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (297,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,37,5,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (298,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,37,6,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (299,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,37,7,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (300,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,37,8,10,0,0);
INSERT INTO `cbl_demonstration_skills` VALUES (301,'Slate\\CBL\\Demonstrations\\DemonstrationSkill','2019-01-02 03:04:05',3,NULL,NULL,37,9,10,0,0);


CREATE TABLE `history_cbl_demonstration_skills` (
  `RevisionID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ID` int(10) unsigned NOT NULL,
  `Class` enum('Slate\\CBL\\Demonstrations\\DemonstrationSkill') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `DemonstrationID` int(10) unsigned NOT NULL,
  `SkillID` int(10) unsigned NOT NULL,
  `TargetLevel` tinyint(4) DEFAULT NULL,
  `DemonstratedLevel` tinyint(3) unsigned DEFAULT NULL,
  `Override` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`RevisionID`),
  KEY `ID` (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `history_cbl_demonstration_skills` SELECT NULL AS RevisionID, `cbl_demonstration_skills`.* FROM `cbl_demonstration_skills`;
