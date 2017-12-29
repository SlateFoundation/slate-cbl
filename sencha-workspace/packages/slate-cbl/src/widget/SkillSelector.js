Ext.define('Slate.cbl.widget.SkillSelector', {
    extend: 'Slate.cbl.widget.ClearableSelector',
    xtype: 'slate-cbl-skillselector',
    requires: [
        'Slate.cbl.store.Skills'
    ],


    config: {
        fieldLabel: 'Standard',
        labelWidth: 75,

        displayField: 'Descriptor',
        valueField: 'Code',
        forceSelection: true,
        editable: false,
        matchFieldWidth: false,
        queryMode: 'local',

        tpl: [
            '<tpl for=".">',
                '<div class="x-boundlist-item"><small style="float:right">{Code}</small> {Descriptor}</div>',
            '</tpl>'
        ]
    },


    componentCls: 'slate-cbl-skillselector',
    store: {
        type: 'slate-cbl-skills',
        proxy: {
            type: 'slate-cbl-skills',
            summary: true
        }
    }
});