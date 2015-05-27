/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.view.teacher.skill.OverviewWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-teacher-skill-overviewwindow',
    config: {
        // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
        id: 'slate-cbl-teacher-skill-overviewwindow',
        control: {
            '#': {
                beforeshow: 'onBeforeWindowShow'
            },
            'combobox[reference=competencyCombo]': {
                change: 'onCompetencyChange'
            },
            'combobox[reference=skillCombo]': {
                change: 'onSkillChange'
            },
            'combobox[reference=studentCombo]': {
                change: 'onStudentChange'
            },
            'button[action=override]': {
                click: 'onOverrideClick'
            },
            'button[action=demonstration-create]': {
                click: 'onCreateDemonstrationClick'
            }
        },

        listen: {
            api: {
                demonstrationsave: 'onDemonstrationSave',
                demonstrationdelete: 'onDemonstrationDelete'
            }
        }
    },

    // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
    applyId: function(id) {
        return Ext.id(null, id);
    },
    
    init: function(overviewWindow) {
        this.lookupReference('competencyCombo').getStore().setSource(overviewWindow.getCompetenciesStore());
        this.lookupReference('studentCombo').getStore().setSource(overviewWindow.getStudentsStore());
    },

    onBeforeWindowShow: function(overviewWindow) {
        this.lookupReference('competencyCombo').setValue(overviewWindow.getCompetency());
        this.lookupReference('studentCombo').setValue(overviewWindow.getStudent());
    },

    onCompetencyChange: function(competencyCombo, competency) {
        competency = competency && competencyCombo.findRecordByValue(competency);

        var me = this,
            overviewWindow = me.getView(),
            skillsCombo = me.lookupReference('skillCombo'),
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

        this.getView().setSkill(skill ? skill.getId() : null);
    },

    onStudentChange: function(studentCombo, student) {
        this.getView().setStudent(student);
    },

    onOverrideClick: function() {
        alert('Not yet implemented');
    },

    onCreateDemonstrationClick: function() {
        var me = this,
            overviewWindow = me.getView();

        overviewWindow.fireEvent('createdemonstrationclick', overviewWindow, me.lookupReference('studentCombo').getValue(), me.lookupReference('competencyCombo').getValue());
    },

    onDemonstrationSave: function(demonstration) {
        var overviewWindow = this.getView(),
            demonstrationSkillIds = Ext.pluck(demonstration.get('Skills')||[], 'SkillID');

        if (demonstration.get('StudentID') == overviewWindow.getStudent() && Ext.Array.contains(demonstrationSkillIds, overviewWindow.getSkill())) {
            overviewWindow.loadDemonstrationsTable(true);
        }
    },
    
    onDemonstrationDelete: function(demonstration) {
        var overviewWindow = this.getView(),
            demoSkillsStore = overviewWindow.getDemonstrationSkillsStore();

        if (demonstration.get('StudentID') == overviewWindow.getStudent()) {
            demoSkillsStore.remove(demoSkillsStore.query('DemonstrationID', demonstration.getId()).getRange());
        }
        
    }
});