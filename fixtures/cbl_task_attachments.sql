/*!40103 SET TIME_ZONE='+00:00' */;
/*!40101 SET character_set_client = utf8 */;

CREATE TABLE `cbl_task_attachments` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Class` enum('Slate\\CBL\\Tasks\\Attachments\\GoogleDriveFile','Slate\\CBL\\Tasks\\Attachments\\Link') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `ContextClass` varchar(255) NOT NULL,
  `ContextID` int(10) unsigned NOT NULL,
  `Title` varchar(255) DEFAULT NULL,
  `Status` enum('normal','removed') NOT NULL DEFAULT 'normal',
  `FileID` int(10) unsigned DEFAULT NULL,
  `FileRevisionID` varchar(255) DEFAULT NULL,
  `ShareMethod` enum('duplicate','view-only','collaborate') DEFAULT 'view-only',
  `ParentAttachmentID` int(10) unsigned DEFAULT NULL,
  `URL` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `CONTEXT` (`ContextClass`,`ContextID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `cbl_task_attachments` VALUES (1,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-28 21:20:40',3,'Slate\\CBL\\Tasks\\Task',6,'ELA Portfolio Reflection','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1FShuHRLs4sn-3MdO8Nm98F0IYO7gPcUjz2GSRJXFoIc/edit');
INSERT INTO `cbl_task_attachments` VALUES (2,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-28 21:33:53',3,'Slate\\CBL\\Tasks\\Task',7,'The Art of Resistance Anticipation Guide','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1EN1rGIuSrq3qv6ZsH69NhwxlC3K3MJ9VQ1BEQDKiums/edit');
INSERT INTO `cbl_task_attachments` VALUES (3,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-28 21:33:53',3,'Slate\\CBL\\Tasks\\Task',7,'Art of Resistance Inquiry Slides','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/presentation/d/1nXEtUQNvIUlBb7OGZIuGjirnVFmONYO6fas0zCqmyO0/edit#slide=id.p');
INSERT INTO `cbl_task_attachments` VALUES (4,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-28 21:33:54',3,'Slate\\CBL\\Tasks\\Task',7,'Art Inquiry','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1Nf8GIgEydXtNyPoHJqruolOqTwC4ujZpTnzfUqE7IGQ/edit');
INSERT INTO `cbl_task_attachments` VALUES (5,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 11:39:00',3,'Slate\\CBL\\Tasks\\Task',8,'Quizlet','normal',NULL,NULL,'view-only',NULL,'https://quizlet.com/585805240/the-art-of-resistance-vocabulary-flash-cards/');
INSERT INTO `cbl_task_attachments` VALUES (6,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 11:41:56',3,'Slate\\CBL\\Tasks\\Task',9,'Internment Background Inquiry Mindmap','normal',NULL,NULL,'view-only',NULL,'https://www.canva.com/design/DAEbY08D-aE/1TrKmr4n6-iZI7nrc2_Czw/view?utm_content=DAEbY08D-aE&utm_campaign=designshare&utm_medium=link&utm_source=sharebutton');
INSERT INTO `cbl_task_attachments` VALUES (7,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 11:41:56',3,'Slate\\CBL\\Tasks\\Task',9,'Internment Background Inquiry Jigsaw','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/presentation/d/1SM2tsEzG22Cy2M2GPF01Qzlo0bhO3uVVbUH3nv3iFRU/edit#slide=id.p');
INSERT INTO `cbl_task_attachments` VALUES (8,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 11:47:38',3,'Slate\\CBL\\Tasks\\Task',10,'Schedule a Presentation about American Muslims','normal',NULL,NULL,'view-only',NULL,'https://ing.org/schedule-a-school-presentation/');
INSERT INTO `cbl_task_attachments` VALUES (9,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 11:55:05',3,'Slate\\CBL\\Tasks\\Task',11,'Mini Lessons for ELA.1','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/presentation/d/1wI_a7D5EqVr5qeU4bN0czOIwzNbwXFfq3DSHHjR69_U/edit#slide=id.p');
INSERT INTO `cbl_task_attachments` VALUES (10,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 11:55:05',3,'Slate\\CBL\\Tasks\\Task',11,'Internment Digital Notebook','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/presentation/d/1HepitdGmrA9D360HrFzDWMQw5hmchFmY7kji-J6D-nE/edit#slide=id.gbc96c353e7_6_0');
INSERT INTO `cbl_task_attachments` VALUES (11,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 12:02:01',3,'Slate\\CBL\\Tasks\\Task',12,'Mini Lessons for ELA.1','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/presentation/d/1wI_a7D5EqVr5qeU4bN0czOIwzNbwXFfq3DSHHjR69_U/edit#slide=id.p');
INSERT INTO `cbl_task_attachments` VALUES (12,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 12:02:01',3,'Slate\\CBL\\Tasks\\Task',12,'Internment Digital Notebook','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/presentation/d/1HepitdGmrA9D360HrFzDWMQw5hmchFmY7kji-J6D-nE/edit#slide=id.gbc96c353e7_6_0');
INSERT INTO `cbl_task_attachments` VALUES (13,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 12:05:34',3,'Slate\\CBL\\Tasks\\Task',13,'Mini Lessons for ELA.1','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/presentation/d/1wI_a7D5EqVr5qeU4bN0czOIwzNbwXFfq3DSHHjR69_U/edit#slide=id.p');
INSERT INTO `cbl_task_attachments` VALUES (14,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 12:05:34',3,'Slate\\CBL\\Tasks\\Task',13,'Internment Digital Notebook','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/presentation/d/1HepitdGmrA9D360HrFzDWMQw5hmchFmY7kji-J6D-nE/edit#slide=id.gbc96c353e7_6_0');
INSERT INTO `cbl_task_attachments` VALUES (15,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 12:05:34',3,'Slate\\CBL\\Tasks\\Task',13,'One Pager','normal',NULL,NULL,'view-only',NULL,'https://www.canva.com/design/DAEaJHs85UY/gDYHHA8-_QMBK1untHJ23Q/view?utm_content=DAEaJHs85UY&utm_campaign=designshare&utm_medium=link&utm_source=sharebutton&mode=preview');
INSERT INTO `cbl_task_attachments` VALUES (16,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 12:05:34',3,'Slate\\CBL\\Tasks\\Task',13,'Instructions for One Pager','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/132V5T9XUzO_IfHEDpC-CiGiT9Bqwh3vYcdlYJWu6OWs/edit');
INSERT INTO `cbl_task_attachments` VALUES (17,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 12:08:26',3,'Slate\\CBL\\Tasks\\Task',14,'Silent Discussion Reflection','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1VdnDaLSmQ3lOiTXDWvSUxPNSLG6TOoRedHTvwIDn2LU/edit');
INSERT INTO `cbl_task_attachments` VALUES (18,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 12:12:47',3,'Slate\\CBL\\Tasks\\Task',15,'Internment Discussion Preparation','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1pQh3praDmq1L26bXRjTkLtkpZgJ0wZVFntOxpDGUv_o/edit');
INSERT INTO `cbl_task_attachments` VALUES (19,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 12:12:47',3,'Slate\\CBL\\Tasks\\Task',15,'Silent Discussion Instructions','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1qau0vcdwGChnKuo5Pu5701EzUhugFxtdaVsdsIezwy0/edit');
INSERT INTO `cbl_task_attachments` VALUES (20,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 12:23:00',3,'Slate\\CBL\\Tasks\\Task',16,'How To Write Your Artist Statement','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1wvNa-Ajz00ASqQzUUzFoilRkWibySu_G9bNAp6CHnfA/edit');
INSERT INTO `cbl_task_attachments` VALUES (21,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 12:38:44',3,'Slate\\CBL\\Tasks\\Task',17,'Culminating Task','normal',NULL,NULL,'view-only',NULL,'https://sites.google.com/b21.allentownsd.org/resist/culminating-task');
INSERT INTO `cbl_task_attachments` VALUES (22,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 12:43:03',3,'Slate\\CBL\\Tasks\\Task',18,'Culminating Task Instructions','normal',NULL,NULL,'view-only',NULL,'https://sites.google.com/b21.allentownsd.org/resist/culminating-task');
INSERT INTO `cbl_task_attachments` VALUES (23,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:16:26',5,'Slate\\CBL\\Tasks\\Task',22,'Why Vote Tool - English','normal',NULL,NULL,'view-only',NULL,'https://drive.google.com/file/d/144EDPyZqqphnPMNO_8i9YMQSAUjbWci5/view');
INSERT INTO `cbl_task_attachments` VALUES (24,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:16:26',5,'Slate\\CBL\\Tasks\\Task',22,'Why Vote Tool - Spanish','normal',NULL,NULL,'view-only',NULL,'https://drive.google.com/file/d/1DzS1iWLTZVAeFmaKA7lmkNMDneUmUroA/view');
INSERT INTO `cbl_task_attachments` VALUES (25,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:20:17',5,'Slate\\CBL\\Tasks\\Task',23,'COVID-19 United States Cases by County','normal',NULL,NULL,'view-only',NULL,'https://coronavirus.jhu.edu/us-map');
INSERT INTO `cbl_task_attachments` VALUES (26,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:20:17',5,'Slate\\CBL\\Tasks\\Task',23,'Short questions about what students see/think/predict','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/presentation/d/1j30HWI_EKBSDCpecHppjnXF1qX1lYao1dsLsQH-vBQo/edit#slide=id.p');
INSERT INTO `cbl_task_attachments` VALUES (27,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:21:56',5,'Slate\\CBL\\Tasks\\Task',24,'Map Making Tool','normal',NULL,NULL,'view-only',NULL,'https://mapchart.net/usa.html');
INSERT INTO `cbl_task_attachments` VALUES (28,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:25:29',5,'Slate\\CBL\\Tasks\\Task',25,'Discussion Reflection','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1BF-qZXV-rCFoXK6SiBm03Vo_fLpHX3QSCoQyQ-eS5Cc/edit');
INSERT INTO `cbl_task_attachments` VALUES (29,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:29:42',5,'Slate\\CBL\\Tasks\\Task',26,'Jigsaw Organizer','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1oQh_rGDqSEZ4f-nISE7mO-aMur3MExGaP-AzZtVgGIk/edit');
INSERT INTO `cbl_task_attachments` VALUES (30,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:29:42',5,'Slate\\CBL\\Tasks\\Task',26,'A History of the Voting Rights Act','normal',NULL,NULL,'view-only',NULL,'https://www.aclu.org/issues/voting-rights/voting-rights-act/history-voting-rights-act');
INSERT INTO `cbl_task_attachments` VALUES (31,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:29:42',5,'Slate\\CBL\\Tasks\\Task',26,'The Fight to Vote','normal',NULL,NULL,'view-only',NULL,'https://www.kqed.org/lowdown/23300/the-fight-to-vote-a-history-of-voting-rights-in-america');
INSERT INTO `cbl_task_attachments` VALUES (32,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:29:42',5,'Slate\\CBL\\Tasks\\Task',26,'U.S. Voting Rights Timeline','normal',NULL,NULL,'view-only',NULL,'https://a.s.kqed.net/pdf/education/digitalmedia/us-voting-rights-timeline.pdf');
INSERT INTO `cbl_task_attachments` VALUES (33,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:32:51',5,'Slate\\CBL\\Tasks\\Task',27,'Millions of Americans can\'t vote for president because of where they live','normal',NULL,NULL,'view-only',NULL,'https://www.pri.org/stories/2016-11-01/millions-americans-cant-vote-president-because-where-they-live');
INSERT INTO `cbl_task_attachments` VALUES (34,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:32:51',5,'Slate\\CBL\\Tasks\\Task',27,'Should those who have committed serious crimes be allowed to vote?','normal',NULL,NULL,'view-only',NULL,'https://drive.google.com/file/d/158bYzMJRIiHir_5MzNwv01u6paHWqDnh/view');
INSERT INTO `cbl_task_attachments` VALUES (35,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:32:51',5,'Slate\\CBL\\Tasks\\Task',27,'Support is growing for lowering the voting age from 18 to 16','normal',NULL,NULL,'view-only',NULL,'https://drive.google.com/file/d/1WxOsNLq2FIsxoq6k5C0DWDEtkz8AqK3v/view');
INSERT INTO `cbl_task_attachments` VALUES (36,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:32:51',5,'Slate\\CBL\\Tasks\\Task',27,'Argument Planner','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1KTs50gxlDkA5kMbcmMINq74mbSukTOXnsmNrBpKXv8s/edit');
INSERT INTO `cbl_task_attachments` VALUES (37,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:39:32',5,'Slate\\CBL\\Tasks\\Task',29,'Short Answer Questions','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1hF2R1kI8YeSfVGoyXBBRKcyEd5_Jad0mXh4ugSaR1z4/edit');
INSERT INTO `cbl_task_attachments` VALUES (38,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:39:32',5,'Slate\\CBL\\Tasks\\Task',29,'All In: The Fight for American Democracy','normal',NULL,NULL,'view-only',NULL,'https://www.youtube.com/watch?v=avCEHtZlcRs');
INSERT INTO `cbl_task_attachments` VALUES (39,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:39:32',5,'Slate\\CBL\\Tasks\\Task',29,'Teaching the Truth About Voter Suppression','normal',NULL,NULL,'view-only',NULL,'https://www.learningforjustice.org/magazine/teaching-the-truth-about-voter-suppression');
INSERT INTO `cbl_task_attachments` VALUES (40,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:39:32',5,'Slate\\CBL\\Tasks\\Task',29,'What barriers to voting do Americans face and why does it matter?','normal',NULL,NULL,'view-only',NULL,'https://www.facinghistory.org/educator-resources/current-events/voting-rights-united-states');
INSERT INTO `cbl_task_attachments` VALUES (41,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:39:32',5,'Slate\\CBL\\Tasks\\Task',29,'How Selma\'s \'Bloody Sunday\' Became a Turning Point in the Civil Rights Movement','normal',NULL,NULL,'view-only',NULL,'https://www.history.com/news/selma-bloody-sunday-attack-civil-rights-movement');
INSERT INTO `cbl_task_attachments` VALUES (42,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:41:58',5,'Slate\\CBL\\Tasks\\Task',30,'4 reasons why many people don’t vote','normal',NULL,NULL,'view-only',NULL,'https://drive.google.com/file/d/1P3jNnpX21q4oWUFoNUyFXU7mzCDa8Xan/view');
INSERT INTO `cbl_task_attachments` VALUES (43,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:41:58',5,'Slate\\CBL\\Tasks\\Task',30,'Why More Young People Don’t Vote','normal',NULL,NULL,'view-only',NULL,'https://www.nytimes.com/2018/10/04/learning/lesson-plans/wasted-ballots-a-lesson-exploring-why-more-young-people-dont-vote-and-what-students-can-do-about-it.html');
INSERT INTO `cbl_task_attachments` VALUES (44,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:41:58',5,'Slate\\CBL\\Tasks\\Task',30,'Short Answer Questions','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1UZu2-V7s26XMtRbXrbFgWsQY90IYmkDn-Q8YWAiiZIE/edit');
INSERT INTO `cbl_task_attachments` VALUES (45,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:48:06',5,'Slate\\CBL\\Tasks\\Task',32,'Instruction','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/presentation/d/1eT5XbuYilLoI3Eq_Upsbg-dNAvm8dzbpTvrdS7s3Gfs/edit#slide=id.p');
INSERT INTO `cbl_task_attachments` VALUES (46,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:48:06',5,'Slate\\CBL\\Tasks\\Task',32,'Assessment','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1LUzROfOy-yEUNZfNIv4FsBh0-fuUf4rz5CsYeD7svKg/edit');
INSERT INTO `cbl_task_attachments` VALUES (47,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:50:14',5,'Slate\\CBL\\Tasks\\Task',33,'Instruction','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/presentation/d/1O9W24_8tLs50lZXIWrJ8amtqRVEPgpKcfFI9uDER0JA/edit#slide=id.p');
INSERT INTO `cbl_task_attachments` VALUES (48,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:50:14',5,'Slate\\CBL\\Tasks\\Task',33,'Assessment','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1bBLUw5REl_f4eTSvqCD6WmyyzWLQ3AVQ3Go85GtQSyY/edit');
INSERT INTO `cbl_task_attachments` VALUES (49,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:52:54',5,'Slate\\CBL\\Tasks\\Task',34,'PA Voter Turnout Map','normal',NULL,NULL,'view-only',NULL,'https://b21.maps.arcgis.com/apps/MapJournal/index.html?appid=2e03df031b2047f69bf219b1b9e761d4');
INSERT INTO `cbl_task_attachments` VALUES (50,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:52:54',5,'Slate\\CBL\\Tasks\\Task',34,'Assessment','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/13AWjBv8Cb2JSGYQDrQ8D44cmS4J10hqGBl2muIoxvVI/edit');
INSERT INTO `cbl_task_attachments` VALUES (51,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:56:07',5,'Slate\\CBL\\Tasks\\Task',35,'Instruction','removed',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1TF8N9oLYA_xiJWIzYUxl4Q2EXZoi5zvhbWQEokwr9mA/edit');
INSERT INTO `cbl_task_attachments` VALUES (52,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:56:07',5,'Slate\\CBL\\Tasks\\Task',35,'Mandatory Voting Would Be a Disaster','removed',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1PxOeGH7U48j1BJE7c2YiiVpWri8tLx_aWf2892XGzZA/edit#heading=h.lprqruw1anza');
INSERT INTO `cbl_task_attachments` VALUES (53,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:56:07',5,'Slate\\CBL\\Tasks\\Task',35,'Make Voting Mandatory in the U.S.','removed',NULL,NULL,'view-only',NULL,'https://drive.google.com/file/d/1YtCYmyh_zKPF89zVtxOZO_UJIYN6XFd3/view');
INSERT INTO `cbl_task_attachments` VALUES (54,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:56:07',5,'Slate\\CBL\\Tasks\\Task',35,'Assessment','removed',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1Lt3S_bTkHL7-8xk5zw4r_tZWpGZbomJvP-7H4g9voiw/edit');
INSERT INTO `cbl_task_attachments` VALUES (55,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:58:54',5,'Slate\\CBL\\Tasks\\Task',36,'Instruction','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1TF8N9oLYA_xiJWIzYUxl4Q2EXZoi5zvhbWQEokwr9mA/edit');
INSERT INTO `cbl_task_attachments` VALUES (56,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:58:54',5,'Slate\\CBL\\Tasks\\Task',36,'Mandatory Voting Would Be a Disaster','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1PxOeGH7U48j1BJE7c2YiiVpWri8tLx_aWf2892XGzZA/edit#heading=h.lprqruw1anza');
INSERT INTO `cbl_task_attachments` VALUES (57,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:58:54',5,'Slate\\CBL\\Tasks\\Task',36,'Make Voting Mandatory in the U.S.','normal',NULL,NULL,'view-only',NULL,'https://drive.google.com/file/d/1YtCYmyh_zKPF89zVtxOZO_UJIYN6XFd3/view');
INSERT INTO `cbl_task_attachments` VALUES (58,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 13:58:54',5,'Slate\\CBL\\Tasks\\Task',36,'Assessment','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1Lt3S_bTkHL7-8xk5zw4r_tZWpGZbomJvP-7H4g9voiw/edit');
INSERT INTO `cbl_task_attachments` VALUES (59,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 14:01:08',5,'Slate\\CBL\\Tasks\\Task',37,'Instruction','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1CzmTgdC-wXarYMrey6tgyB4KwGI4oopdBbOh-5gTLzo/edit');
INSERT INTO `cbl_task_attachments` VALUES (60,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 14:03:31',5,'Slate\\CBL\\Tasks\\Task',38,'Graphic Organizer','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1ExfUhQ8SXwoLnGv4l-fgGeBGztrB9MRrYkgbjZeWtKk/edit');
INSERT INTO `cbl_task_attachments` VALUES (61,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 14:06:55',5,'Slate\\CBL\\Tasks\\Task',40,'Instruction','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/presentation/d/1JLYqItzLG0uhtXnIGahAeInKHpQGinTnG-GOxQ2_Siw/edit#slide=id.p');
INSERT INTO `cbl_task_attachments` VALUES (62,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 14:06:55',5,'Slate\\CBL\\Tasks\\Task',40,'Assessment','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1jxiJedE3AoBcyyG7vJwr7UCa1_SJ4SHRT-GwtMtFuPk/edit');
INSERT INTO `cbl_task_attachments` VALUES (63,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 14:08:26',5,'Slate\\CBL\\Tasks\\Task',41,'Instruction','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1Ac8d2EKwsC7XCbKs4LE9bv8VnSPgr-YxY2McET2rc_8/edit');
INSERT INTO `cbl_task_attachments` VALUES (64,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 14:08:27',5,'Slate\\CBL\\Tasks\\Task',41,'Assessment','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1r5Ay165uIV2uNFh74AQLm4IC47TUEpw6v0qKEhgCNbg/edit');
INSERT INTO `cbl_task_attachments` VALUES (65,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 14:09:56',5,'Slate\\CBL\\Tasks\\Task',42,'Instruction','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1cM2rjq5dOoMLJoSO1-IxXHCaUjB50dfhclE166ajeNA/edit');
INSERT INTO `cbl_task_attachments` VALUES (66,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 14:09:56',5,'Slate\\CBL\\Tasks\\Task',42,'Assessment','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1n35rjrdc1OfVzfEcb_3u6ryB86-w13dyPDo4_mOqFLY/edit');
INSERT INTO `cbl_task_attachments` VALUES (67,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 14:11:20',5,'Slate\\CBL\\Tasks\\Task',43,'Instruction','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1wymR5RBryFHNbfxqaIEYb_rckas5RShsYwCAwRoAP64/edit');
INSERT INTO `cbl_task_attachments` VALUES (68,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 14:11:20',5,'Slate\\CBL\\Tasks\\Task',43,'Assessment','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1vM6ZnBlxEloIGVCAoRH8vKdaqaszw1C1zIttk4bwAsY/edit');
INSERT INTO `cbl_task_attachments` VALUES (69,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 14:12:54',5,'Slate\\CBL\\Tasks\\Task',44,'Instruction','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/presentation/d/1xIvp-JuzlC9TGPKQ6jd5mw2SwPXSRcd8T-rxh-CDGys/edit#slide=id.p');
INSERT INTO `cbl_task_attachments` VALUES (70,'Slate\\CBL\\Tasks\\Attachments\\Link','2021-05-29 14:12:54',5,'Slate\\CBL\\Tasks\\Task',44,'Assessment','normal',NULL,NULL,'view-only',NULL,'https://docs.google.com/document/d/1Dbulea85pBuiV0KcC1bCQtucT5xm7ZJfVe1BacBj9Fo/edit');
