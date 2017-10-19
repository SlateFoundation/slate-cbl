Ext.define('Slate.cbl.widget.rating.Competency', {
    extend: 'Ext.container.Container',
    xtype: 'slate-cbl-ratingcompetency',
    requires: [
        'Slate.cbl.widget.rating.Skill'
    ],


    config: {
        Code: null,
        Descriptor: null
    },

    renderTpl: [
        '<h4 id="{id}-titleEl" data-ref="titleEl">{title}</h4>',
        '{% this.renderContainer(out,values) %}'
    ],
    childEls: [
        'titleEl',
    ],

    componentCls: 'slate-cbl-ratingcompetency',
    defaultType: 'slate-cbl-ratingskill',

    initRenderData: function() {
        var me = this;

        return Ext.apply(me.callParent(), {
            title: me.buildTitle()
        });
    },

    updateCode: function() {
        if (this.rendered) {
            this.titleEl.update(this.buildTitle());
        }
    },

    updateDescriptor: function() {
        if (this.rendered) {
            this.titleEl.update(this.buildTitle());
        }
    },

    buildTitle: function() {
        return Ext.Array.clean([this.getCode(), this.getDescriptor()]).join(' – ');
    }
});