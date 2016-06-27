Ext.define('Slate.cbl.widget.SkillsField', {
    extend: 'Ext.form.FieldContainer',
    xtype: 'slate-skillsfield',

    componentCls: 'slate-skillsfield',

    fieldLabel: 'Skills',
    items: [
        {
            width: '100%',
            xtype: 'combo',
            emptyText: 'Competency code or statement\u2026' // &hellip;
        },
        {
            xtype: 'dataview',
            cls: 'slate-skillsfield-list',
            fields: [ 'code', 'title' ],
            data: [
                { code: 'ELA.2.HS.1', title: 'Cite evidence' },
                { code: 'ELA.2.HS.3', title: 'Analyze developments' },
                { code: 'ELA.2.HS.4', title: 'Long title goes here to test potential overflow situations' }
            ],
            autoEl: 'ul',
            itemSelector: '.slate-skillsfield-item',
            tpl: [
                '<tpl for=".">',
                    '<li class="slate-skillsfield-item">',
                        '<div class="slate-skillsfield-token">',
                            '<strong class="slate-skillsfield-item-code">{code}</strong>',
                            '<span class="slate-skillsfield-item-title" title="{title}">{title}</span>',
                            '<i tabindex="0" class="slate-skillsfield-item-remove fa fa-times-circle"></i>',
                        '</div>',
                    '</li>',
                '</tpl>'
            ]
        }
    ]
});