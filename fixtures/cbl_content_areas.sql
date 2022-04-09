/*!40103 SET TIME_ZONE='+00:00' */;
/*!40101 SET character_set_client = utf8 */;

CREATE TABLE `cbl_content_areas` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Class` enum('Slate\\CBL\\ContentArea') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Code` varchar(255) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Status` enum('draft','active','archived') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Code` (`Code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `cbl_content_areas` VALUES (1,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'ELA','English Language Arts','active');
INSERT INTO `cbl_content_areas` VALUES (2,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'HOS','Habits of Success','active');
INSERT INTO `cbl_content_areas` VALUES (3,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'HW','Health and Wellness','active');
INSERT INTO `cbl_content_areas` VALUES (4,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'MATH','Mathematics','active');
INSERT INTO `cbl_content_areas` VALUES (5,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'MC','Math Concepts','active');
INSERT INTO `cbl_content_areas` VALUES (6,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'NGE','NextGen Essentials','active');
INSERT INTO `cbl_content_areas` VALUES (7,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'PE','Physical Education','active');
INSERT INTO `cbl_content_areas` VALUES (8,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'SCI','Science','active');
INSERT INTO `cbl_content_areas` VALUES (9,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'SS','Social Studies','active');
INSERT INTO `cbl_content_areas` VALUES (10,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'VA','Visual Art','active');
INSERT INTO `cbl_content_areas` VALUES (11,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'WF','Wayfinding','active');
INSERT INTO `cbl_content_areas` VALUES (12,'Slate\\CBL\\ContentArea','2021-08-08 17:14:02',1,'TEST','Archived Area','archived');
