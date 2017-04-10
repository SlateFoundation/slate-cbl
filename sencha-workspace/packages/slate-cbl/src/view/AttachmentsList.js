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
                '<span class="slate-attachment-title"><a href="{URL}" target=_blank>{title}</a></span>',
                '<tpl if="isEditable">',
                    '<tpl if="this.isGoogleDoc(values.URL)">',
                        '<button class="plain" action="settings"><i class="fa fa-gear"></i></button>',
                    '</tpl>',
                    '<button class="plain" action="remove"><i class="fa fa-times-circle"></i></button>',
                '</tpl>',
            '</li>',
        '</tpl>',
        {
            isGoogleDoc: function (url) {
                var googleDocUrls = [
                        'docs.google.com',
                        'sheets.google.com',
                        'slides.google.com',
                        'drawings.google.com',
                        'script.google.com'
                    ],
                    googleDocUrlsLength = googleDocUrls.length,
                    i = 0;

                for (; i<googleDocUrlsLength; i++) {
                    if (url.indexOf(googleDocUrls[i]) > -1) {
                        return true;
                    }
                }

                return false;
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
