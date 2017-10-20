Ext.define('Slate.cbl.widget.RatingView', {
    extend: 'Ext.Component',
    xtype: 'slate-ratingview',
    requires: [
        'Ext.menu.Menu'
    ],

    componentCls: 'slate-ratingview',

    config: {
        menu: null,
        menuRatings: [1, 2, 3, 4, 5, 6],
        readOnly: false
    },
    // todo: add ratings as config.
    // TODO: refactor as a container of individual stateful slider components
    tpl: [
        '{% this.ratings = values.ratings %}',
        '{% this.menuRatings = values.menuRatings %}',
        '{% this.readOnly = values.readOnly %}',

        '<ul class="slate-ratingview-competencies">',
            '<tpl for="competencies">',
                '<li class="slate-ratingview-competency">',
                    '<h4 class="slate-ratingview-competency-title">{Code}<tpl if="Code &amp;&amp; Descriptor"> – </tpl>{Descriptor}</h4>',
                    '<ul class="slate-ratingview-skills">',
                        '<tpl for="skills">',
                            '<li class="slate-ratingview-skill slate-ratingview-skill-level-{[values.Level || values.CompetencyLevel]}" data-competency="{[parent.Code]}" data-skill="{Code}" data-competency-level="{CompetencyLevel}" data-level="{Level}">',
                                '<header class="slate-ratingview-skill-header">',
                                    '<h5 class="slate-ratingview-skill-title">{Code}<tpl if="Code &amp;&amp; Descriptor"> – </tpl>{Descriptor}</h5>',
                                '</header>',
                                '<ol class="slate-ratingview-ratings">',
                                    '<li class="slate-ratingview-rating <tpl if="this.menuRatings.length">slate-ratingview-rating-menu</tpl> {[this.getMenuRatingElCls(values.Rating, this.menuRatings).join(" ")]}" data-rating="{[this.getMenuElRatingValue(values.Rating, this.menuRatings)]}">',
                                        '<div class="slate-ratingview-rating-bubble" tabindex="0">',
                                            '<span class="slate-ratingview-rating-label">{[this.getMenuRatingElLabel(values.Rating, this.menuRatings)]}</span>',
                                        '</div>',
                                    '</li>',
                                    '<tpl for="this.ratings">', // access template-scoped variable declared at top
                                        '<li class="slate-ratingview-rating <tpl if="values == parent.Rating || values === &quot;M&quot; && parent.Rating === 0">is-selected</tpl>" data-rating="{.}">',
                                            '<div class="slate-ratingview-rating-bubble" tabindex="0">',
                                                '<span class="slate-ratingview-rating-label">{[this.getRatingElLabel(values)]}</span>',
                                            '</div>',
                                        '</li>',
                                    '</tpl>',
                                '</ol>',
                            '</li>',
                        '</tpl>',
                    '</ul>',
                '</li>',
            '</tpl>',
        '</ul>',

        {
            getRatingElLabel: function(rating) {
                if (rating === 0) {
                    return 'M';
                }

                return rating;
            },

            getMenuRatingElCls: function(rating, menuRatings) {
                var cls = [],
                    ratingInMenu = menuRatings.indexOf(rating) > -1;

                if (rating === null || ratingInMenu) {
                    cls.push('is-selected');
                }

                if (rating === null || !ratingInMenu) {
                    cls.push('slate-ratingview-rating-null');
                }

                return cls;
            },

            getMenuElRatingValue: function(rating, menuRatings) {
                if (rating && menuRatings.indexOf(rating) > -1) {
                    return rating;
                }

                return null;
            },

            getMenuRatingElLabel: function(rating, menuRatings) {
                if (menuRatings.indexOf(rating) > -1) {
                    return rating;
                }

                return 'N/A';
            }
        }
    ],

    listeners: {
        scope: 'this',
        click: {
            fn: 'onScaleClick',
            element: 'el',
            delegate: '.slate-ratingview-rating'
        }
    },

    applyData: function(data) {
        var dataObj = data || {};

        dataObj.readOnly = this.getReadOnly();
        dataObj.menuRatings = this.getMenuRatings();

        return dataObj;
    },

    updateData: function(data, oldData) {
        var me = this;

        if (!me.rendered) {
            me.on('render', function() {
                me.updateData(data, oldData);
            }, me, { single: true });
            return;
        }

        if (data !== oldData) {
            me.setHtml(me.tpl.apply(data));
        }
    },

    updateReadOnly: function() {
        var me = this;

        me.setData(me.getData());
    },

    onScaleClick: function(ev, t) {
        var me = this,
            ratingEl = Ext.get(t);

        if (me.getReadOnly()) {
            return;
        }

        if (ratingEl.is('.slate-ratingview-rating-menu')) {
            me.showMenu(ratingEl);
            return;
        }

        if (ratingEl.hasCls('is-selected')) {
            return;
        }

        me.selectRating(ratingEl, parseInt(ratingEl.getAttribute('data-rating'), 10));
    },

    selectRating: function(ratingEl, rating) {
        var me = this,
            tpl = me.lookupTpl('tpl'),
            menuRatings = me.getMenuRatings(),
            skillEl = ratingEl.parent('.slate-ratingview-skill'),
            menuThumbEl = skillEl.down('.slate-ratingview-rating-menu'),
            ratingInMenu = menuRatings.indexOf(rating) > -1;

        ratingEl.radioCls('is-selected');

        // if rating is being removed, revert level styling to current competency level that future ratings would get logged against
        if (rating === null) {
            skillEl.removeCls('slate-ratingview-skill-level-'+skillEl.getAttribute('data-level'));
            skillEl.addCls('slate-ratingview-skill-level-'+skillEl.getAttribute('data-competency-level'));
        }

        // update menu thumb el
        if (menuThumbEl) {
            menuThumbEl.toggleCls('slate-ratingview-rating-null', rating === null || !ratingInMenu);
            menuThumbEl.dom.setAttribute('data-rating', tpl.getMenuElRatingValue(rating, menuRatings) || '');
            menuThumbEl.down('.slate-ratingview-rating-label').setHtml(tpl.getMenuRatingElLabel(rating, menuRatings));
        }

        return me.fireEvent('rateskill', me, {
            CompetencyID: skillEl.getAttribute('data-competency'),
            SkillID: skillEl.getAttribute('data-skill'),
            Rating: rating
        });
    },

    showMenu: function(ratingEl) {
        var me = this,
            menu = me.getMenu(),
            menuRatings = me.getMenuRatings(),
            items = [{
                text: 'N/A',
                value: null
            }];

        if (Ext.isEmpty(menuRatings)) {
            return;
        }

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
            menu.showAt(ratingEl.getXY());
            menu.focus();
        }
    },

    onMenuRatingClick: function(menu, menuItem) {
        var me = this;

        me.selectRating(menu.ratingEl, menuItem.getValue());
        menu.hide();
    }
});
