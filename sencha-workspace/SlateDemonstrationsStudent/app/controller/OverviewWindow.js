Ext.define('SlateDemonstrationsStudent.controller.OverviewWindow', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.cbl.model.Competency',
        'Slate.cbl.model.Skill'
    ],
    
    
    config: {
    },
    
    control: {
        overviewWindow: {
            beforeshow: 'onBeforeWindowShow'
        },
        skillCombo: {
            change: 'onSkillChange'
        }
    },
    
    
    // controller configuration
    views: [
      'SlateDemonstrationsStudent.view.OverviewWindow'  
    ],
    
    refs: {
        overviewWindow: 'slate-demonstrations-student-skill-overviewwindow',
        skillCombo: 'combobox[reference=skillCombo]'
    },


    // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
    applyId: function(id) {
        return Ext.id(null, id);
    },

    onBeforeWindowShow: function(overviewWindow) {
        var competencyId = overviewWindow.getCompetency(),
            skillsCombo = this.getSkillCombo(),
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
            Ext.ComponentQuery.query('[reference=skillStatement]')[0].update(skill.get('Statement'));
        }

        this.getOverviewWindow().setSkill(skill ? skill.getId() : null);
    }
});
