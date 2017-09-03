Ext.define('SlateDemonstrationsStudent.view.OverviewWindow', {
    extend: 'Slate.cbl.view.standard.AbstractOverviewWindow',
    xtype: 'slate-demonstrations-student-skill-overviewwindow',
    requires: [
        'Ext.form.field.ComboBox',
        'Ext.data.ChainedStore',

        'Slate.cbl.data.Skills',

        'SlateDemonstrationsStudent.view.OverviewWindowController'
    ],


    controller: 'slate-demonstrations-student-skill-overviewwindow',

    config: {
        competency: null
    },

    modal: true,
    shadow: 'frame',
    constrainHeader: true,

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