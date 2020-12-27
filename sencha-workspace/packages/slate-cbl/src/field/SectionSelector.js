Ext.define('Slate.cbl.field.SectionSelector', {
    extend: 'Slate.cbl.field.ClearableSelector',
    xtype: 'slate-cbl-sectionselector',


    config: {
        fieldLabel: 'Course Section',
        labelWidth: 120,

        displayField: 'recordTitle',
        valueField: 'Code',
        forceSelection: true,
        editable: false,
        autoSelect: false,
        matchFieldWidth: false
    },


    componentCls: 'slate-cbl-sectionselector',

    listConfig: {
        cls: 'slate-cbl-sectionselector-list',
        maxWidth: 512,
        minWidth: 256
    },

    tpl: [
        '{% this.currentTerm = null %}',
        '<tpl for=".">',
            '<tpl if="values.TermID != this.currentTerm">',
                '{% this.currentTerm = values.TermID %}',
                '<div class="group-header">',
                    '<tpl if="Term">',
                        '{Term.Title:htmlEncode}',
                    '<tpl else>',
                        'Term',
                    '</tpl>',
                '</div>',
            '</tpl>',

            '<div class="x-boundlist-item"><small class="code">{Code}</small> {recordTitle}</div>',
        '</tpl>'
    ]
});