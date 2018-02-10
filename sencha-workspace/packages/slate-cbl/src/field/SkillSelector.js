Ext.define('Slate.cbl.field.SkillSelector', {
    extend: 'Slate.cbl.field.ClearableSelector',
    xtype: 'slate-cbl-skillselector',
    requires: [
        'Slate.cbl.store.Skills'
    ],


    config: {
        loadSummaries: true,

        fieldLabel: 'Standard',
        labelWidth: 75,

        displayField: 'Descriptor',
        valueField: 'Code',
        forceSelection: true,
        editable: false,
        matchFieldWidth: false,
        queryMode: 'local'
    },


    componentCls: 'slate-cbl-skillselector',
    store: {
        type: 'slate-cbl-skills',
        proxy: 'slate-cbl-skills'
    },

    listConfig: {
        cls: 'slate-cbl-skillselector-list'
    },

    tpl: [
        '<tpl for=".">',
            '<div class="x-boundlist-item"><small class="code">{Code}</small> {Descriptor}</div>',
        '</tpl>'
    ],


    // config handlers
    updateLoadSummaries: function(loadSummaries) {
        var store = this.getStore();

        if (store.isStore) {
            store.getProxy().setSummary(loadSummaries);
        }
    },


    // component lifecycle
    initComponent: function() {
        this.callParent(arguments);

        this.getStore().getProxy().setSummary(this.getLoadSummaries());
    }
});