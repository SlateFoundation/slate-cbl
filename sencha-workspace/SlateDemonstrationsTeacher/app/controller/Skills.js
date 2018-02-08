Ext.define('SlateDemonstrationsTeacher.controller.Skills', {
    extend: 'Ext.app.Controller',


    // controller configuration
    views: [
        'Window@Slate.ui',
        'StudentSkillPanel@Slate.cbl.view.demonstrations',
        'SkillFooter'
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

        skillWindow.animateTarget = context.targetEl;
        skillWindow.show();
    }
});