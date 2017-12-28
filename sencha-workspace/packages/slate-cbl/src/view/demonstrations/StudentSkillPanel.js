/**
 * Provides for a panel displaying a student's progress in a given skill
 *
 * TODO:
 * - [ ] Document configs
 * - [ ] Switch back to Panel parent or rename
 */
Ext.define('Slate.cbl.view.demonstrations.StudentSkillPanel', {
    extend: 'Ext.container.Container',
    xtype: 'slate-cbl-demonstrations-studentskillpanel',
    requires: [
        'Slate.cbl.view.demonstrations.StudentSkillPanelController',
        'Slate.cbl.view.demonstrations.SkillList'
    ],


    controller: 'slate-cbl-demonstrations-studentskillpanel',


    config: {
        selectedStudent: null,
        selectedSkill: null,
        selectedDemonstration: null,
        loadedSkill: null,

        demonstrationSkillsList: true,

        title: 'Standard Overview'
    },


    tpl: 'Showing skill {selectedSkill} for student {selectedStudent}',


    // config handlers
    updateSelectedStudent: function(selectedStudent, oldSelectedStudent) {
        this.fireEvent('selectedsectionchange', this, selectedStudent, oldSelectedStudent);
    },

    applyDemonstrationSkillsList: function(demonstrationSkillsList, oldDemonstrationSkillsList) {
        if (typeof demonstrationSkillsList === 'boolean') {
            demonstrationSkillsList = {
                hidden: !demonstrationSkillsList
            };
        }

        return Ext.factory(demonstrationSkillsList, 'Slate.cbl.view.demonstrations.SkillList', oldDemonstrationSkillsList);
    },


    // component lifecycle
    initComponent: function() {
        var me = this;

        me.callParent();

        me.setData({
            selectedSkill: me.getSelectedSkill(),
            selectedStudent: me.getSelectedStudent()
        });
    },

    initItems: function() {
        var me = this;

        me.callParent();

        me.add([
            me.getDemonstrationSkillsList()
        ]);
    }
});