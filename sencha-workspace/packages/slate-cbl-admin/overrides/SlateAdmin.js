Ext.define('Slate.cbl.admin.overrides.SlateAdmin', {
    override: 'SlateAdmin.Application',
    requires: [
        'Slate.cbl.admin.controller.Skills'
    ],

    initControllers: function() {
        this.callParent();
        this.getController('Slate.cbl.admin.controller.Skills');
    }
});