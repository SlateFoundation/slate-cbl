Ext.define('Slate.cbl.widget.RatingView', {
    extend: 'Ext.Component',
    xtype: 'slate-ratingview',
    requires: [],

    componentCls: 'slate-ratingview',

    config: {
        menu: null,
        menuRatings: [1,2,3,4,5,6,7]
    },
    //todo: add ratings as config.
    tpl: [
        '{% this.ratings = values.ratings %}',

        '<ul class="slate-ratingview-competencies">',
            '<tpl for="competencies">',
                '<li class="slate-ratingview-competency">',
                    '<h4 class="slate-ratingview-competency-title">{Code}<tpl if="Code &amp;&amp; Descriptor"> – </tpl>{Descriptor}</h4>',
                    '<ul class="slate-ratingview-skills">',
                        '<tpl for="skills">',
                            '<li class="slate-ratingview-skill slate-ratingview-skill-level-{CompetencyLevel}" data-competency="{[parent.Code]}" data-skill="{Code}">',
                                '<header class="slate-ratingview-skill-header">',
                                    '<button class="slate-ratingview-remove"><i class="fa fa-times-circle"></i></button>',
                                    '<h5 class="slate-ratingview-skill-title">{Code}<tpl if="Code &amp;&amp; Descriptor"> – </tpl>{Descriptor}</h5>',
                                '</header>',
                                '<ol class="slate-ratingview-ratings">',
                                    '<li class="slate-ratingview-rating slate-ratingview-rating-null <tpl if="values.Rating < this.ratings[0] || values.Rating == null || values.Rating == &quot;N/A&quot;">is-selected</tpl>" data-rating="{[values.Rating < this.ratings[0] ? values.Rating : "N/A"]}">',
                                        '<div class="slate-ratingview-rating-bubble" tabindex="0">',
                                            '<span class="slate-ratingview-rating-label">{[values.Rating && values.Rating <  this.ratings[0] ? values.Rating : "N/A"]}</span>',
                                        '</div>',
                                    '</li>',
                                    '<tpl for="this.ratings">', // access template-scoped variable declared at top
                                        '<li class="slate-ratingview-rating <tpl if="values == parent.Rating">is-selected</tpl>" data-rating="{.}">',
                                            '<div class="slate-ratingview-rating-bubble" tabindex="0">',
                                                '<span class="slate-ratingview-rating-label">{.}</span>',
                                            '</div>',
                                        '</li>',
                                    '</tpl>',
                                '</ol>',
                            '</li>',
                        '</tpl>',
                    '</ul>',
                '</li>',
            '</tpl>',
        '</ul>'
    ],

    listeners: {
        scope: 'this',
        click: {
            fn: 'onScaleClick',
            element: 'el',
            delegate: ['.slate-ratingview-rating', '.slate-ratingview-remove']
        }
    },

    onScaleClick: function(ev, t) {
        var me = this,
            target = Ext.get(t);

        if (target.is('.slate-ratingview-rating') || target.is('.slate-ratingview-remove')) {
            return me.selectRating(target);
        }

    },

    selectRating: function(target, showMenu) {
        var me = this,
            skillEl = target.parent('.slate-ratingview-skill'),
            skillUl = skillEl.parent('ul'),

            rating = target.getAttribute('data-rating'),
            competency = skillEl.getAttribute('data-competency'),
            skill = skillEl.getAttribute('data-skill'),

            ratingEls = skillEl.select('.slate-ratingview-rating'),
            naRating = skillEl.down('.slate-ratingview-rating-null');

        //deselect other ratings
        ratingEls.removeCls('is-selected');

        if (!rating || target == naRating) {
            naRating.addCls('is-selected');
            if (target == naRating && showMenu !== false) {
                me.showMenu(target, target.getXY());
            } else {
                me.updateRatingEl(naRating, null);
            }
        } else {
            target.addCls('is-selected');
        }

        return me.fireEvent('rateskill', me, {
            rating: rating,
            SkillID: skill,
            CompetencyID: competency
        });
    },

    updateRatingEl: function(el, rating) {
        var me = this,
            text = rating || 'N/A';

        el.dom.setAttribute('data-rating', text);
        el.down('.slate-ratingview-rating-label').setHtml(text);
    },

    showMenu: function(ratingEl, xy) {
        var me = this,
            menu = me.getMenu(),
            menuRatings = me.getMenuRatings(),
            items = [{
                text: 'N/A',
                value: null
            }];

        if (!menu && menuRatings.length) {
            Ext.each(menuRatings, function(mr) {
                items.push({
                    text: mr,
                    value: mr
                });
            });
            me.setMenu(menu = Ext.create('Ext.menu.Menu', {
                items: items
            }));
            menu.on('click', me.onMenuRatingClick, me);
        }

        if (menu) {
            menu.ratingEl = ratingEl;
            menu.showAt(xy);
        }
    },

    onMenuRatingClick: function(menu, menuRating) {
        var me = this;

        me.selectRating(menu.ratingEl, false);
        me.updateRatingEl(menu.ratingEl, menuRating.value);
        menu.hide();
    }
});