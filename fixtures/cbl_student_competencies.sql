/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cbl_student_competencies` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Class` enum('Slate\\CBL\\StudentCompetency') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `StudentID` int(10) unsigned NOT NULL,
  `CompetencyID` int(10) unsigned NOT NULL,
  `Level` tinyint(4) NOT NULL,
  `EnteredVia` enum('enrollment','graduation') NOT NULL,
  `BaselineRating` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `StudentCompetency` (`StudentID`,`CompetencyID`,`Level`)
) ENGINE=MyISAM AUTO_INCREMENT=65 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `cbl_student_competencies` VALUES (1,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',2,4,1,9,'enrollment',9.00);
INSERT INTO `cbl_student_competencies` VALUES (2,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',2,6,1,9,'enrollment',9.00);
INSERT INTO `cbl_student_competencies` VALUES (3,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',2,6,2,9,'enrollment',9.00);
INSERT INTO `cbl_student_competencies` VALUES (4,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',2,4,2,9,'enrollment',9.00);
INSERT INTO `cbl_student_competencies` VALUES (5,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',2,4,3,9,'enrollment',9.00);
INSERT INTO `cbl_student_competencies` VALUES (6,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',2,6,3,9,'enrollment',9.00);
INSERT INTO `cbl_student_competencies` VALUES (7,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',2,6,4,9,'enrollment',9.00);
INSERT INTO `cbl_student_competencies` VALUES (8,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',2,4,4,9,'enrollment',9.00);
INSERT INTO `cbl_student_competencies` VALUES (9,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',2,4,5,9,'enrollment',9.00);
INSERT INTO `cbl_student_competencies` VALUES (10,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',2,6,5,9,'enrollment',9.00);
INSERT INTO `cbl_student_competencies` VALUES (11,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',2,6,6,9,'enrollment',9.00);
INSERT INTO `cbl_student_competencies` VALUES (12,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',2,4,6,9,'enrollment',9.00);
INSERT INTO `cbl_student_competencies` VALUES (13,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',2,4,7,9,'enrollment',9.00);
INSERT INTO `cbl_student_competencies` VALUES (14,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',2,6,7,9,'enrollment',9.00);
INSERT INTO `cbl_student_competencies` VALUES (15,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,4,3,10,'graduation',9.00);
INSERT INTO `cbl_student_competencies` VALUES (16,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,4,4,10,'graduation',9.00);
INSERT INTO `cbl_student_competencies` VALUES (17,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,4,5,10,'graduation',9.00);
INSERT INTO `cbl_student_competencies` VALUES (18,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,4,2,10,'graduation',9.50);
INSERT INTO `cbl_student_competencies` VALUES (19,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,4,3,11,'graduation',10.00);
INSERT INTO `cbl_student_competencies` VALUES (20,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,4,4,11,'graduation',10.00);
INSERT INTO `cbl_student_competencies` VALUES (21,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,4,5,11,'graduation',10.00);
INSERT INTO `cbl_student_competencies` VALUES (22,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,4,6,10,'graduation',9.50);
INSERT INTO `cbl_student_competencies` VALUES (23,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,4,7,10,'graduation',9.50);
INSERT INTO `cbl_student_competencies` VALUES (24,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,6,3,10,'graduation',9.00);
INSERT INTO `cbl_student_competencies` VALUES (25,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,6,4,10,'graduation',9.00);
INSERT INTO `cbl_student_competencies` VALUES (26,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,6,5,10,'graduation',9.00);
INSERT INTO `cbl_student_competencies` VALUES (27,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,6,2,10,'graduation',9.00);
INSERT INTO `cbl_student_competencies` VALUES (28,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,6,6,10,'graduation',9.00);
INSERT INTO `cbl_student_competencies` VALUES (29,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,6,7,10,'graduation',9.00);
INSERT INTO `cbl_student_competencies` VALUES (30,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,6,3,11,'graduation',9.00);
INSERT INTO `cbl_student_competencies` VALUES (31,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,6,4,11,'graduation',9.00);
INSERT INTO `cbl_student_competencies` VALUES (32,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,6,5,11,'graduation',9.00);
INSERT INTO `cbl_student_competencies` VALUES (33,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,4,1,10,'graduation',10.00);
INSERT INTO `cbl_student_competencies` VALUES (34,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,4,2,11,'graduation',10.00);
INSERT INTO `cbl_student_competencies` VALUES (35,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,4,3,12,'graduation',10.00);
INSERT INTO `cbl_student_competencies` VALUES (36,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,4,4,12,'graduation',10.00);
INSERT INTO `cbl_student_competencies` VALUES (37,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,4,5,12,'graduation',10.00);
INSERT INTO `cbl_student_competencies` VALUES (38,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',3,4,7,11,'graduation',10.00);
INSERT INTO `cbl_student_competencies` VALUES (39,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,1,9,'enrollment',7.25);
INSERT INTO `cbl_student_competencies` VALUES (40,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,2,9,'enrollment',NULL);
INSERT INTO `cbl_student_competencies` VALUES (41,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,3,9,'enrollment',5.50);
INSERT INTO `cbl_student_competencies` VALUES (42,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,4,9,'enrollment',5.67);
INSERT INTO `cbl_student_competencies` VALUES (43,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,5,9,'enrollment',NULL);
INSERT INTO `cbl_student_competencies` VALUES (44,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,6,9,'enrollment',NULL);
INSERT INTO `cbl_student_competencies` VALUES (45,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,7,9,'enrollment',7.00);
INSERT INTO `cbl_student_competencies` VALUES (46,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,25,9,'enrollment',9.14);
INSERT INTO `cbl_student_competencies` VALUES (47,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,26,9,'enrollment',9.50);
INSERT INTO `cbl_student_competencies` VALUES (48,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,27,9,'enrollment',9.67);
INSERT INTO `cbl_student_competencies` VALUES (49,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,28,9,'enrollment',9.67);
INSERT INTO `cbl_student_competencies` VALUES (50,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,27,10,'graduation',9.67);
INSERT INTO `cbl_student_competencies` VALUES (51,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,28,10,'graduation',9.67);
INSERT INTO `cbl_student_competencies` VALUES (52,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,25,10,'graduation',9.14);
INSERT INTO `cbl_student_competencies` VALUES (53,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,26,10,'graduation',9.25);
INSERT INTO `cbl_student_competencies` VALUES (54,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,29,9,'enrollment',9.40);
INSERT INTO `cbl_student_competencies` VALUES (55,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,30,9,'enrollment',NULL);
INSERT INTO `cbl_student_competencies` VALUES (56,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,31,9,'enrollment',NULL);
INSERT INTO `cbl_student_competencies` VALUES (57,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,32,9,'enrollment',NULL);
INSERT INTO `cbl_student_competencies` VALUES (58,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,8,9,'enrollment',NULL);
INSERT INTO `cbl_student_competencies` VALUES (59,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,9,9,'enrollment',NULL);
INSERT INTO `cbl_student_competencies` VALUES (60,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,10,9,'enrollment',9.33);
INSERT INTO `cbl_student_competencies` VALUES (61,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,11,9,'enrollment',9.00);
INSERT INTO `cbl_student_competencies` VALUES (62,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,10,10,'graduation',9.33);
INSERT INTO `cbl_student_competencies` VALUES (63,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,10,11,'graduation',9.67);
INSERT INTO `cbl_student_competencies` VALUES (64,'Slate\\CBL\\StudentCompetency','2019-01-02 03:04:05',1,7,11,10,'graduation',9.00);
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

