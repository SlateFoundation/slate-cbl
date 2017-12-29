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
                '{[this.showTermHeader(values)]}',
                '<div class="x-boundlist-item">{Title}</div>',
            '</tpl>',
            {
                showTermHeader: function(section) {
                    var header = '';

                    if (this.currentTerm !== section.TermID) {
                        header = '<div class="group-header">' + (section.Term ? section.Term.Title : 'Term') + '</div>'
                    }

                    this.currentTerm = section.TermID;
                    return header;
                }
            }
        ]
    },


    componentCls: 'slate-cbl-sectionselector'
});