Ext.define('Slate.cbl.field.CompetencySelector', {
    extend: 'Slate.cbl.field.ClearableSelector',
    xtype: 'slate-cbl-competencyselector',
    requires: [
        'Slate.cbl.store.Skills'
    ],


    config: {
        loadSummaries: true,

        fieldLabel: 'Competency',
        labelWidth: 100,

        displayField: 'Descriptor',
        valueField: 'Code',
        forceSelection: true,
        editable: false,
        matchFieldWidth: false,
        queryMode: 'local'
    },


    componentCls: 'slate-cbl-competencyselector',
    store: {
        type: 'slate-cbl-competencies',
        proxy: 'slate-cbl-competencies'
    },

    listConfig: {
        cls: 'slate-cbl-competencyselector-list'
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