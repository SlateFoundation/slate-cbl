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
            fieldLabel: 'Submitted Date',
            name: 'Submitted',
            renderer: Ext.util.Format.dateRenderer('m/d/y')
        },
        {
            xtype: 'slate-ratingview'
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
            xtype: 'component',
            itemId: 'comments',
            tpl: [
                '<tpl if="comments.length &gt; 0">',
                    '<div class="slate-task-comments-ct">',
                        '<h4 class="slate-task-comments-heading">Teacher Comments</h4>',
                        '<ul class="slate-task-comments">',
                            '<tpl for="comments">',
                                '<li class="slate-task-comment">',
                                    '<div class="slate-task-comment-date">{Created:date("M d, Y")}</div>',
                                    '<div class="slate-task-comment-text">{Message}</div>',
                                '</li>',
                            '</tpl>',
                        '</ul>',
                    '</div>',
                '</tpl>'
            ]
        }]
    }]
});
