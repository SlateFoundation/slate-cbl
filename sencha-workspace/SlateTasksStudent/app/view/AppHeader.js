Ext.define('SlateTasksStudent.view.AppHeader', {
    extend: 'Slate.cbl.view.AppHeader',
    requires: [
        'SlateTasksStudent.store.CourseSections',
        'Slate.cbl.widget.SectionSelector',
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
            xtype: 'slate-section-selector',
            itemId: 'section-selector',
            queryMode: 'local',
            store: { xclass: 'SlateTasksStudent.store.CourseSections' }
        },
        {
            xtype: 'tbfill'

        // @todo Unide recent activity toggle once the RecentActivity.js
        // view is populated with real data.
        // },
        // {
        //     xtype: 'button',
        //     iconCls: 'x-fa fa-clock-o',
        //     enableToggle: true,
        //     action: 'show-recent'
        }]
    }]

});
