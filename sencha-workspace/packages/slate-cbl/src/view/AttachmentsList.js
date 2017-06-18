Ext.define('Slate.cbl.view.AttachmentsList', {
    extend: 'Ext.view.View',
    xtype: 'slate-attachmentslist',
    requires: [
        'Slate.cbl.model.tasks.Attachment'
    ],

    config: {
        editable: true,
        shareMethodMutable: true,
        statusMutable: true,

        shareMenu: null
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
            '<li class="slate-attachmentslist-item',
                '<tpl if="kind"> slate-attachment-{kind}</tpl>',
                '<tpl if="ShareMethod"> slate-attachment-{ShareMethod}</tpl>',
                '<tpl if="Status == &quot;removed&quot;"> removed</tpl>',
            '">',
                '<span class="slate-attachment-title"><a href="{[this.getURL(values)]}" target=_blank>{title}</a><tpl if="Status == &quot;removed&quot;"><i> (removed) </i></tpl></span>',
                '<tpl if="isEditable">',
                    '<tpl if="isPhantom">',
                        '<tpl if="shareMethodMutable && isPhantom && this.isGoogleDoc(values)">',
                            '<button class="plain" action="settings"><i class="fa {[this.getShareMethodIcon(values.ShareMethod)]}" title="{ShareMethod}"></i></button>',
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

            getShareMethodIcon: function(method) {
                var icons = {
                    'view-only': 'fa-eye',
                    duplicate: 'fa-copy',
                    collaborate: 'fa-users',
                    default: 'fa-gear'
                };

                return icons[method] || icons.default;
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

        me.el.on('tap', function(ev) {
            var btn = Ext.get(ev.getTarget('button')),
                action, record;

            if (!btn) {
                return;
            }

            action = btn.getAttribute('action');
            record = me.getRecord(btn.parent(me.getItemSelector()));

            if (action == 'settings') {
                me.getShareMethodMenu(record).showBy(btn, 'tl-tl', [-3, 0]);
            } else if (action == 'toggle-status') {
                if (record.phantom) {
                    me.getStore().remove(record);
                } else {
                    record.set('Status', btn.getAttribute('data-status'));
                }
            }
        }, null, { delegate: 'button' });
    },

    getShareMethodMenu: function(attachment) {
        var me = this,
            menu = me.getShareMenu();

        // create and set shareMenu config
        if (!menu) {
            menu = Ext.create('Ext.menu.Menu', {
                setValue: function(val) {
                    var item = this.down('menucheckitem[inputValue='+val+']');

                    if (item) {
                        item.setChecked(true);
                    }
                },
                bodyPadding: 3,
                defaults: {
                    xtype: 'menucheckitem',
                    group: 'ShareMethod',
                    handler: Ext.bind(me.onMenuItemSelect, me)
                },

                items: [{
                    iconCls: 'fa fa-eye',
                    text: 'View Only',
                    inputValue: 'view-only'
                }, {
                    iconCls: 'fa fa-copy',
                    text: 'Duplicate',
                    inputValue: 'duplicate'
                }, {
                    iconCls: 'fa fa-users',
                    text: 'Collaborate',
                    inputValue: 'collaborate'
                }]
            });
            me.setShareMenu(menu);
        }

        menu.setConfig('attachment', attachment);
        menu.setValue(attachment.get('ShareMethod'));

        return menu;
    },

    onMenuItemSelect: function(item) {
        var me = this,
            menu = me.getShareMenu();

        me.fireEvent('sharemethodchange', menu, menu.attachment, item, item.checked);
    }
});
