/**
 * TODO:
 * - Move general tagfield enhancements to a base class
 */
Ext.define('Slate.cbl.field.SkillsSelector', {
    extend: 'Ext.form.field.Tag',
    xtype: 'slate-cbl-skillsselector',
    requires: [
        'Slate.cbl.store.Skills'
    ],


    config: {
        permanentValues: null,
        showPermanentTags: true,
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
                    '<tpl if="parent.$comp.isSelected(values)">',
                        ' {parent.tagSelectedCls}',
                    '</tpl>',
                    '<tpl if="parent.$comp.isDeselectable(values)">',
                        ' {parent.tagItemDeselectableCls}',
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

    tipTpl: '{Descriptor}',

    tagItemDeselectableCls: Ext.baseCSSPrefix + 'tagfield-item-deselectable',


    // component configuration
    componentCls: 'slate-cbl-skillsselector',


    // field configuration
    name: 'Skills',

    store: {
        type: 'slate-cbl-skills',
        proxy: 'slate-cbl-skills'
    },

    listConfig: {
        cls: 'slate-cbl-skillsselector-list',
        prepareData: function(data, index, record) {
            data = Ext.Object.chain(data);
            data.$isDeselectable = this.ownerCmp.isDeselectable(record);
            return data;
        }
    },

    tpl: [
        '<tpl for=".">',
            '<div class="x-boundlist-item <tpl if="$isDeselectable">x-boundlist-deselectable</tpl>">',
                '<small class="code">{Code}</small>',
                '<span class="descriptor">{Descriptor}</span>',
            '</div>',
        '</tpl>',
    ],


    // config handlers
    updatePermanentValues: function(permanentValues, oldPermanentValues) {
        var values = this.getValue();

        if (oldPermanentValues) {
            values = Ext.Array.difference(values, permanentValues && permanentValues.length ? Ext.Array.difference(oldPermanentValues, permanentValues) : oldPermanentValues);
        }

        if (permanentValues) {
            values = Ext.Array.union(permanentValues, values);
        }

        this.setValue(values);
    },

    updateShowPermanentTags: function(showPermanentTags) {
        this.toggleCls('slate-cbl-skillsselector-hidepermanent', !showPermanentTags);
    },

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
    setValue: function(value) {
        var permanentValues = this.getPermanentValues();

        if (permanentValues && permanentValues.length) {
            value = Ext.Array.union(permanentValues, value);
        }

        return this.callParent([value]);
    },

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
            tagItemDeselectableCls: me.tagItemDeselectableCls,

            items: me.valueCollection.getRange()
        });
    },

    isSelected: function(record) {
        return this.selectionModel.isSelected(record);
    },

    isDeselectable: function(record) {
        var permanentValues = this.getPermanentValues();

        return !permanentValues || permanentValues.indexOf(record.get(this.getValueField())) == -1;
    },

    onBeforeDeselect: function(list, record) {
        if (!this.isDeselectable(record)) {
            return false;
        }

        return this.callParent(arguments);
    },

    toggleSelectionByListItemNode: function(itemEl, keepExisting) {
        var me = this,
            record = me.getRecordByListItemNode(itemEl),
            selModel = me.selectionModel;

        if (record && me.isDeselectable(record)) {
            if (selModel.isSelected(record)) {
                selModel.deselect(record);
            } else {
                selModel.select(record, keepExisting);
            }
        }
    }
});