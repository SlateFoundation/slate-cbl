Ext.define('Slate.cbl.widget.rating.Skill', {
    extend: 'Ext.Component',
    xtype: 'slate-cbl-ratingskill',
    requires: [
        'Ext.menu.Menu'
    ],


    config: {
        Code: null,
        Descriptor: null,
        menuRatings: [1, 2, 3, 4, 5, 6],
        ratings: [7, 8, 9, 10, 11, 12, 0]
    },

    componentCls: 'slate-cbl-ratingskill',
    renderTpl: [
        '<header>',
        '   <h5 id="{id}-titleEl" data-ref="titleEl">{title}</h5>',
        '</header>',

        '<ol class="slate-cbl-ratingskill-ratings">',
        '   <li class="slate-cbl-ratingskill-rating slate-cbl-ratingskill-menu">',
        '       <div class="slate-cbl-ratingskill-bubble" tabindex="0">',
        '           <span class="slate-cbl-ratingskill-label">N/A</span>',
        '       </div>',
        '   </li>',

        '   <tpl for="ratings">',
        '       <li class="slate-cbl-ratingskill-rating">',
        '           <div class="slate-cbl-ratingskill-bubble" tabindex="0">',
        '               <span class="slate-cbl-ratingskill-label">{[values === 0 ? "M" : values]}</span>',
        '           </div>',
        '       </li>',
        '   </tpl>',
        '</ol>'
    ],
    childEls: [
        'titleEl'
    ],

    initRenderData: function() {
        var me = this;

        return Ext.apply(me.callParent(), {
            title: me.buildTitle(),
            menuRatings: me.getMenuRatings(),
            ratings: me.getRatings(),
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