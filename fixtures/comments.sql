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

INSERT INTO `comments` VALUES (1,'Emergence\\Comments\\Comment','2021-11-23 20:19:40',3,'2021-11-23 20:20:46',24,'Slate\\CBL\\Tasks\\StudentTask',29,'d07fd511db55',NULL,'Hello, this is Slate Teacher.   Edmund, I am reassigning this task.');
INSERT INTO `comments` VALUES (2,'Emergence\\Comments\\Comment','2021-11-23 20:20:46',24,'2021-11-23 20:20:46',24,'Slate\\CBL\\Tasks\\StudentTask',29,'e5e0f65714f5',NULL,'Hello, this is Edmund Ebel and this is my comment');
INSERT INTO `comments` VALUES (3,'Emergence\\Comments\\Comment','2021-11-23 21:11:18',24,'2021-11-23 21:11:18',24,'Slate\\CBL\\Tasks\\StudentTask',37,'d0bc22f5d988',NULL,'This task has a submission attachment with a very long URL that could potentially break formatting');

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

