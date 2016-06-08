Ext.define('SlateDemonstrationsStudent.view.OverviewWindow', {
    extend: 'Slate.cbl.view.standard.AbstractOverviewWindow',
    xtype: 'slate-demonstrations-student-skill-overviewwindow',
    requires: [
        'SlateDemonstrationsStudent.view.OverviewWindowController',
        'Slate.cbl.data.Skills',

        'Ext.form.field.ComboBox',
        'Ext.data.ChainedStore'
    ],

    controller: 'slate-demonstrations-student-skill-overviewwindow',


    config: {
        competency: null
    },

    modal: true,
    fixed: true,
    shadow: 'frame',

    dockedItems: [
        {
            dock: 'top',

            xtype: 'toolbar',
            items: [
                'Standard:',
                {
                    reference: 'skillCombo',
                    flex: 1,

                    xtype: 'combobox',
                    disabled: true,

                    store: {
                        type: 'chained',
                        source: 'cbl-skills'
                    },
                    queryMode: 'local',
                    displayField: 'Descriptor',
                    valueField: 'ID',

                    forceSelection: true
                }
            ]
        }
    ]
});