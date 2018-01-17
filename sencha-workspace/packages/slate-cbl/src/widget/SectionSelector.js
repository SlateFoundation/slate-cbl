Ext.define('Slate.cbl.widget.SectionSelector', {
    extend: 'Slate.cbl.widget.ClearableSelector',
    xtype: 'slate-cbl-sectionselector',


    config: {
        fieldLabel: 'Course Section',
        labelWidth: 120,

        displayField: 'Title',
        valueField: 'Code',
        forceSelection: true,
        editable: false,
        autoSelect: false,
        matchFieldWidth: false,
        listConfig: {
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

                '<div class="x-boundlist-item">{Title}</div>',
            '</tpl>'
        ]
    },


    componentCls: 'slate-cbl-sectionselector'
});