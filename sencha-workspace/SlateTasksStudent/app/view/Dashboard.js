/*jslint browser: true, undef: true *//*global Ext*/
/**
 * The application's top level container, to be manually rendered to a
 * specific pre-painted container in the design
 */
Ext.define('SlateTasksStudent.view.Dashboard', {
    extend: 'Ext.container.Container',
    xtype: 'slatetasksstudent-dashboard',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    minHeight: 400,
    style: 'padding: 0 32px 0 0', // prevents right side elements being cut off

    items: [{
        xtype: 'slatetasksstudent-appheader',
        style: 'margin-bottom: 16px'
    },{
        xtype: 'container',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'slatetasksstudent-tasktree',
            minHeight: 200,  // need a minimum height for load mask
            style: 'margin-right: 32px',
            flex: 1
        },{
            xtype: 'slate-todolist',
            flex: 1
        }]
    },{
        xtype: 'slate-taskhistory',
        style: 'margin-top: 32px'
    }]
});
