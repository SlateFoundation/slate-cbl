Ext.define('Slate.cbl.view.AttachmentsList', {
    extend: 'Ext.view.View',
    xtype: 'slate-attachmentslist',
    requires: [
        'Slate.cbl.model.tasks.Attachment'
    ],

    autoEl: 'ul',
    componentCls: 'slate-attachmentslist',

    itemSelector: '.slate-attachmentslist-item',
    tpl: [
        '<tpl for=".">',
            '<li class="slate-attachmentslist-item <tpl if="kind">slate-attachment-{kind}</tpl>">',
                '<span class="slate-attachment-title"><a href="{URL}" target=_blank>{title}</a></span>',
                // TODO hide/show based on whether it's editable
                '<button class="plain" action="settings"><i class="fa fa-gear"></i></button>',
                '<button class="plain" action="remove"><i class="fa fa-times-circle"></i></button>',
            '</li>',
        '</tpl>'
    ],

    store: {
        model: 'Slate.cbl.model.tasks.Attachment'
    },

    afterRender: function() {
        var me = this;
        me.callParent();

        me.el.on('click', function(ev, t) {
            var btn = ev.getTarget('button'),
                action, record;

            if (btn) {
                action = btn.getAttribute('action');
            }

            switch (action) {
                case 'settings':
                    Ext.create('Ext.menu.Menu', {
                        defaults: {
                            xtype: 'menucheckitem'
                        },
                        items: [
                            {
                                text: 'View Only',
                                checked: true
                            },
                            {
                                text: 'Duplicate'
                            },
                            {
                                text: 'Collaborate'
                            }
                        ]
                    }).showAt(Ext.fly(btn).getXY());
                    break;
                case 'remove':
                    record = me.getRecord(Ext.fly(event.target).parent(me.getItemSelector()));
                    me.getStore().remove(record);
                    break;
            }
        }, null, { delegate: 'button'});
    }
});