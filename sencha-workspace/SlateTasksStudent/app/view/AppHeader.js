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
            xtype: 'combo',
            itemId: 'student-selector',
            name: 'StudentSelector',
            fieldLabel: 'Student',
            valueField: 'Username',
            hidden: true,
            allowBlank: true,
            queryParam: 'q',
            margin: '0 10 0 0',
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                    '{FirstName} {LastName}',
                '</tpl>'
            ),
            tpl: Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                    '<li role="option" class="x-boundlist-item">{FirstName} {LastName}</li>',
                '</tpl></ul>'
            ),
            store: {
                fields: ['Username'],
                proxy: {
                    type: 'slate-records',
                    url: '/people'
                }
            },
            listeners: {
                beforequery: function (qe) {
                    if (!qe) {
                        return false;
                    }

                    qe.query += ' class:student';
                }
            }
        },
        {
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
