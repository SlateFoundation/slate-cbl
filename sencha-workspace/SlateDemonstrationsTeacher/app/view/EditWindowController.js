Ext.define('SlateDemonstrationsTeacher.view.EditWindowController', {
//     extend: 'Ext.app.ViewController',
//     alias: 'controller.slate-demonstrations-teacher-demonstration-editwindow',
//     requires: [
//         'Slate.API',

//         'Slate.cbl.field.LevelSlider',
//         'Slate.cbl.data.Skills',

//         'Ext.window.MessageBox',
//         'Ext.window.Toast',
//         'Ext.util.MixedCollection'
//     ],


//     toastTitleTpl: [
//         '<tpl if="wasPhantom">',
//             'Demonstration Logged',
//         '<tpl else>',
//             'Demonstration Edited',
//         '</tpl>'
//     ],

//     toastBodyTpl: [
//         '<tpl if="wasPhantom">',
//             '<tpl for="student">',
//                 '<strong>{FirstName} {LastName}</strong>',
//             '</tpl>',
//             ' demonstrated',
//             ' <strong>',
//                 '{skills.length}',
//                 ' <tpl if="skills.length == 1">skill<tpl else>skills</tpl>',
//                 '.',
//             '</strong>',
//         '<tpl else>',
//             'Updated',
//             ' <strong>',
//                 '{skills.length}',
//                 ' <tpl if="skills.length == 1">skill<tpl else>skills</tpl>',
//             '</strong>',
//             ' demonstrated by',
//             '<tpl for="student">',
//                 ' <strong>',
//                     '{FirstName} {LastName}',
//                     '.',
//                 '</strong>',
//             '</tpl>',
//         '</tpl>'
//     ],


//     onLoadDemonstration: function(editWindow, demonstration) {
//         var me = this,
//             competenciesGrid = me.lookupReference('competenciesGrid'),
//             competenciesStore = Ext.getStore('cbl-competencies'),
//             _restoreSavedSkills;

//         // if loading a phantom, leave the form unloaded so empty fields aren't marked invalid
//         if (demonstration.phantom) {
//             return;
//         }

//         Ext.suspendLayouts();

//         // if loading an existing demonstration, load it into the form immediately.
//         me.lookupReference('form').loadRecord(demonstration);
//         me.lookupReference('loadNextStudentCheck').setVisible(demonstration.phantom);

//         competenciesGrid.setLoading('Loading competencies&hellip;');

//         // define closure for finishing this operation by loading already-saved skills into competencies grid
//         _restoreSavedSkills = function() {
//             var skills = demonstration.get('Skills') || [],
//                 skillsByCompetencyId = {},
//                 competenciesToLoad = [],
//                 skillsLength = skills.length, skillIndex = 0, demonstrationSkill, competencyId,
//                 _onCompetencyReady, _onFinished;

//             _onCompetencyReady = function(competency, competencyCard) {
//                 var competencySkills = skillsByCompetencyId[competency.getId()],
//                     competencySkillsLength = competencySkills.length,
//                     competencySkillIndex = 0,
//                     competencySkill;

//                 // remove competency from the queue
//                 Ext.Array.remove(competenciesToLoad, competency.getId());

//                 // load skills into competency
//                 for (; competencySkillIndex < competencySkillsLength; competencySkillIndex++) {
//                     competencySkill = competencySkills[competencySkillIndex];
//                     competencyCard.down('slate-cbl-levelsliderfield{skill.getId()=='+competencySkill.SkillID+'}').setLevel(competencySkill.DemonstratedLevel);
//                 }

//                 // finish loading cycle when the queue is empty
//                 if (!competenciesToLoad.length) {
//                     competenciesGrid.setLoading(false);
//                     Ext.resumeLayouts(true);
//                     me.scrollCompetenciesTabsToEnd();
//                 }
//             };

//             // group skills by competency and a queue of competencies to be loaded
//             for (; skillIndex < skillsLength; skillIndex++) {
//                 demonstrationSkill = skills[skillIndex];
//                 competencyId = demonstrationSkill.Skill.CompetencyID;

//                 if (competencyId in skillsByCompetencyId) {
//                     skillsByCompetencyId[competencyId].push(demonstrationSkill);
//                 } else {
//                     competenciesToLoad.push(competencyId);
//                     skillsByCompetencyId[competencyId] = [demonstrationSkill];
//                 }
//             }

//             // load all competencies in the queue
//             for (competencyId in skillsByCompetencyId) {
//                 if (skillsByCompetencyId.hasOwnProperty(competencyId)) {
//                     me.addCompetency(competenciesStore.getById(competencyId), _onCompetencyReady, me, true); // true to insert sorted
//                 }
//             }
//         };

//         // competencies grid must be loaded before restoring saved skills
//         if (competenciesStore.isLoaded()) {
//             _restoreSavedSkills();
//         } else {
//             competenciesStore.on('load', _restoreSavedSkills, me, { single: true });
//         }
//     },

//     onStudentSelect: function(studentCombo, student) {
//         this.getView().setTitle('Submit Evidence' + ((student && student.isModel) ? ' for ' + student.getDisplayName() : ''));
//     },


//     onSubmitClick: function(btn) {
//         var me = this,
//             editWindow = me.getView(),
//             demonstration = editWindow.getDemonstration(),
//             wasPhantom = demonstration.phantom,
//             formPanel = me.lookupReference('form'),
//             studentField = formPanel.getForm().findField('StudentID'),
//             selectedStudent = studentField.getSelectedRecord(),
//             activeSliders = me.lookupReference('competenciesTabPanel').query('[skill]{getLevel()!==null}'),
//             activeSlidersLength = activeSliders.length, activeSliderIndex = 0, activeSlider,
//             skills = [];

//         // compile entered skills into array
//         for (; activeSliderIndex < activeSlidersLength; activeSliderIndex++) {
//             activeSlider = activeSliders[activeSliderIndex];
//             skills.push({
//                 SkillID: activeSlider.skill.getId(),
//                 DemonstratedLevel: activeSlider.getLevel()
//             });
//         }

//         if (!skills.length) {
//             Ext.Msg.alert('Not ready to log demonstration', 'Select a competency level for at least one skill');
//             return;
//         }


//         // persist to server
//         editWindow.setLoading('Submitting demonstration&hellip;');

//         formPanel.updateRecord(demonstration);
//         demonstration.set('Skills', skills);

//         demonstration.save({
//             callback: function(record, operation, success) {
//                 var studentsFieldStore,
//                     tplData;

//                 if (success) {
//                     tplData = {
//                         wasPhantom: wasPhantom,
//                         student: selectedStudent.getData(),
//                         skills: skills
//                     };

//                     Ext.toast(
//                         Ext.XTemplate.getTpl(me, 'toastBodyTpl').apply(tplData),
//                         Ext.XTemplate.getTpl(me, 'toastTitleTpl').apply(tplData)
//                     );

//                     if (wasPhantom && me.lookupReference('loadNextStudentCheck').checked && !editWindow.destroying && !editWindow.destroyed) {
//                         // start a new demonstration
//                         editWindow.setDemonstration({
//                             Class: demonstration.get('Class')
//                         });

//                         studentsFieldStore = studentField.getStore();
//                         studentField.select(studentsFieldStore.getAt(studentsFieldStore.indexOf(selectedStudent) + 1));

//                         editWindow.setLoading(false);
//                     } else {
//                         editWindow.close();
//                     }

//                     Slate.API.fireEvent('demonstrationsave', demonstration);
//                 } else {
//                     editWindow.setLoading(false);
//                     Ext.Msg.show({
//                         title: 'Failed to log demonstration',
//                         message: operation.getError() || 'Please backup your work to another application and report this to your technical support contact',
//                         buttons: Ext.Msg.OK,
//                         icon: Ext.Msg.ERROR
//                     });
//                 }
//             }
//         });
//     },


//     scrollCompetenciesTabsToEnd: function() {
//         var me = this,
//             competenciesTabPanel = me.lookupReference('competenciesTabPanel'),
//             competenciesTabBar = competenciesTabPanel.getTabBar(),
//             _doScroll = function() {
//                 competenciesTabBar.getLayout().overflowHandler.scrollToItem(competenciesTabPanel.items.last().tab);
//             };

//         if (competenciesTabBar.rendered) {
//             setTimeout(_doScroll, 500);
//         } else {
//             competenciesTabBar.on('boxready', _doScroll, me, { single: true });
//         }
//     },

});