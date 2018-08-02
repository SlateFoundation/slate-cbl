/**
 * Extend core store to require student + content area be set before loading
 */
Ext.define('SlateDemonstrationsStudent.store.RecentProgress', {
    extend: 'Slate.cbl.store.RecentProgress',


    config: {
        pageSize: 20
    },


    // member methods
    loadIfDirty: function() {
        if (!this.getStudent() || !this.getContentArea()) {
            return;
        }

        this.callParent();
    }
});