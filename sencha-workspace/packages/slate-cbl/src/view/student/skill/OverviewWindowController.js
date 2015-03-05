/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.view.student.skill.OverviewWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-student-skill-overviewwindow',
    requires: [
//        'Slate.cbl.API',
//
//        'Ext.MessageBox',
//        'Ext.window.Toast'
        'Slate.cbl.model.Competency',
        'Slate.cbl.model.Skill'
    ],

    config: {
        id: 'slate-cbl-student-skill-overviewwindow', // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
        control: {
            '#': {
                beforeshow: 'onBeforeWindowShow',
                demorowclick: 'onDemoRowClick',
                destroy: 'onDestroy'
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
            student = overviewWindow.getStudent(),
            skillsCombo = me.lookupReference('skillCombo'),
            skillStore = skillsCombo.getStore(),
            skillId = overviewWindow.getSkill();

        if (skillId && competencyId) {

            if(!skillStore.isLoaded()) {
                Slate.cbl.API.getSkills(competencyId, function(response){
                    skillStore.loadRawData(response.data);

                    skillsCombo.setValue(skillStore.findRecord('ID', skillId));
                    me.syncDemonstrationsTable();
                });

            } else {
                me.syncDemonstrationsTable();
            }
        }

        Ext.on('resize', function() {
            overviewWindow.center();
            return true;
        });

        Ext.get(window).on('scroll', function() {
            overviewWindow.center();
            return true;
        });
    },

    onDestroy: function(overviewWindow) {
        Ext.off('resize', overviewWindow.center);
    },

    onDemoRowClick: function(overviewWindow, ev, targetEl) {
        targetEl.next('.skill-grid-demo-detail-row').toggleCls('is-expanded');
        overviewWindow.doLayout();
    },

    onSkillChange: function(skillCombo, skill) {
        this.syncDemonstrationsTable();
    },

    // private methods
    syncDemonstrationsTable: function() {
        var me = this,
            demonstrationsTable = me.lookupReference('demonstrationsTable'),
            skillId = me.lookupReference('skillCombo').getValue(),
            studentId = me.view.getStudent();

        if (skillId && studentId) {
            demonstrationsTable.setLoading('Loading demonstrations&hellip;'); // currently not visible due to http://www.sencha.com/forum/showthread.php?290453-5.0.x-loadmask-on-component-inside-window-not-visible
            Slate.cbl.model.Skill.load(skillId, {
                callback: function(skill) {
                    skill.getDemonstrationsByStudent(studentId, function(skillDemonstrations) {
                        demonstrationsTable.update(skillDemonstrations);
                        demonstrationsTable.setLoading(false);
                    });
                }
            });
        } else {
            demonstrationsTable.update('');
        }
    }
});
