Ext.define('SlateDemonstrationsStudent.controller.Skills', {
    extend: 'Ext.app.Controller',


    // controller configuration
    views: [
        'Window@Slate.ui',
        'StudentSkillPanel@Slate.cbl.view.demonstrations'
    ],


    refs: {
        dashboardCt: 'slate-demonstrations-student-dashboard',

        // TODO: update to reuse workflow
        skillWindow: {
            forceCreate: true,

            xtype: 'slate-window',
            defaultType: 'slate-cbl-demonstrations-studentskillpanel',
            modal: true,
            minWidth: 700,
            width: 700
        }
    },


    // entry points
    control: {
        'slate-demonstrations-student-competencycard': {
            democellclick: 'onDemoCellClick'
        }
    },


    // event handlers
    onDemoCellClick: function(competencyCard, context) {
        var dashboardCt = this.getDashboardCt();

        this.getSkillWindow({
            ownerCmp: dashboardCt,
            autoShow: true,
            animateTarget: context.targetEl,

            mainView: {
                selectedStudent: dashboardCt.getSelectedStudent(),
                selectedSkill: context.skill,
                selectedDemonstration: context.demonstration
            }
        });
    }
});