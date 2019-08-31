/**
 * Extend core store to require students + content area be set before loading
 */
Ext.define('SlateDemonstrationsTeacher.store.DemonstrationSkills', {
    extend: 'Slate.cbl.store.demonstrations.DemonstrationSkills',


    config: {
        pageSize: 0,
        proxy: {
            type: 'slate-cbl-demonstrationskills',
            extraParams: {
                limit: 0
            }
        }
    },


    // member methods
    loadIfDirty: function() {
        if (!this.getStudentsList() || !this.getContentArea()) {
            return;
        }

        this.callParent();
    }
});