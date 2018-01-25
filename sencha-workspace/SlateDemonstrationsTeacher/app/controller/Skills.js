Ext.define('SlateDemonstrationsTeacher.controller.Skills', {
    extend: 'Ext.app.Controller',


    // controller configuration
    views: [
        'Window@Slate.ui',
        'StudentSkillPanel@Slate.cbl.view.demonstrations'
    ],


    refs: {
        progressGrid: 'slate-demonstrations-teacher-dashboard slate-demonstrations-teacher-progressgrid',

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
        progressGrid: {
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
            ownerCmp: progressGrid,
            autoShow: true,
            animateTarget: context.targetEl,

            mainView: {
                selectedStudent: context.student,
                selectedSkill: context.skill,
                selectedDemonstration: context.demonstrationId
            }
        });
    }
});