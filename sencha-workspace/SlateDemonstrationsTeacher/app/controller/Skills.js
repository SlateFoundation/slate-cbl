Ext.define('SlateDemonstrationsTeacher.controller.Skills', {
    extend: 'Ext.app.Controller',


    // controller configuration
    views: [
        'Window@Slate.ui',
        'StudentSkillPanel@Slate.cbl.view.demonstrations',
        'SkillFooter'
    ],

    stores: [
        'StudentCompetencies',
    ],


    refs: {
        dashboardCt: 'slate-demonstrations-teacher-dashboard',

        skillWindow: {
            autoCreate: true,

            xtype: 'slate-window',
            closeAction: 'hide',
            modal: true,
            minWidth: 700,
            width: 700,

            mainView: {
                xtype: 'slate-cbl-demonstrations-studentskillpanel',
                showEditLinks: true
            },

            footer: 'slate-demonstrations-teacher-skillfooter'
        }
    },


    // entry points
    listen: {
        store: {
            '#StudentCompetencies': {
                update: 'onStudentCompetencyUpdate'
            }
        }
    },

    control: {
        'slate-demonstrations-teacher-dashboard slate-demonstrations-teacher-progressgrid': {
            democellclick: 'onDemoCellClick'
        }
    },


    // event handlers
    onDemoCellClick: function(progressGrid, context) {
        var skillWindow = this.getSkillWindow({
                ownerCmp: this.getDashboardCt()
            }),
            skillPanel = skillWindow.getMainView();

        skillPanel.setConfig({
            selectedStudent: context.student,
            selectedSkill: context.skill,
            selectedDemonstration: context.demonstrationId
        });

        skillWindow.animateTarget = context.cellEl;
        skillWindow.show();
    },

    onStudentCompetencyUpdate: function(store, studentCompetency) {
        var skillPanel = this.getSkillWindow().getMainView(),
            loadedCompetency = skillPanel.getLoadedCompetency();

        if (
            loadedCompetency
            && loadedCompetency.getId() == studentCompetency.get('CompetencyID')
            && studentCompetency.get('StudentID') == skillPanel.getSelectedStudent()
        ) {
            skillPanel.loadSkillsIfReady(true);
        }
    }
});