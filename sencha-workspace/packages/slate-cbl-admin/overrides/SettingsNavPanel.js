Ext.define('Slate.cbl.admin.overrides.SettingsNavPanel', {
    override: 'SlateAdmin.view.settings.NavPanel',

    initComponent: function() {
        var me = this;

        me.data = me.data.concat({
            href: '#settings/cbl/skills',
            text: 'CBL Skills'
        });

        me.callParent(arguments);
    }
});