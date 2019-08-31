Ext.define('Slate.cbl.field.StudentsListSelector', {
    extend: 'Slate.cbl.field.ClearableSelector',
    xtype: 'slate-cbl-studentslistselector',
    requires: [
        'Slate.proxy.API'
    ],


    config: {
        fieldLabel: 'Students',
        labelWidth: 70,

        displayField: 'label',
        valueField: 'value',
        queryMode: 'local',
        anyMatch: true,
        forceSelection: true,
        autoSelect: true,
        matchFieldWidth: false
    },


    componentCls: 'slate-cbl-studentslistselector',
    store: {
        fields: [
            'group',
            'groupLabel',
            'label',
            'value'
        ],
        pageSize: 0,
        remoteSort: true,
        proxy: {
            type: 'slate-api',
            url: '/people/*student-lists',
            reader: {
                type: 'json',
                rootProperty: 'data',
                keepRawData: true
            }
        }
    },

    listConfig: {
        cls: 'slate-cbl-studentslistselector-picker',
        collectData: function() {
            var rawData = this.pickerField.getStore().getProxy().getReader().rawData || {};

            return {
                records: this.superclass.collectData.apply(this, arguments),
                groupOptions: rawData.groupOptions || {}
            };
        }
    },

    tpl: [
        '{% this.currentGroup = null %}',
        '<tpl for="records">',
            '<tpl if="values.groupId != this.currentGroup">',
                '{% this.currentGroup = values.groupId %}',
                '<div class="group-header">',
                    '{groupLabel:htmlEncode}',
                    '<tpl for="parent.groupOptions[values.groupId]">',
                        '<button data-query="{[ fm.htmlEncode(Ext.Object.toQueryString(values.query)) ]}">',
                            '{label:htmlEncode}',
                        '</button>',
                    '</tpl>',
                '</div>',
            '</tpl>',

            '<div class="x-boundlist-item">{label}</div>',
        '</tpl>'
    ],


    // combo lifecycle
    createPicker: function() {
        var picker = this.callParent(arguments);

        picker.on('click', 'onGroupButtonClick', this, { element: 'el', delegate: 'button' });

        return picker;
    },


    // event handlers
    onGroupButtonClick: function(ev, t) {
        var query = Ext.fly(t).getAttribute('data-query'),
            store = this.getStore();

        if (!query) {
            return;
        }

        store.getProxy().setExtraParams(Ext.Object.fromQueryString(query));
        store.load();
    }
});