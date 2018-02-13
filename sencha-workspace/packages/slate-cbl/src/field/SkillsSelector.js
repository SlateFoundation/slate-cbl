Ext.define('Slate.cbl.field.SkillsSelector', {
    extend: 'Ext.form.field.Tag',
    xtype: 'slate-cbl-skillsselector',
    requires: [
        'Slate.cbl.store.Skills'
    ],


    config: {
        loadSummaries: true,

        fieldLabel: 'Standards',
        labelWidth: 75,

        displayField: 'Code',
        valueField: 'Code',
        stacked: false,
        anyMatch: true,
        queryMode: 'local'
    },


    componentCls: 'slate-cbl-skillsselector',

    // field configuration
    name: 'Skills',

    store: {
        type: 'slate-cbl-skills',
        proxy: 'slate-cbl-skills'
    },

    tipTpl: '{Descriptor}',

    listConfig: {
        cls: 'slate-cbl-skillsselector-list'
    },

    tpl: [
        '<tpl for=".">',
            '<div class="x-boundlist-item">',
                '<small class="code">{Code}</small>',
                '<span class="descriptor">{Descriptor}</span>',
            '</div>',
        '</tpl>',
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