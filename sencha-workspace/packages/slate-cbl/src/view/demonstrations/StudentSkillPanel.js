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
        'Slate.cbl.view.demonstrations.SkillList'
    ],


    config: {
        selectedStudent: null,
        selectedSkill: null,
        selectedDemonstration: null,
        loadedSkill: null,

        demonstrationSkillsList: true,

        title: 'Standard Overview'
    },


    // config handlers
    updateSelectedStudent: function(selectedStudent, oldSelectedStudent) {
        var me = this;

        me.getDemonstrationSkillsList().getStore().setStudent(selectedStudent);
        me.loadSkillsIfReady();

        me.fireEvent('selectedstudentchange', me, selectedStudent, oldSelectedStudent);
    },

    updateSelectedSkill: function(selectedSkill, oldSelectedSkill) {
        var me = this;

        me.getDemonstrationSkillsList().getStore().setSkill(selectedSkill);
        me.loadSkillsIfReady();

        me.fireEvent('selectedskillchange', me, selectedSkill, oldSelectedSkill);
    },

    updateSelectedDemonstration: function(selectedDemonstration, oldSelectedDemonstration) {
        var me = this;

        me.getDemonstrationSkillsList().setHighlightedDemonstration(selectedDemonstration);

        me.fireEvent('selecteddemonstrationchange', me, selectedDemonstration, oldSelectedDemonstration);
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
    initItems: function() {
        var me = this;

        me.callParent();

        me.add([
            me.getDemonstrationSkillsList()
        ]);
    },


    // local methods
    loadSkillsIfReady: function() {
        var store = this.getDemonstrationSkillsList().getStore();

        if (store.getStudent() && store.getSkill()) {
            store.loadIfDirty();
        }
    }
});