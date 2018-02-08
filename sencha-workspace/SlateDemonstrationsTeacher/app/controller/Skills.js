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
            forceCreate: true,

            xtype: 'slate-window',
            defaultType: 'slate-cbl-demonstrations-studentskillpanel',
            modal: true,
            minWidth: 700,
            width: 700,
            footer: 'slate-demonstrations-teacher-skillfooter'
        }
    },


    // entry points
    control: {
        'slate-demonstrations-teacher-dashboard slate-demonstrations-teacher-progressgrid': {
            democellclick: 'onDemoCellClick'
        }
        // 'slate-demonstrations-teacher-skill-overviewwindow': {
        //     createdemonstrationclick: 'onOverviewCreateDemonstrationClick',
        //     editdemonstrationclick: 'onOverviewEditDemonstrationClick',
        //     deletedemonstrationclick: 'onOverviewDeleteDemonstrationClick',
        //     createoverrideclick: 'onOverviewCreateOverrideClick'
        // },
    },


    // event handlers
    onDemoCellClick: function(progressGrid, context) {
        this.getSkillWindow({
            ownerCmp: this.getDashboardCt(),
            autoShow: true,
            animateTarget: context.targetEl,

            mainView: {
                showEditLinks: true,

                selectedStudent: context.student,
                selectedSkill: context.skill,
                selectedDemonstration: context.demonstrationId
            }
        });
    }
});