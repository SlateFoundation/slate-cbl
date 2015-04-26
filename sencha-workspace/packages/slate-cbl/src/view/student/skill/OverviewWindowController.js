/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.view.student.skill.OverviewWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-student-skill-overviewwindow',
    requires: [
        'Slate.cbl.model.Competency',
        'Slate.cbl.model.Skill'
    ],

    config: {
        id: 'slate-cbl-student-skill-overviewwindow', // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
        control: {
            '#': {
                beforeshow: 'onBeforeWindowShow'
            },
            'combobox[reference=skillCombo]': {
                change: 'onSkillChange'
            }
        }
    },

    // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
    applyId: function(id) {
        return Ext.id(null, id);
    },

    onBeforeWindowShow: function(overviewWindow) {
        var me = this,
            competencyId = overviewWindow.getCompetency(),
            skillsCombo = me.lookupReference('skillCombo'),
            skillStore = skillsCombo.getStore();

        if (!competencyId || skillStore.isLoaded()) {
            return;
        }

        Slate.cbl.API.getSkills(competencyId, function(response){
            skillStore.loadRawData(response.data);

            skillsCombo.setValue(skillStore.findRecord('ID', overviewWindow.getSkill()));
        });
    },

    onSkillChange: function(skillCombo, skill) {
        skill = skill && skillCombo.findRecordByValue(skill);

        if (skill) {
            this.lookupReference('skillStatement').update(skill.get('Statement'));
        }

        this.getView().setSkill(skill ? skill.getId() : null);
    }
});
