Ext.define('Slate.cbl.view.AttachmentsList', {
    extend: 'Ext.view.View',
    xtype: 'slate-attachmentslist',

    autoEl: 'ul',
    componentCls: 'slate-attachmentslist',

    itemSelector: '.slate-attachmentslist-item',
    tpl: [
        '<tpl for=".">',
            '<li class="slate-attachmentslist-item <tpl if="kind">slate-attachment-{kind}</tpl>">',
                '<span class="slate-attachment-title"><a href="{url}" target=_blank>{title}</a></span>',
                // TODO hide/show based on whether it's editable
                '<button class="plain" action="settings"><i class="fa fa-gear"></i></button>',
                '<button class="plain" action="remove"><i class="fa fa-times-circle"></i></button>',
            '</li>',
        '</tpl>'
    ],

    afterRender: function() {
        var me = this;
        me.callParent();

        me.el.on('click', function(ev, t) {
            var btn = ev.getTarget('button'),
                action;

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
            }
        }, { delegate: 'button'});
    }
});