/**
 * Provides for a panel displaying a student's progress in a given skill
 */
Ext.define('Slate.cbl.view.demonstrations.StudentSkillPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'slate-cbl-demonstrations-studentskillpanel',


    config: {
        selectedStudent: null,
        selectedSkill: null,
        selectedDemonstration: null,
        loadedSkill: null,

        title: 'Standard Overview'
    },


    tpl: 'Showing skill {selectedSkill} for student {selectedStudent}',


    // component lifecycle
    initComponent: function() {
        var me = this;

        me.callParent();

        me.setData({
            selectedSkill: me.getSelectedSkill(),
            selectedStudent: me.getSelectedStudent()
        });
    }
});