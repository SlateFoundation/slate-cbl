/*!40103 SET TIME_ZONE='+00:00' */;
/*!40101 SET character_set_client = utf8 */;

CREATE TABLE `cbl_competencies` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Class` enum('Slate\\CBL\\Competency') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `ContentAreaID` int(10) unsigned NOT NULL,
  `Code` varchar(255) NOT NULL,
  `Descriptor` varchar(255) NOT NULL,
  `Statement` text NOT NULL,
  `Status` enum('draft','active','archived') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Code` (`Code`),
  KEY `ContentAreaID` (`ContentAreaID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `cbl_competencies` VALUES (1,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,1,'ELA.1','Reading Critically','I can read and critique diverse texts (e.g., books, films, advertising, music, social media, news websites).','active');
INSERT INTO `cbl_competencies` VALUES (2,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,1,'ELA.2','Expressing Ideas','I can clearly and effectively express my ideas (in written and oral form) for particular purposes and audiences, using diverse formats and settings to inform, persuade, and connect with others.','active');
INSERT INTO `cbl_competencies` VALUES (3,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,1,'ELA.3','Writing Evidence-based Arguments','I can write evidence-based arguments to support claims in an analysis of substantive topics or texts using valid reasoning and relevant and sufficient evidence.','active');
INSERT INTO `cbl_competencies` VALUES (4,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,1,'ELA.4','Writing Informational Texts','I can write informative texts to examine and convey complex ideas and information clearly and accurately through the effective selection, organization, and analysis of content.','active');
INSERT INTO `cbl_competencies` VALUES (5,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,1,'ELA.5','Writing Narrative Texts','I can write narratives to develop real or imagined experiences or events using effective technique, well-chosen details and well-structured event sequences.','active');
INSERT INTO `cbl_competencies` VALUES (6,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,1,'ELA.6','Collaborative Discussion','I can participate in collaborative discussions, listen critically, and respond appropriately individually or in a group setting.','active');
INSERT INTO `cbl_competencies` VALUES (7,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,1,'ELA.7','Conducting Research','I can frame and advance an inquiry to investigate topics, build knowledge, and analyze and integrate information.','active');
INSERT INTO `cbl_competencies` VALUES (8,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,2,'HOS.1','Personal Work Habits','I can demonstrate effective personal work habits to help me achieve my academic and personal goals.','active');
INSERT INTO `cbl_competencies` VALUES (9,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,2,'HOS.2','Planning My Journey','I can monitor my progress, set and track my goals, and create a post-secondary plan to ensure that I am college and career ready.','active');
INSERT INTO `cbl_competencies` VALUES (10,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,2,'HOS.3','Building Networks','I can build relationships with diverse individuals and expand my network of people who can help and support me.','active');
INSERT INTO `cbl_competencies` VALUES (11,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,2,'HOS.4','Professionalism','I can adhere to professional norms, effectively communicate and adapt to change in a variety of professional settings.','active');
INSERT INTO `cbl_competencies` VALUES (12,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,3,'HW.1','Apply Knowledge of Health Concepts','I can apply knowledge of concepts related to health promotion and disease prevention to enhance my health.','active');
INSERT INTO `cbl_competencies` VALUES (13,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,3,'HW.2','Analyze Health Promotion and Risk Reduction','I can demonstrate the ability to practice health-enhancing behaviors and avoid or reduce health risks.','active');
INSERT INTO `cbl_competencies` VALUES (14,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,3,'HW.3','Engage in Health Advocacy','I can demonstrate the ability to use interpersonal communication and advocacy skills; make decisions; and set goals to enhance my personal, family and community health.','active');
INSERT INTO `cbl_competencies` VALUES (15,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,4,'MATH.1','Mathematical Problem Solving','I can apply mathematical problem solving strategies to create efficient and high quality solutions to challenging problems.','active');
INSERT INTO `cbl_competencies` VALUES (16,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,4,'MATH.2','Mathematical Argumentation and Reflection','I can build, defend, and critique mathematical arguments while reflecting on my own problem solving processes and solutions.','active');
INSERT INTO `cbl_competencies` VALUES (17,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,5,'MC.1','Concepts for College and Career Readiness','I can demonstrate mastery for all college and career readiness concepts.','active');
INSERT INTO `cbl_competencies` VALUES (18,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,6,'NGE.1','Project Quality','I can plan, create, and implement a project in the world that has a positive impact on an authentic audience.','active');
INSERT INTO `cbl_competencies` VALUES (19,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,6,'NGE.2','Presentation','I can give purposeful and effective presentations in formal settings, making strategic and appropriate decisions about content, language use, and style based on the audience, venue, and topic.','active');
INSERT INTO `cbl_competencies` VALUES (20,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,6,'NGE.3','Collaboration','I can work effectively with diverse teams to create high quality products.','active');
INSERT INTO `cbl_competencies` VALUES (21,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,6,'NGE.4','Written Communication in the Workplace','I can effectively use a variety of formats for written communication in the workplace (e.g. email, memo, business plan, technical report, press release, white paper, guides, handbooks, directions, agendas, meeting minutes, blogs (sharing/reflection), reviews, discussion boards/forum, etc.).','active');
INSERT INTO `cbl_competencies` VALUES (22,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,7,'PE.1','Analyze Physical Fitness Activities and Outcomes','Demonstrate and apply fitness concepts.','active');
INSERT INTO `cbl_competencies` VALUES (23,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,7,'PE.2','Demonstrate Personal and Social Skills','Demonstrate and explain responsible personal behavior and responsible social behavior in physical activity settings.','active');
INSERT INTO `cbl_competencies` VALUES (24,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,7,'PE.3','Advance Health and Movement Performance','Demonstrate the fundamental and specialized motor skills and apply principles of movement for improved performance and health.','active');
INSERT INTO `cbl_competencies` VALUES (25,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,8,'SCI.1','Lead Scientific Investigations','I can plan and carry out a scientific investigation.','active');
INSERT INTO `cbl_competencies` VALUES (26,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,8,'SCI.2','Analyze and Interpret Data','I can analyze and interpret data to construct evidence-based explanations.','active');
INSERT INTO `cbl_competencies` VALUES (27,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,8,'SCI.3','Develop and Use Models','I can develop and use models to make predictions about phenomena, analyze systems, and communicate ideas.','active');
INSERT INTO `cbl_competencies` VALUES (28,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,8,'SCI.4','Technical Writing','I can engage in polished, professional technical writing for a range of purposes.','active');
INSERT INTO `cbl_competencies` VALUES (29,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,9,'SS.1','Analyzing Historical Events','I can apply historical literacy to demonstrate knowledge of major eras, enduring themes, turning points, and historic influences in the modern world.','active');
INSERT INTO `cbl_competencies` VALUES (30,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,9,'SS.2','Engaging as a Citizen','I can translate ideas, concerns, and findings into appropriate and responsible individual or collective action to improve conditions.','active');
INSERT INTO `cbl_competencies` VALUES (31,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,9,'SS.3','Understand Geographic Representations','I can use geographic representations to analyze relationships between place, culture, politics, and economics.','active');
INSERT INTO `cbl_competencies` VALUES (32,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,9,'SS.4','Analyze Human-Environmental Interactions','I can evaluate human-environmental interactions and use evidence to explain their impacts.','active');
INSERT INTO `cbl_competencies` VALUES (33,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,10,'VA.1','Create Visual Art','I can conceive and develop new artistic ideas and work.','active');
INSERT INTO `cbl_competencies` VALUES (34,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,10,'VA.2','Present Visual Art','I can interpret and share visual artwork.','active');
INSERT INTO `cbl_competencies` VALUES (35,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,10,'VA.3','Evaluate Visual Art','I can evaluate how the arts convey meaning.','active');
INSERT INTO `cbl_competencies` VALUES (36,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,11,'WF.1','Wayfinding 1','During my first portfolio of Wayfinding, I will learn about my strengths and interests as I complete studios, exhibit my learning, and engage with my PLP.','active');
INSERT INTO `cbl_competencies` VALUES (37,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,11,'WF.2','Wayfinding 2','During my second portfolio of Wayfinding, I will participate in career-connected studios and prepare for my Foundations Capstone.','active');
INSERT INTO `cbl_competencies` VALUES (38,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,11,'WF.3','Wayfinding 3','During my third portfolio of Wayfinding, I will start to personalize my pathway and begin to create my post-secondary plan.','active');
INSERT INTO `cbl_competencies` VALUES (39,'Slate\\CBL\\Competency','2019-01-02 03:04:05',1,NULL,NULL,11,'WF.4','Wayfinding 4','In my final Wayfinding portfolio, I will create my post-secondary plan and choose a passion project for my Design Capstone.','active');
INSERT INTO `cbl_competencies` VALUES (40,'Slate\\CBL\\Competency','2021-08-08 17:14:42',1,NULL,NULL,12,'TEST.1','Archived Competency','This is an archived competency.','archived');
INSERT INTO `cbl_competencies` VALUES (41,'Slate\\CBL\\Competency','2021-08-08 17:15:30',1,NULL,NULL,2,'HOS.5','HOS Archived Competency','This is an archived competency for HOS.','archived');


CREATE TABLE `history_cbl_competencies` (
  `RevisionID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ID` int(10) unsigned NOT NULL,
  `Class` enum('Slate\\CBL\\Competency') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `ContentAreaID` int(10) unsigned NOT NULL,
  `Code` varchar(255) NOT NULL,
  `Descriptor` varchar(255) NOT NULL,
  `Statement` text NOT NULL,
  `Status` enum('draft','active','archived') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`RevisionID`),
  KEY `ID` (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `history_cbl_competencies` SELECT NULL AS RevisionID, `cbl_competencies`.* FROM `cbl_competencies`;
