Ext.define('SlateDemonstrationsStudent.controller.Skills', {
    extend: 'Ext.app.Controller',


    // controller configuration
    views: [
        'Window@Slate.ui',
        'StudentSkillPanel@Slate.cbl.view.demonstrations'
    ],

    stores: [
    ],


    refs: {
        dashboardCt: 'slate-demonstrations-student-dashboard',

        skillWindow: {
            forceCreate: true,

            xtype: 'slate-window',
            modal: true,
            defaultType: 'slate-cbl-demonstrations-studentskillpanel',
            width: 500,
            height: 400
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
        var dashboardCt = this.getDashboardCt(),
            skillWindow = this.getSkillWindow({
                ownerCmp: dashboardCt,
                autoShow: true,
                animateTarget: context.targetEl,

                mainView: {
                    selectedStudent: dashboardCt.getSelectedStudent(),
                    selectedSkill: context.skillId,
                    selectedDemonstration: context.demonstrationId
                }
            });

        console.info('Created skillWindow', window.skillWindow = skillWindow);
    }
});