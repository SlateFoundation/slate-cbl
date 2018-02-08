Ext.define('SlateDemonstrationsTeacher.controller.Overrides', {
    extend: 'Ext.app.Controller',


    // controller configuration
    views: [
        'Window@Slate.ui',

        'OverrideForm@Slate.cbl.view.demonstrations'
    ],

    stores: [
        'Students'
    ],

    models: [
        'Demonstration@Slate.cbl.model.demonstrations'
    ],


    refs: {
        dashboardCt: 'slate-demonstrations-teacher-dashboard',

        overrideWindow: {
            autoCreate: true,

            xtype: 'slate-window',
            closeAction: 'hide',
            modal: true,
            layout: 'fit',

            mainView: {
                xtype: 'slate-cbl-demonstrations-overrideform'
            }
        }
    },


    // entry points
    control: {
        'slate-demonstrations-teacher-skillfooter button[action=create-override]': {
            click: 'onCreateOverrideClick'
        }
    },


    // event handlers
    onCreateOverrideClick: function(createBtn) {
        var me = this,
            skillPanel = createBtn.up('window').getMainView(),
            skill = skillPanel.getLoadedSkill(),
            demonstration = me.getDemonstrationModel().create({
                Class: 'Slate\\CBL\\Demonstrations\\OverrideDemonstration',
                Demonstrated: new Date(),
                StudentID: skillPanel.getSelectedStudent(),
                Skills: skill && [
                    {
                        SkillID: skill.getId(),
                        Override: true
                    }
                ],
            }),
            overrideWindow = me.getOverrideWindow({
                ownerCmp: me.getDashboardCt()
            }),
            formPanel = overrideWindow.getMainView();

        if (!skill) {
            return;
        }

        formPanel.setStudent(me.getStudentsStore().getById(skillPanel.getSelectedStudent()));
        formPanel.setSkill(skill);
        formPanel.loadRecord(demonstration);

        overrideWindow.animateTarget = createBtn;
        overrideWindow.show();
    }
});