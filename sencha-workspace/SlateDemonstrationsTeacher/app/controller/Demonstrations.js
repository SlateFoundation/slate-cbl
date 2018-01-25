Ext.define('SlateDemonstrationsTeacher.controller.Demonstrations', {
    extend: 'Ext.app.Controller',


    // controller configuration
    views: [
        'Window@Slate.ui',
        'DemonstrationForm@Slate.cbl.view.demonstrations'
    ],


    refs: {
        dashboardCt: 'slate-demonstrations-teacher-dashboard',

        demonstrationWindow: {
            forceCreate: true,

            xtype: 'slate-window',
            defaultType: 'slate-cbl-demonstrations-demonstrationform',
            modal: true,
            minWidth: 300,
            width: 600
        }
    },


    // entry points
    control: {
        'slate-demonstrations-teacher-dashboard slate-appheader button[action=create-demonstration]': {
            click: 'onCreateDemonstrationClick'
        }
    },


    // event handlers
    onCreateDemonstrationClick: function(createBtn) {
        this.getDemonstrationWindow({
            ownerCmp: this.getDashboardCt(),
            autoShow: true,
            animateTarget: createBtn,

            mainView: {
                html: 'form goes here'
                // selectedStudent: context.student,
                // selectedSkill: context.skill,
                // selectedDemonstration: context.demonstrationId
            }
        });
    }
});