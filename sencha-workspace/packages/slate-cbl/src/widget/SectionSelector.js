Ext.define('Slate.cbl.widget.SectionSelector', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'slate-section-selector',
    componentCls: 'slate-section-selector',

    fieldLabel: 'Course Section',
    labelWidth: 120,

    displayField: 'Title',
    valueField: 'ID',

    forceSelection: true,
    editable: false,

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
})