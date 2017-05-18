Ext.define('Slate.cbl.view.AttachmentsList', {
    extend: 'Ext.view.View',
    xtype: 'slate-attachmentslist',
    requires: [
        'Slate.cbl.model.tasks.Attachment'
    ],

    config: {
        editable: true,
        shareMethodMutable: true,
        statusMutable: true
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
            '<li class="slate-attachmentslist-item<tpl if="kind"> slate-attachment-{kind}</tpl><tpl if="Status == &quot;removed&quot;"> removed</tpl>">',
                '<span class="slate-attachment-title"><a href="{[this.getURL(values)]}" target=_blank>{title}</a><tpl if="Status == &quot;removed&quot;"><i> (removed) </i></tpl></span>',
                '<tpl if="isEditable">',
                    '<tpl if="isPhantom">',
                        '<tpl if="shareMethodMutable && isPhantom && this.isGoogleDoc(values)">',
                            '<button class="plain" action="settings"><i class="fa fa-gear"></i></button>',
                        '</tpl>',
                    '</tpl>',
                    '<tpl if="statusMutable && Status == &quot;normal&quot;">',
                        '<button class="plain" action="toggle-status" data-status="removed"><i class="fa fa-times-circle"></i></button>',
                    '<tpl elseif="statusMutable && Status == &quot;removed&quot;">',
                        '<button class="plain" action="toggle-status" data-status="normal"><i class="fa fa-undo"></i></button>',
                    '</tpl>',
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
                            fileType = values.File.Type;
                            break;
                        default:
                            fileType = 'file';
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
            recordData = record.getData();

        return Ext.apply({}, recordData, {
            isPhantom: record.phantom,
            isEditable: me.getEditable(),
            statusMutable: me.getStatusMutable(),
            shareMethodMutable: me.getShareMethodMutable()
        });
    },

    updateEditable: function() {
        this.refreshView();
    },

    updateStatusMutable: function() {
        this.refreshView();
    },

    updateShareMethodMutable: function() {
        this.refreshView();
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
                case 'toggle-status':
                    if (record.phantom) {
                        me.getStore().remove(record);
                    } else {
                        record.set('Status', btn.getAttribute('data-status'));
                    }
                    break;
            }
        }, null, { delegate: 'button' });
    }
});
