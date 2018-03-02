Ext.define('Slate.cbl.field.attachments.Link', {
    extend: 'Slate.cbl.field.attachments.Attachment',
    xtype: 'slate-cbl-attachments-link',


    // attachment configuration
    config: {
        url: null
    },

    titleTpl: [
        '<a href="{url:htmlEncode}" target="_blank">',
            '{[fm.htmlEncode(this.getTitle(values))]}',
        '</a>',
        {
            getTitle: function(values) {
                var title = values.title,
                    url;

                if (!title) {
                    url = values.url;
                    if (url) {
                        title = url.replace(/^https?:\/\//i, '');
                    } else {
                        title = '–';
                    }
                }

                return title;
            }
        }
    ],


    // config handlers
    updateUrl: function() {
        this.refresh();
        this.fireChange();
    },


    // component lifecycle
    initRenderData: function() {
        var me = this;

        return Ext.apply({
            url: me.getUrl()
        }, me.callParent(arguments));
    },


    // attachment methods
    doEdit: function() {
        var me = this;

        Ext.Msg.prompt(
            'Set Attachment URL',
            'Enter a new URL for this attachment',
            function(urlBtnId, url) {
                if (urlBtnId == 'ok') {

                    Ext.Msg.prompt(
                        'Set Attachment Title',
                        'Enter a new title for this attachment (leave blank for none)',
                        function(titleBtnId, title) {
                            if (titleBtnId == 'ok') {
                                me.setUrl(Ext.String.trim(url) || null);
                                me.setTitle(Ext.String.trim(title) || null);
                            }
                        },
                        me,
                        false,
                        me.getTitle()
                    );
                }
            },
            me,
            false,
            me.getUrl()
        );
    },

    getValue: function() {
        var value = this.callParent();

        value.URL = this.getUrl();

        return value;
    },

    applyValueToConfig: function(value) {
        return Ext.apply(this.callParent(arguments), {
            url: value.URL || null
        });
    },


    inheritableStatics: {
        recordClass: 'Slate\\CBL\\Tasks\\Attachments\\Link',

        buildButtonConfig: function(field) {
            var LinkAttachment = this;

            return {
                xtype: 'button',
                text: 'Add Link',
                handler: function() {
                    field.addAttachment(new LinkAttachment()).edit();
                }
            };
        }
    }
});