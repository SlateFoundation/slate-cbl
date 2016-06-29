Ext.define('Slate.cbl.widget.SkillsField', {
    extend: 'Ext.form.FieldContainer',
    requires: [
        'Slate.cbl.store.Skills',
        'Ext.form.field.ComboBox',
        'Ext.view.View'
    ],
    xtype: 'slate-skillsfield',

    componentCls: 'slate-skillsfield',

    fieldLabel: 'Skills',

    items: [
        {
            width: '100%',
            xtype: 'combo',
            store: 'Skills',
            queryParam: 'q',
            displayField: 'Code_Descriptor',
            valueField: 'ID',
            emptyText: 'Competency code or statement\u2026' // &hellip;
        },
        {
            xtype: 'dataview',
            itemId: 'skills-list',
            cls: 'slate-skillsfield-list',
            store: {
                model: 'Slate.cbl.model.Skill'
            },
            autoEl: 'ul',
            itemSelector: '.slate-skillsfield-item',
            tpl: [
                '<tpl for=".">',
                    '<li class="slate-skillsfield-item">',
                        '<div class="slate-skillsfield-token">',
                            '<strong class="slate-skillsfield-item-code">{Code}</strong>',
                            '<span class="slate-skillsfield-item-title" title="{Descriptor}">{Descriptor}</span>',
                            '<i tabindex="0" class="slate-skillsfield-item-remove fa fa-times-circle"></i>',
                        '</div>',
                    '</li>',
                '</tpl>'
            ]
        }
    ]
});