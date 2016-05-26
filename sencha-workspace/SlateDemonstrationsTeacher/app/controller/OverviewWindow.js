/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('SlateDemonstrationsTeacher.controller.OverviewWindow', {
    extend: 'Ext.app.Controller',
    requires: [
        'Jarvus.util.APIDomain'
    ],
    
    
    config: {
    },
    
    
    // entry points
    listen: {
        api: {
            demonstrationsave: 'onDemonstrationSave',
            demonstrationdelete: 'onDemonstrationDelete'
        }
    },
    
    control: {
        overviewWindow: {
            beforeshow: 'onBeforeWindowShow'
        },
        competencyCombo: {
            change: 'onCompetencyChange'
        },
        skillCombo: {
            change: 'onSkillChange'
        },
        studentCombo: {
            change: 'onStudentChange'
        },
        overrideBtn: {
            click: 'onOverrideClick'
        },
        createDemonstrationBtn: {
            click: 'onCreateDemonstrationClick'
        }
    },
    
    
    // controller configuration
    views: [
      'SlateDemonstrationsTeacher.view.OverviewWindow'  
    ],
    
    refs: {
        overviewWindow: 'slate-demonstrations-teacher-skill-overviewwindow',
        
        competencyCombo: 'combobox[reference=competencyCombo]',
        studentCombo: 'combobox[reference=studentCombo]',
        skillCombo: 'combobox[reference=skillCombo]',
        overrideBtn: 'button[action=override]',
        createDemonstrationBtn: 'button[action=demonstration-create]'
    },


    // // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
    applyId: function(id) {
        return Ext.id(null, id);
    },

    onBeforeWindowShow: function(overviewWindow) {
        var me = this,
            competencyCombo = this.getCompetencyCombo(),
            studentCombo = this.getStudentCombo();
            
        competencyCombo.setValue(overviewWindow.getCompetency());
        studentCombo.setValue(overviewWindow.getStudent());
    },

    onCompetencyChange: function(competencyCombo, competency) {
        competency = competency && competencyCombo.findRecordByValue(competency);

        var me = this,
            overviewWindow = me.getOverviewWindow(),
            skillsCombo = this.getSkillCombo(),
            skillsComboStore = skillsCombo.getStore(),
            initialValue = overviewWindow.getSkill();

        if (!competency) {
            return;
        }

        skillsCombo.disable();

        skillsComboStore.getSource().getAllByCompetency(competency, function() {
            skillsComboStore.setFilters({
                property: 'CompetencyID',
                value: competency.getId()
            });

            skillsCombo.enable();

            if (!skillsCombo.findRecordByValue(skillsCombo.getValue() || initialValue)) {
                overviewWindow.setSkill(null);
                skillsCombo.clearValue();
                skillsCombo.expand();
                skillsCombo.focus();
            } else if (initialValue) {
                skillsCombo.setValue(initialValue);
            }
        });
    },

    onSkillChange: function(skillCombo, skill) {
        skill = skill && skillCombo.findRecordByValue(skill);

        if (skill) {
            this.lookupReference('skillStatement').update(skill.get('Statement'));
        }

        this.getOverviewWindow().setSkill(skill ? skill.getId() : null);
    },

    onStudentChange: function(studentCombo, student) {
        this.getOverviewWindow().setStudent(student);
    },

    onOverrideClick: function() {
        var me = this,
            overviewWindow = me.getOverviewWindow(),
            studentCombo = me.getStudentCombo(),
            skillCombo = me.getSkillCombo();

        overviewWindow.fireEvent('createoverrideclick', overviewWindow, studentCombo.getValue(), skillCombo.getValue());
    },

    onCreateDemonstrationClick: function() {
        var me = this,
            overviewWindow = me.getOverviewWindow(),
            studentCombo = me.getStudentCombo(),
            competencyCombo = me.getCompetencyCombo();

        overviewWindow.fireEvent('createdemonstrationclick', overviewWindow, studentCombo.getValue(), competencyCombo.getValue());
    },

    onDemonstrationSave: function(demonstration) {
        var overviewWindow = this.getOverviewWindow(),
            demonstrationSkillIds = Ext.pluck(demonstration.get('Skills')||[], 'SkillID');

        if (demonstration.get('StudentID') == overviewWindow.getStudent() && Ext.Array.contains(demonstrationSkillIds, overviewWindow.getSkill())) {
            overviewWindow.loadDemonstrationsTable(true);
        }
    },
    
    onDemonstrationDelete: function(demonstration) {
        var overviewWindow = this.getOverviewWindow(),
            demoSkillsStore = overviewWindow.getDemonstrationSkillsStore();

        if (demonstration.get('StudentID') == overviewWindow.getStudent()) {
            demoSkillsStore.remove(demoSkillsStore.query('DemonstrationID', demonstration.getId()).getRange());
        }
        
    }
});