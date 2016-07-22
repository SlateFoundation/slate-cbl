Ext.define('SlateTasksStudent.view.TaskDetails', {
    extend: 'Slate.cbl.view.modals.Modal',
    xtype: 'slate-taskdetails',
    requires: [
        'Slate.cbl.view.AttachmentsList',
        'Slate.cbl.view.modals.ModalForm',
        'Slate.cbl.widget.RatingView'
    ],

    title: 'Task',

    dockedItems: [{
        dock: 'bottom',
        xtype: 'container',
        cls: 'slate-modalfooter',
        items: [{
            xtype: 'container',
            layout: 'hbox',
            items: [{
                xtype: 'tbfill'
            },{
                xtype: 'button',
                text: 'Submit',
                scale: 'large'
            }]
        }]
    }],

    items: [{
        xtype: 'slate-modalform',
        defaultType: 'displayfield',
        items: [
        {
            fieldLabel: 'Student',
            name: 'FullName'
        },
        {
            fieldLabel: 'Title',
            name: 'Title'
        },
        {
            fieldLabel: 'Subtask of',
            name: 'ParentTaskTitle'
        },
        {
            fieldLabel: 'Type of Experience',
            value: 'Workshop'
        },
        {
            fieldLabel: 'Due Date',
            name: 'DueDate',
            renderer: Ext.util.Format.dateRenderer('m/d/y')
        },
        {
            fieldLabel: 'Expiration Date',
            name: 'ExpirationDate',
            renderer: Ext.util.Format.dateRenderer('m/d/y')
        },
        {
            xtype: 'fieldcontainer',
            fieldLabel: 'Attachments',
            items: [{
                xtype: 'slate-attachmentslist',
                editable: false
            }]
        },
        {
            xtype: 'slate-ratingview'
        },
        {
            fieldLabel: 'Submitted Date',
            name: 'SubmittedDate',
            renderer: Ext.util.Format.dateRenderer('m/d/y')
        },
        {
            xtype: 'component',
            itemId: 'comments',
            //TODO: I didn't find a modal example for this comment list, so I made the CSS classnames up.
            tpl: [
                '<tpl if="comments"><div class="slate-task-comment-label">Teacher Comments:</div></tpl>',
                '<ul class="slate-task-comments">',
                    '<tpl for="comments">',
                        '<div class="slate-task-comment-date">{Created:date("M d, Y")}</div>',
                        '<div class="slate-task-comment-text">{Message}</div>',
                    '</tpl>',
                '</ul>'
            ]
        }]
    }]
});
