/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.view.teacher.skill.OverviewWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-teacher-skill-overviewwindow',
    config: {
        // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
        id: 'slate-cbl-teacher-skill-overviewwindow',
        control: {
            '#': {
                beforeshow: 'onBeforeWindowShow',
                demorowclick: 'onDemoRowClick',
                demoeditclick: 'onDemoEditClick',
                beforerender: 'onBeforeRender'
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
                demonstrationsave: 'onDemonstrationSave'
            }
        }
    },

    // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
    applyId: function(id) {
        return Ext.id(null, id);
    },

    onBeforeRender: function(overviewWindow) {
        overviewWindow.mon(Ext.GlobalEvents, 'resize', function() {
            overviewWindow.center();
        });

        overviewWindow.mon(Ext.getWin(), 'scroll', function() {
            overviewWindow.center();
        });
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
        var overviewWindow = this.getView();
        overviewWindow.fireEvent('createdemonstrationclick', overviewWindow, overviewWindow.getStudent(), overviewWindow.getCompetency());
    },

    onDemonstrationSave: function(demonstration) {
        var me = this,
            demonstrationSkillIds = Ext.pluck(demonstration.get('Skills')||[], 'SkillID'),
            loadedStudentId = me.lookupReference('studentCombo').getValue(),
            loadedSkillId = me.lookupReference('skillCombo').getValue();

        if (demonstration.get('StudentID') == loadedStudentId && Ext.Array.contains(demonstrationSkillIds, loadedSkillId)) {
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