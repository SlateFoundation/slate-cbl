/**
 * Controller for {@link Slate.cbl.view.demonstrations.StudentSkillPanel} instances
 */
Ext.define('Slate.cbl.view.demonstrations.StudentSkillPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-demonstrations-studentskillpanel',


    control: {
        '#': {
            boxready: 'onBoxReady'
        }
    },


    // component lifecycle
    onBoxReady: function(studentSkillPanel) {
        // TODO: do after params are configured, maybe from view
        studentSkillPanel.getDemonstrationSkillsList().getStore().load();
    }
});