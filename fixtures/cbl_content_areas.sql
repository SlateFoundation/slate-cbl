/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

