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


    multiSelectItemTpl: [
        '<tpl for="items">',
            '<li',
                ' data-selectionIndex="{[xindex - 1]}"',
                ' data-recordId="{internalId}"',
                ' role="presentation"',
                ' class="',
                    ' {parent.tagItemCls}',
                    ' {parent.childElCls}',
                    '<tpl if="parent.$comp.selectionModel.isSelected(values)">',
                        ' {parent.tagSelectedCls}',
                    '</tpl>',
                '"',
                ' data-qtip="{[fm.htmlEncode(parent.tipTpl.apply(values.data))]}"',
            '>',
                '<div role="presentation" class="{parent.tagItemTextCls}">',
                    '{[fm.htmlEncode(parent.labelTpl.apply(values.data))]}',
                '</div>',
                '<div role="presentation" class="{parent.tagItemCloseCls} {parent.childElCls}"></div>',
            '</li>',
        '</tpl>',
    ],


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
    },


    // tagfield lifecycle
    getMultiSelectItemMarkup: function() {
        var me = this,
            childElCls = me._getChildElCls && me._getChildElCls() || ''; // hook for rtl cls

        if (!me.labelTpl) {
            me.labelTpl = '{' + me.displayField + '}';
        }

        return me.lookupTpl('multiSelectItemTpl').apply({
            $comp: me,
            labelTpl: me.lookupTpl('labelTpl'),
            tipTpl: me.lookupTpl('tipTpl'),

            childElCls: childElCls,
            tagItemCls: me.tagItemCls,
            tagSelectedCls: me.tagSelectedCls,
            tagItemTextCls: me.tagItemTextCls,
            tagItemCloseCls: me.tagItemCloseCls,

            items: me.valueCollection.getRange()
        });
    }
});