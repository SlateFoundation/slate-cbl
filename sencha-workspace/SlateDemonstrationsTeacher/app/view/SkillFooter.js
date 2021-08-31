Ext.define('SlateDemonstrationsTeacher.view.SkillFooter', {
    extend: 'Slate.ui.PanelFooter',
    xtype: 'slate-demonstrations-teacher-skillfooter',
    requires: [
        'Ext.toolbar.Fill'
    ],


    items: [
        {
            xtype: 'button',
            text: 'Override',
            action: 'create-override'
        },
        {
            xtype: 'tbfill'
        },
        {
            xtype: 'button',
            glyph: 0xf055, // fa-plus-circle
            text: 'Submit Evidence',
            action: 'create-demonstration'
        }
    ]
});
