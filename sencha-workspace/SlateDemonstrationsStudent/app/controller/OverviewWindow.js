Ext.define('SlateDemonstrationsStudent.controller.OverviewWindow', {
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
        var competencyId = overviewWindow.getCompetency(),
            skillsCombo = this.lookupReference('skillCombo'),
            skillsComboStore = skillsCombo.getStore();

        skillsComboStore.getSource().getAllByCompetency(competencyId, function() {
            skillsComboStore.setFilters({
                property: 'CompetencyID',
                value: competencyId
            });

            skillsCombo.setValue(overviewWindow.getSkill());
            skillsCombo.enable();
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
