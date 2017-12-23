Ext.define('SlateTasksStudent.view.AppHeader', {
    extend: 'Slate.cbl.view.AppHeader',
    xtype: 'slate-tasks-student-appheader',
    requires: [
        'Slate.cbl.widget.SectionSelector',
        'Ext.toolbar.Fill'
    ],


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
        items: [
            {
                itemId: 'studentSelector',

                xtype: 'combo',
                hidden: true,
                fieldLabel: 'Student',
                store: 'Students',
                displayField: 'SortName',
                valueField: 'Username',
                allowBlank: true,
                forceSelection: true,
                margin: '0 10 0 0',
                queryParam: 'q',
                autoSelect: false,
                matchFieldWidth: false,
                emptyText: 'Me',
                triggers: {
                    clear: {
                        cls: 'x-form-clear-trigger',
                        weight: -2,
                        hidden: true,
                        handler: function(combo) {
                            combo.clearValue();
                            combo.fireEvent('clear', combo);
                        }
                    }
                },
                listeners: {
                    beforequery: function (queryPlan) {
                        if (queryPlan.query.length < 2 && !queryPlan.forceAll) {
                            return false;
                        }

                        queryPlan.query += ' class:student';
                    },
                    change: function(combo, value) {
                        this.getTrigger('clear').setHidden(!value);
                    }
                }
            },
            {
                itemId: 'sectionSelector',

                xtype: 'slate-section-selector',
                disabled: true,
                store: 'Sections',
                valueField: 'Code',
                queryMode: 'local',
                autoSelect: false,
                matchFieldWidth: false,
                emptyText: 'All',
                triggers: {
                    clear: {
                        cls: 'x-form-clear-trigger',
                        weight: -2,
                        hidden: true,
                        handler: function(combo) {
                            combo.clearValue();
                            combo.fireEvent('clear', combo);
                        }
                    }
                },
                listeners: {
                    change: function(combo, value) {
                        this.getTrigger('clear').setHidden(!value);
                    }
                }
            }
        // {
        //     xtype: 'tbfill'
        // @todo Unide recent activity toggle once the RecentActivity.js
        // view is populated with real data.
        // },
        // {
        //     xtype: 'button',
        //     iconCls: 'x-fa fa-clock-o',
        //     enableToggle: true,
        //     action: 'show-recent'
        // }
        ]
    }]

});
