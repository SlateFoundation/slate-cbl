Ext.define('Slate.cbl.widget.RatingView', {
    extend: 'Ext.Component',
    xtype: 'slate-ratingview',
    requires: [
        'Ext.menu.Menu'
    ],

    componentCls: 'slate-ratingview',

    config: {
        menu: null,
        menuRatingOptions: [1, 2, 3, 4, 5, 6],
        ratingOptions: [7, 8, 9, 10, 11, 12, {text: 'M', value: 0}],

        readOnly: false,

        skills: null,
        groupedSkills: null,
        demonstrationSkills: null,
        defaultRatings: null
    },
    // todo: add ratings as config.
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
                            '<li class="slate-ratingview-skill slate-ratingview-skill-level-{currentLevel}" data-competency="{[parent.Code]}" data-skill="{Code}" data-skill-id="{ID}">',
                                '<header class="slate-ratingview-skill-header">',
                                    '<tpl if="!this.readOnly">', // hide when in readOnly mode
                                        '<button class="slate-ratingview-remove"><i class="fa fa-times-circle"></i></button>',
                                    '</tpl>',
                                    '<h5 class="slate-ratingview-skill-title">{Code}<tpl if="Code &amp;&amp; Descriptor"> – </tpl>{Descriptor}</h5>',
                                '</header>',
                                '<ol class="slate-ratingview-ratings">',
                                    '<li class="slate-ratingview-rating slate-ratingview-rating-menu slate-ratingview-rating-null{[this.getMenuRatingElCls(values.Rating, this, values)]}" data-rating="{[this.getMenuElRatingValue(values.Rating, this)]}">',
                                        '<div class="slate-ratingview-rating-bubble" tabindex="0">',
                                            '<span class="slate-ratingview-rating-label">{[this.getMenuRatingElLabel(values.Rating, this)]}</span>',
                                        '</div>',
                                    '</li>',
                                    '<tpl for="this.ratings">', // access template-scoped variable declared at top
                                        '<li class="slate-ratingview-rating{[this.getRatingElCls(values, parent.Rating)]}" data-rating="{[this.getRatingLevel(values)]}">',
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
            getRatingElLabel: function(ratingLevel) {
                if (Ext.isObject(ratingLevel)) {
                    return ratingLevel.text;
                }

                return ratingLevel;
            },

            getRatingElCls: function(ratingLevel, skillRating) {
                var cls = '';

                if (Ext.isObject(ratingLevel) && ratingLevel.value == skillRating) {
                    cls += ' is-selected';
                } else if (ratingLevel == skillRating) {
                    cls += ' is-selected';
                }

                return cls;
            },

            getRatingLevel: function(ratingLevel) {
                if (Ext.isObject(ratingLevel)) {
                    return ratingLevel.value;
                }

                return ratingLevel;
            },

            getMenuRatingElCls: function(rating, scope) {
                var cls = '';

                if (rating === null || scope.menuRatings.indexOf(rating) > -1) {
                    cls += ' is-selected';
                }
                console.log(arguments);
                return cls;
            },

            getMenuElRatingValue: function(rating, scope) {
                if (rating && scope.menuRatings.indexOf(rating) > -1) {
                    return rating;
                }

                return 'N/A';
            },

            getMenuRatingElLabel: function(rating, scope) {
                if (scope.menuRatings.indexOf(rating) > -1) {
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
            delegate: ['.slate-ratingview-rating', '.slate-ratingview-remove']
        }
    },

    applyData: function(data) {
        var dataObj = data || {};

        dataObj.readOnly = this.getReadOnly();
        dataObj.menuRatings = this.getMenuRatingOptions();
        dataObj.ratings = this.getRatingOptions();

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

    applyGroupedSkills: function(skills) {
        var i = 0,
            competencyCodes = [],
            groupedSkills = [],

            demonstrationSkills = this.getDemonstrationSkills(),
            demonstrationSkill,

            skill, skillIdx;

        if (!skills || !Ext.isArray(skills)) {
            return groupedSkills;
        }

        for (; i < skills.length; i++) {
            skill = skills[i];
            skillIdx = competencyCodes.indexOf(skill.Competency.Code);
            demonstrationSkill = demonstrationSkills[skill.ID];

            if (demonstrationSkill) {
                skill.Rating = isNaN(demonstrationSkill.DemonstratedLevel) ? demonstrationSkill.DemonstratedLevel : parseInt(demonstrationSkill.DemonstratedLevel, 10);
            } else {
                skill.Rating = null;
            }

            if (skillIdx === -1) {
                competencyCodes.push(skill.Competency.Code);
                groupedSkills.push({
                    Code: skill.Competency.Code,
                    Descriptor: skill.Competency.Descriptor,
                    skills: [
                        skill
                    ]
                });
            } else {
                groupedSkills[skillIdx].skills.push(skill);
            }
        }

        return groupedSkills;
    },

    updateGroupedSkills: function(groupedSkills) { // verify update only gets called when value is changed.
        this.setData({
            competencies: groupedSkills
        });
    },

    updateSkills: function(skills) {
        this.setGroupedSkills(skills);
    },

    applyDemonstrationSkills: function(demonstrationSkills) {
        var me = this,
            i = 0,
            indexedDemonstrationSkills = {};

        for (; i < demonstrationSkills.length; i++) {
            indexedDemonstrationSkills[demonstrationSkills[i].SkillID] = demonstrationSkills[i];
        }

        return indexedDemonstrationSkills;
    },

    updateDemonstrationSkills: function() {
        var me = this;

        if (me.getSkills()) {
            me.updateSkills(me.getSkills());
        }
    },

    applyDefaultRatings: function(demonstrationSkills) {
        return this.extractRatings(demonstrationSkills);
    },

    extractRatings: function(demonstrationSkills) {
        var i = 0,
            ratings = {};

        for (; i < demonstrationSkills.length; i++) {
            ratings[demonstrationSkills[i].SkillID] = demonstrationSkills[i].DemonstratedLevel;
        }

        return ratings;
    },

    updateReadOnly: function() {
        var me = this;

        me.setData(me.getData());
    },

    onScaleClick: function(ev, t) {
        var me = this,
            target = Ext.get(t),
            isRatingEl = target.is('.slate-ratingview-rating'),
            isRemoveEl = target.is('.slate-ratingview-remove'),
            naRatingEl;


        if (!me.getReadOnly()) {
            if (isRemoveEl) {
                naRatingEl = target.parent('.slate-ratingview-skill').down('.slate-ratingview-rating-menu');
                me.updateRatingEl(naRatingEl, 'N/A');
                me.selectRating(naRatingEl, false);
            } else if (isRatingEl) {
                me.selectRating(target);
            }
        }
    },

    selectRating: function(target, showMenu) {
        var me = this,
            skillEl = target.parent('.slate-ratingview-skill'),

            rating = target.getAttribute('data-rating') || 'N/A',
            competency = skillEl.getAttribute('data-competency'),
            skillId = skillEl.getAttribute('data-skill-id'),

            ratingEls = skillEl.select('.slate-ratingview-rating'),
            naRating = skillEl.down('.slate-ratingview-rating-menu');


        if (target == naRating && showMenu !== false) {
            return me.showMenu(target, target.getXY());
        }

        // deselect other ratings
        ratingEls.removeCls('is-selected');

        if (rating == 'N/A') {
            naRating.addCls('slate-ratingview-rating-null');
        } else {
            naRating.removeCls('slate-ratingview-rating-null');
        }

        target.addCls('is-selected');

        return me.fireEvent('rateskill', me, {
            rating: rating,
            SkillID: skillId,
            CompetencyID: competency
        });
    },

    updateRatingEl: function(el, rating) {
        var text = rating || 'N/A';

        el.dom.setAttribute('data-rating', text);
        el.down('.slate-ratingview-rating-label').setHtml(text);
    },

    showMenu: function(ratingEl, xy) {
        var me = this,
            menu = me.getMenu(),
            menuRatings = me.getMenuRatingOptions(),
            items = [{
                text: 'N/A',
                value: null
            }];

        if (!me.getReadOnly()) {
            if (!menu && menuRatings.length) {
                Ext.each(menuRatings, function(mr) {
                    items.push({
                        text: mr,
                        value: isNaN(mr) ? mr : parseInt(mr, 10)
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
                menu.focus();
            }
        }
    },

    onMenuRatingClick: function(menu, menuRating) {
        var me = this;

        me.updateRatingEl(menu.ratingEl, menuRating.getValue());
        me.selectRating(menu.ratingEl, false);
        menu.hide();
    }
});
