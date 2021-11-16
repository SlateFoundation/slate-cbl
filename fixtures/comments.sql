/*!40103 SET TIME_ZONE='+00:00' */;
/*!40101 SET character_set_client = utf8 */;

CREATE TABLE `comments` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Class` enum('Emergence\\Comments\\Comment') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `ContextClass` varchar(255) NOT NULL,
  `ContextID` int(10) unsigned NOT NULL,
  `Handle` varchar(255) NOT NULL,
  `ReplyToID` int(10) unsigned DEFAULT NULL,
  `Message` text NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Handle` (`Handle`),
  KEY `CONTEXT` (`ContextClass`,`ContextID`),
  FULLTEXT KEY `FULLTEXT` (`Message`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `comments` VALUES (1,'Emergence\\Comments\\Comment','2021-11-09 20:06:58',3,'2021-11-16 21:19:33',4,'Slate\\CBL\\Tasks\\StudentTask',1,'cf52cd294a55',NULL,'Hello, I am a teacher and this is my comment');
INSERT INTO `comments` VALUES (2,'Emergence\\Comments\\Comment','2021-11-09 20:10:56',3,'2021-11-09 20:12:11',24,'Slate\\CBL\\Tasks\\StudentTask',69,'f45d12374390',NULL,'Hello Student, this is teacher. Here is my comment');
INSERT INTO `comments` VALUES (3,'Emergence\\Comments\\Comment','2021-11-09 20:12:11',24,'2021-11-09 20:12:11',24,'Slate\\CBL\\Tasks\\StudentTask',69,'ba54d702a247',NULL,'Hey Teacher! Student here, this is my comment');
INSERT INTO `comments` VALUES (4,'Emergence\\Comments\\Comment','2021-11-16 17:46:04',3,'2021-11-16 17:47:52',24,'Slate\\CBL\\Tasks\\StudentTask',29,'b08c646d2a11',NULL,'Hello, this is a comment from Teacher on  \"Milestone.1: Reading Strategies in Internment\"');
INSERT INTO `comments` VALUES (5,'Emergence\\Comments\\Comment','2021-11-16 17:47:52',24,'2021-11-16 17:47:52',24,'Slate\\CBL\\Tasks\\StudentTask',29,'ba96ec57eb68',NULL,'Hello, this is a comment from Edmund Ebel on \"Milestone.1: Reading Strategies in Internment\"');
INSERT INTO `comments` VALUES (6,'Emergence\\Comments\\Comment','2021-11-16 21:19:33',4,'2021-11-16 21:19:33',4,'Slate\\CBL\\Tasks\\StudentTask',1,'d6a3e850a561',NULL,'Hello, I am Slate Student and this is my comment');

CREATE TABLE `history_comments` (
  `RevisionID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ID` int(10) unsigned NOT NULL,
  `Class` enum('Emergence\\Comments\\Comment') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `ContextClass` varchar(255) NOT NULL,
  `ContextID` int(10) unsigned NOT NULL,
  `Handle` varchar(255) NOT NULL,
  `ReplyToID` int(10) unsigned DEFAULT NULL,
  `Message` text NOT NULL,
  PRIMARY KEY (`RevisionID`),
  KEY `ID` (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `history_comments` SELECT NULL AS RevisionID, `comments`.* FROM `comments`;

