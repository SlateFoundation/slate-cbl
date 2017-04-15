Ext.define('Slate.cbl.view.AttachmentsList', {
    extend: 'Ext.view.View',
    xtype: 'slate-attachmentslist',
    requires: [
        'Slate.cbl.model.tasks.Attachment'
    ],

    config: {
        editable: true
    },

    autoEl: 'ul',
    componentCls: 'slate-attachmentslist',

    emptyText: '<span class="muted">No attachments</span>',

    itemSelector: '.slate-attachmentslist-item',

    store: {
        model: 'Slate.cbl.model.tasks.Attachment'
    },

    tpl: [
        '<tpl for=".">',
            '<li class="slate-attachmentslist-item <tpl if="kind">slate-attachment-{kind}</tpl>">',
                '<span class="slate-attachment-title"><a href="{[this.getURL(values)]}" target=_blank>{title}</a></span>',
                '<tpl if="isEditable">',
                    '<tpl if="this.isGoogleDoc(values)">',
                        '<button class="plain" action="settings"><i class="fa fa-gear"></i></button>',
                    '</tpl>',
                    '<button class="plain" action="remove"><i class="fa fa-times-circle"></i></button>',
                '</tpl>',
            '</li>',
        '</tpl>',
        {
            isGoogleDoc: function (values) {
                return values.Class == 'Slate\\CBL\\Tasks\\Attachments\\GoogleDriveFile';
            },

            getURL: function(values) {
                var fileType;

                if (this.isGoogleDoc(values) && values.File && values.File.DriveID) {
                    switch (values.File.Type) {
                        case 'drawing':
                        case 'spreadsheet':
                            fileType = values.File.Type + 's';
                            break;

                        case 'presentation':
                        case 'document':
                        default:
                            fileType = values.File.Type;
                            break;
                    }
                    return 'https://docs.google.com/'+fileType+'/d/'+values.File.DriveID;
                }

                return values.URL;
            }
        }
    ],

    prepareData: function(data, recordIndex, record) {
        var me = this,
            editable = me.getEditable(),
            recordData = record.getData();

        recordData.isEditable = editable;
        return recordData;
    },

    afterRender: function() {
        var me = this;

        me.callParent();

        if (me.el) {
            Ext.each(me.el.query('button', false), function(el) {
                el.setVisible(me.getEditable());
            });
        }

        me.el.on('click', function(ev) {
            var btn = ev.getTarget('button'),
                action, record;

            if (btn) {
                action = btn.getAttribute('action');
            }

            record = me.getRecord(Ext.fly(event.target).parent(me.getItemSelector()));

            switch (action) {
                case 'settings':

                    Ext.create('Ext.menu.Menu', {
                        items: [{
                            xtype: 'radiogroup',
                            columns: 1,
                            vertical: true,
                            defaults: {
                                name: 'ShareMethod',
                                handler: function(item, checked) {
                                    me.fireEvent('sharemethodchange', this, record, item, checked);
                                }
                            },
                            items: [{
                                boxLabel: 'View Only',
                                inputValue: 'view-only',
                                checked: record.get('ShareMethod') === 'view-only'
                            },
                            {
                                boxLabel: 'Duplicate',
                                inputValue: 'duplicate',
                                checked: record.get('ShareMethod') === 'duplicate'
                            },
                            {
                                boxLabel: 'Collaborate',
                                inputValue: 'collaborate',
                                checked: record.get('ShareMethod') === 'collaborate'
                            }]
                        }]
                    }).showAt(Ext.fly(btn).getXY());
                    break;
                case 'remove':

                    me.getStore().remove(record);
                    break;
            }
        }, null, { delegate: 'button' });
    }
});
