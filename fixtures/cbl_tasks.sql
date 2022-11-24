/*!40103 SET TIME_ZONE='+00:00' */;
/*!40101 SET character_set_client = utf8 */;

CREATE TABLE `cbl_tasks` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Class` enum('Slate\\CBL\\Tasks\\Task','Slate\\CBL\\Tasks\\ExperienceTask') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `SectionID` int(10) unsigned DEFAULT NULL,
  `Title` varchar(255) NOT NULL,
  `Handle` varchar(255) NOT NULL,
  `ParentTaskID` int(10) unsigned DEFAULT NULL,
  `ClonedTaskID` int(10) unsigned DEFAULT NULL,
  `Shared` enum('course','school','public') DEFAULT NULL,
  `Status` enum('private','shared','archived','deleted') NOT NULL DEFAULT 'private',
  `Instructions` text,
  `DueDate` timestamp NULL DEFAULT NULL,
  `ExpirationDate` timestamp NULL DEFAULT NULL,
  `ExperienceType` varchar(255) DEFAULT 'Studio',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Handle` (`Handle`),
  KEY `SectionID` (`SectionID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `cbl_tasks` VALUES (1,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,2,'ELA Task One','ela_task_one',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (2,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,2,'ELA Task Two','ela_task_two',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (3,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,4,'Current Year any Term Task','current_year_any_term_task',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (4,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,3,'Un-Enrolled Section Task','un-enrolled_section_task',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (5,'Slate\\CBL\\Tasks\\ExperienceTask','2019-01-02 03:04:05',3,NULL,NULL,5,'Previous Year Task','previous_year_task',NULL,NULL,NULL,'private','Follow the instructions.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (6,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-28 21:20:40',3,NULL,NULL,6,'Launch: Portfolio Reflection','launch--portfolio_reflection',NULL,NULL,NULL,'shared','Complete the attached reflection and then schedule your teacher conference.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (7,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-28 21:33:53',3,NULL,NULL,6,'Step.1: The Art of Resistance Anticipation Guide','launch.1--the_art_of_resistance_anticipation_guide',6,NULL,NULL,'private','Complete the Art Inquiry document and submit.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (8,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 11:39:00',3,NULL,NULL,6,'Step.2: The Art of Resistance Vocabulary','launch.2--the_art_of_resistance_vocabulary',6,NULL,NULL,'private','Complete the Quizlet and submit a screenshot of your performance.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (9,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 11:41:56',3,NULL,NULL,6,'Step.3: Internment Background Inquiry','launch.3--internment_background_inquiry',6,NULL,NULL,'private','Complete the Jigsaw activity.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (10,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 11:47:38',3,NULL,NULL,6,'Step.4: Speaker','launch.4--speaker',6,NULL,NULL,'private','Find a speaker/s from your community to talk about Muslim religion/cultures. If you can’t find someone in your community, try the link above.\n\nBefore the speaker/s, use  a Jamboard or Padlet or another collaborative document to brainstorms questions. Submit your collaborative document',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (11,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 11:55:05',3,NULL,NULL,6,'Milestone.1: Reading Strategies in Internment','milestone.1--reading_critically_in_internment',NULL,NULL,NULL,'shared','Complete and submit your digital notebook.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (12,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 12:02:01',3,NULL,NULL,6,'Milestone.2: Craft and Context in Internment','milestone.2--craft_and_context_in_internment',NULL,11,NULL,'shared','Complete and submit your digital notebook.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (13,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 12:05:34',3,NULL,NULL,6,'Milestone.3: Main Idea and Themes of Internment','milestone.3--main_idea_and_themes_of_internment',NULL,12,NULL,'shared','Complete and submit the One Pager.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (14,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 12:08:26',3,NULL,NULL,6,'Milestone.4: Let Your Words Travel Through  The Air','milestone.4--let_your_words_travel_through_the_air',NULL,NULL,NULL,'shared','Complete and submit the Silent Discussion Reflection',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (15,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 12:12:47',3,NULL,NULL,6,'Step.1: Prepare for Silent Discussion','step.1--prepare_for_silent_discussion',14,NULL,NULL,'shared','Complete the Silent Discussion Prep document and submit.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (16,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 12:23:00',3,NULL,NULL,6,'Milestone.5: Impact Project Draft','milestone.5--project_prep',NULL,NULL,NULL,'shared','Submit your draft Artist Statement',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (17,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 12:38:44',3,NULL,NULL,6,'Step.1: Impact Project Prep','step.5.1--impact_project_prep',16,NULL,NULL,'private','Submit your draft Impact Project.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (18,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 12:43:03',3,NULL,NULL,6,'Milestone.6: Speak The Truth While It Is Still Alive','milestone.6--speak_the_truth_while_it_is_still_alive',NULL,NULL,NULL,'shared','Submit the final draft of your Artist Statement and get ready for the showcase!',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (19,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 12:45:38',3,NULL,NULL,6,'Step.1: Revision Checklist','step.1--revision_checklist',18,NULL,NULL,'shared','Complete and submit the revision checklist.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (20,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 12:46:29',3,NULL,NULL,6,'Step.2: Peer Revision Worksheet','step.2--peer_revision_worksheet',18,19,NULL,'shared','Complete and submit the peer revision worksheet.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (21,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 12:51:19',3,NULL,NULL,6,'Reflection: The Art of Resistance','reflection--the_art_of_resistance',NULL,NULL,NULL,'shared','Complete the reflection google form.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (22,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 13:16:26',5,NULL,NULL,7,'Launch: Does showing up to vote matter?','launch--does_showing_up_to_vote_matter',NULL,NULL,NULL,'shared','Compare your aid distribution map with the actual distribution of aid.  Look for correlations between the maps in the earlier part of the investigation to identify where the strongest correlation lies - between aid amounts and rate of disease, voter ideology, or voter turnout.\n\nComplete and submit a reflection',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (23,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 13:20:17',5,NULL,NULL,7,'Launch Step.1: See, think, wonder','step.1--see-think-wonder',22,NULL,NULL,'shared','Complete the short questions from the see, think, predict activity.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (24,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 13:21:56',5,NULL,NULL,7,'Launch Step.2: Create your map','step.2--create_your_map',22,NULL,NULL,'shared','Create a map proposing your idea of the optimal distribution of federal aid.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (25,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 13:25:29',5,NULL,NULL,7,'Milestone.1: Who Should Be Able to Vote','milestone.1--who_should_be_able_to_vote',NULL,NULL,NULL,'shared','After the discussion, complete and submit the reflection.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (26,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 13:29:42',5,NULL,NULL,7,'M.1 Step.1: Jigsaw Organizer','m.1_step.1--jigsaw_organizer',25,NULL,NULL,'shared','Complete and submit the jigsaw organizer.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (27,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 13:32:51',5,NULL,NULL,7,'M.1 Step.2: Argument Planner','m.1_step.2--argument_planner',25,NULL,NULL,'shared','Complete and submit the argument planner.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (28,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 13:34:32',5,NULL,NULL,7,'M.1 Step.3: Voting Discussion','m.1_step.3--voting_discussion',25,NULL,NULL,'shared','You will be scored after being observed in the fishbowl discussion activity.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (29,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 13:39:32',5,NULL,NULL,7,'Milestone.2: What Stops People from Voting?','milestone.2--what_stops_people_from_voting',NULL,NULL,NULL,'shared','Complete and submit the short answer questions.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (30,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 13:41:58',5,NULL,NULL,7,'M.2 Step.1: Why do/don\'t people vote?','m.2_step.1--why_do-don-t_people_vote',29,NULL,NULL,'shared','Read the articles and then complete and submit the short answer questions.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (31,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 13:46:19',5,NULL,NULL,7,'Milestone.3: Who votes?','milestone.3--who_votes',NULL,NULL,NULL,'shared','Complete all three steps of this milestone.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (32,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 13:48:06',5,NULL,NULL,7,'M.3 Step.1: Voter Influences','m.3_step.1--why_do-don-t_people_vote',31,NULL,NULL,'shared','Complete the assessment.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (33,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 13:50:14',5,NULL,NULL,7,'M.3 Step.2: Patterns and changes in voting behavior','m.3_step.2--patterns_and_changes_in_voting_behavior',31,NULL,NULL,'shared','Complete and submit the assessment.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (34,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 13:52:54',5,NULL,NULL,7,'M.3 Step.3: Voter turnout relationships','m.3_step.3--voter_turnout_relationships',31,NULL,NULL,'shared','Complete and submit the assessment.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (35,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 13:56:07',5,NULL,NULL,7,'Milestone.4: Should Voting Be Mandatory?','milestone.4--should_voting_be_mandatory',NULL,NULL,NULL,'shared','Complete both steps of this milestone.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (36,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 13:58:54',5,NULL,NULL,7,'M.4 Step.1: Examine Text Set','m.4_step.1--examine_text_set',35,35,NULL,'shared','Complete and submit the assessment.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (37,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 14:01:08',5,NULL,NULL,7,'M.4 Step.2: Venn Diagram','m.4_step.2--venn_diagram',35,NULL,NULL,'shared','Create a venn diagram using the text set from the previous step.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (38,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 14:03:31',5,NULL,NULL,7,'Milestone.5: How Do We Improve Voter Turnout?','milestone.5--how_do_we_improve_voter_turnout',NULL,NULL,NULL,'shared','Using the resources from the previous milestones, complete the research graphic organizer.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (39,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 14:05:08',5,NULL,NULL,7,'Milestone.6: How Do We Improve Voter Turnout?','milestone.6--how_do_we_improve_voter_turnout',NULL,NULL,NULL,'shared','Using all feedback, finalize your paper and submit.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (40,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 14:06:55',5,NULL,NULL,7,'M.6 Step.1: Introduce Claim','m.6_step.1--introduce_claim',39,NULL,NULL,'shared','Complete and submit the assessment.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (41,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 14:08:26',5,NULL,NULL,7,'M.6 Step.2: Claim/Counterclaim','m.6_step.2--claim-counterclaim',39,NULL,NULL,'shared','Complete and submit the assessment.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (42,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 14:09:56',5,NULL,NULL,7,'M.6 Step.3: Transitions','m.6_step.3--transitions',39,NULL,NULL,'shared','Complete and submit the assessment.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (43,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 14:11:20',5,NULL,NULL,7,'M.6 Step.4: Formal Style','m.6_step.4--formal_style',39,NULL,NULL,'shared','Complete and submit the assessment.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (44,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 14:12:54',5,NULL,NULL,7,'M.6 Step.5: Conclusion','m.6_step.5--conclusion',39,NULL,NULL,'shared','Complete and submit the assessment.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (45,'Slate\\CBL\\Tasks\\ExperienceTask','2021-05-29 14:14:45',5,NULL,NULL,7,'Reflection: Who Gets a Vote','reflection--who_gets_a_vote',NULL,21,NULL,'shared','Complete the reflection google form.',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (46,'Slate\\CBL\\Tasks\\ExperienceTask','2022-10-28 16:13:22',3,'2022-10-28 16:17:07',3,0,'A Shared Task','a_shared_task',NULL,NULL,NULL,'shared','A shared task that will be used to test the filtering of shared and unshared tasks',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (47,'Slate\\CBL\\Tasks\\ExperienceTask','2022-10-28 16:16:28',3,NULL,NULL,1,'An Unshared Task','an_unshared_task',NULL,NULL,NULL,'private','An unshared task that will be used to test the filtering of shared and unshared tasks',NULL,NULL,'Studio');
INSERT INTO `cbl_tasks` VALUES (48,'Slate\\CBL\\Tasks\\ExperienceTask','2022-11-17 21:00:26',3,'2022-11-17 21:00:35',3,1,'An Archived Task','an_archived_task',NULL,46,NULL,'archived','An archived task that will be used to test the filtering of archived tasks',NULL,NULL,'Studio');


CREATE TABLE `history_cbl_tasks` (
  `RevisionID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ID` int(10) unsigned NOT NULL,
  `Class` enum('Slate\\CBL\\Tasks\\Task','Slate\\CBL\\Tasks\\ExperienceTask') NOT NULL,
  `Created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatorID` int(11) DEFAULT NULL,
  `Modified` timestamp NULL DEFAULT NULL,
  `ModifierID` int(10) unsigned DEFAULT NULL,
  `SectionID` int(10) unsigned DEFAULT NULL,
  `Title` varchar(255) NOT NULL,
  `Handle` varchar(255) NOT NULL,
  `ParentTaskID` int(10) unsigned DEFAULT NULL,
  `ClonedTaskID` int(10) unsigned DEFAULT NULL,
  `Shared` enum('course','school','public') DEFAULT NULL,
  `Status` enum('private','shared','archived','deleted') NOT NULL DEFAULT 'private',
  `Instructions` text,
  `DueDate` timestamp NULL DEFAULT NULL,
  `ExpirationDate` timestamp NULL DEFAULT NULL,
  `ExperienceType` varchar(255) DEFAULT 'Studio',
  PRIMARY KEY (`RevisionID`),
  KEY `ID` (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `history_cbl_tasks` SELECT NULL AS RevisionID, `cbl_tasks`.* FROM `cbl_tasks`;
