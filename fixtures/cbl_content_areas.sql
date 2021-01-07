/*!40103 SET TIME_ZONE='+00:00' */;
/*!40101 SET character_set_client = utf8 */;

CREATE TABLE `cbl_content_areas` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Class` enum('Slate\\CBL\\ContentArea') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Code` varchar(255) NOT NULL,
  `Title` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Code` (`Code`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

INSERT INTO `cbl_content_areas` VALUES (1,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'ELA','English Language Arts');
INSERT INTO `cbl_content_areas` VALUES (2,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'HOS','Habits of Success');
INSERT INTO `cbl_content_areas` VALUES (3,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'HW','Health and Wellness');
INSERT INTO `cbl_content_areas` VALUES (4,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'MATH','Mathematics');
INSERT INTO `cbl_content_areas` VALUES (5,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'MC','Math Concepts');
INSERT INTO `cbl_content_areas` VALUES (6,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'NGE','NextGen Essentials');
INSERT INTO `cbl_content_areas` VALUES (7,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'PE','Physical Education');
INSERT INTO `cbl_content_areas` VALUES (8,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'SCI','Science');
INSERT INTO `cbl_content_areas` VALUES (9,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'SS','Social Studies');
INSERT INTO `cbl_content_areas` VALUES (10,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'VA','Visual Art');
INSERT INTO `cbl_content_areas` VALUES (11,'Slate\\CBL\\ContentArea','2019-01-02 03:04:05',1,'WF','Wayfinding');
