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
            text: 'Submit Evidence',
            action: 'create-demonstration'
        }
    ]
});