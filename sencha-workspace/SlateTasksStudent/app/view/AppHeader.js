Ext.define('SlateTasksStudent.view.AppHeader', {
    extend: 'Slate.cbl.view.AppHeader',
    requires: [
        'SlateTasksStudent.store.CourseSections',
        'Ext.toolbar.Fill'
    ],
    xtype: 'slatetasksstudent-appheader',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'container',
        layout: {
            type: 'hbox',
            align: 'center'
        },
        items: [{
            xtype: 'combobox',
            itemId: 'section-selector',
            cls: 'slate-course-selector',

            fieldLabel: 'Course Section',
            labelWidth: 120,

            store: { xclass: 'SlateTasksStudent.store.CourseSections' },

            displayField: 'Title',
            valueField: 'ID',

            forceSelection: true,
            queryMode: 'local',
            editable: false,

            tpl: [
                '{% this.currentTerm = null %}',
                '<tpl for=".">',
                    '{[this.showTermHeader(values)]}',
                    '<div class="x-boundlist-item">&nbsp;&nbsp;{Title}</div>',
                '</tpl>',
                {
                    showTermHeader: function(section) {
                        var header = '';

                        if (this.currentTerm !== section.TermID) {
                            header = '<div class="group-header">'+section.Term ? section.Term.Title : 'Term' +'</div>'
                        }

                        this.currentTerm = section.TermID;
                        return header;
                    }
                }
            ]
        },
        {
            xtype: 'tbfill'
        },
        {
            xtype: 'button',
            iconCls: 'x-fa fa-clock-o',
            enableToggle: true,
            action: 'show-recent'
        }]
    }]

});
