/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.view.teacher.skill.OverviewWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-teacher-skill-overviewwindow',
    requires: [
//        'Slate.cbl.API',
//
//        'Ext.MessageBox',
//        'Ext.window.Toast'
    ],

    config: {
        id: 'slate-cbl-teacher-skill-overviewwindow', // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
        control: {
            '#': {
                beforeshow: 'onBeforeWindowShow',
                demorowclick: 'onDemoRowClick'
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
                demonstrationcreate: 'onDemonstrationCreate'
            }
        }
    },
    
    // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
    applyId: function(id) {
        return Ext.id(null, id);
    },

    onBeforeWindowShow: function(overviewWindow) {
        var me = this,
            competency = overviewWindow.getCompetency(),
            student = overviewWindow.getStudent();

        if (competency) {
            me.lookupReference('competencyCombo').setValue(competency);
        }

        if (student) {
            me.lookupReference('studentCombo').setValue(student);
        }
    },
    
    onCompetencyChange: function(competencyCombo, competency) {
        competency = competency && competencyCombo.findRecordByValue(competency);

        var me = this;
        
        if (!competency) {
            return;
        }

        competency.withSkills(function(skills) {
            var skillsCombo = me.lookupReference('skillCombo'),
                initialValue = me.getView().getSkill();

            skillsCombo.getStore().loadRawData(skills.getRange());
            skillsCombo.enable();
            
            if (!skillsCombo.findRecordByValue(skillsCombo.getValue() || initialValue)) {
                skillsCombo.clearValue();
                skillsCombo.focus();
            } else if (initialValue) {
                skillsCombo.setValue(initialValue);
            }
        });
    },
    
    onSkillChange: function(skillCombo, skill) {
        var me = this;

        skill = skill && skillCombo.findRecordByValue(skill);

        me.lookupReference('skillStatement').update(skill ? skill.get('Statement') : 'Select a competency and skill');

        me.syncDemonstrationsTable();
    },
    
    onStudentChange: function(studentCombo, student) {
        // TODO: update window title

        this.syncDemonstrationsTable();
    },
    
    onDemoRowClick: function(overviewWindow, ev, targetEl) {
        targetEl.next('.skill-grid-demo-detail-row').toggleCls('is-expanded');
        overviewWindow.doLayout();
    },
    
    onOverrideClick: function() {
        alert('Not yet implemented');
    },
    
    onCreateDemonstrationClick: function() {
        this.fireViewEvent('createdemonstrationclick');
    },
    
    onDemonstrationCreate: function(demonstration) {
        var me = this,
            demonstrationSkillIds = Ext.pluck(demonstration.get('skills')||[], 'ID'),
            loadedSkillId = me.lookupReference('skillCombo').getValue();

        if (Ext.Array.contains(demonstrationSkillIds, loadedSkillId)) {
            me.syncDemonstrationsTable();
        }
    },


    // private methods
    syncDemonstrationsTable: function() {
        var me = this,
            demonstrationsTable = me.lookupReference('demonstrationsTable'),
            skillCombo = me.lookupReference('skillCombo'),
            skillId = skillCombo.getValue(),
            skill = skillId && skillCombo.findRecordByValue(skillId),
            studentId = me.lookupReference('studentCombo').getValue();

        if (skill && studentId) {
            demonstrationsTable.setLoading('Loading demonstrations&hellip;'); // currently not visible due to http://www.sencha.com/forum/showthread.php?290453-5.0.x-loadmask-on-component-inside-window-not-visible
            skill.getDemonstrationsByStudent(studentId, function(skillDemonstrations) {
                demonstrationsTable.update(skillDemonstrations);
                demonstrationsTable.setLoading(false);
            });
        } else {
            demonstrationsTable.update('');
        }
    }
});