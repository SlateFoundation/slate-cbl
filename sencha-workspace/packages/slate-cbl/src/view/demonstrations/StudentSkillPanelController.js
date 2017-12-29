/**
 * Controller for {@link Slate.cbl.view.demonstrations.StudentSkillPanel} instances
 */
Ext.define('Slate.cbl.view.demonstrations.StudentSkillPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-demonstrations-studentskillpanel',


    control: {
        '#': {
            selectedstudentchange: 'onSelectedStudentChange',
            selectedskillchange: 'onSelectedSkillChange'
        }
    },


    // component lifecycle
    onSelectedStudentChange: function(view, student) {
        view.getDemonstrationSkillsList().getStore().setStudent(student);
        this.loadSkillsIfReady();
    },

    onSelectedSkillChange: function(view, skill) {
        view.getDemonstrationSkillsList().getStore().setSkill(skill);
        this.loadSkillsIfReady();
    },


    // local methods
    loadSkillsIfReady: function() {
        var store = this.getView().getDemonstrationSkillsList().getStore();

        if (store.getStudent() && store.getSkill()) {
            store.loadIfDirty();
        }
    }
});