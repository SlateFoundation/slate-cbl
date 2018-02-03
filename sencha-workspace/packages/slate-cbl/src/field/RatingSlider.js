/**
 * Provides a picker for ratings
 */
Ext.define('Slate.cbl.field.RatingSlider', {
    extend: 'Ext.slider.Multi',
    xtype: 'slate-cbl-ratingslider',
    requires: [
        'Ext.tip.ToolTip',
        'Ext.menu.Menu',
        'Ext.menu.CheckItem',

        /* global Slate */
        'Slate.cbl.field.RatingThumb',
        'Slate.cbl.model.Skill'
    ],


    isRatingField: true,


    config: {
        skill: null,
        level: null,

        minRating: 8,
        maxRating: 13,
        menuRatings: [7, 6, 5, 4, 3, 2, 1, 0]
    },


    // slider configuration
    useTips: false,


    // field configuration
    labelAlign: 'top',


    // component configuration
    componentCls: 'slate-cbl-ratingslider',

    listeners: {
        change: function(me, value, thumb) {
            thumb.setValue(value);
        }
    },


    // slider lifecycle
    getNearest: function() {
        return this.primaryThumb;
    },

    calculateThumbPosition: function(value) {
        return this.callParent([Math.max(value, this.minValue)]);
    },

    onClickChange: function(trackPoint) {
        var me = this,
            value = me.reversePixelValue(trackPoint);

        if (Math.round(value) == me.minValue) {
            value = null;
        }

        me.setValue(0, value, true, true);
    },


    // field lifecycle
    initValue: function() {
        var me = this,
            thumbs = me.thumbs,
            minValue = me.minValue,
            maxValue = me.maxValue,
            i = minValue + 1,
            value = me.value || null;

        me.originalValue = value;

        // add primary thumb for current value
        thumbs.push(me.primaryThumb = new Slate.cbl.field.RatingThumb({
            index: thumbs.length,
            ownerCt: me,
            slider: me,
            value: value,
            constrain: false,
            thumbCls: value <= minValue ? 'slate-cbl-ratingthumb-parked' : null
        }));

        // add misc thumb for menu values
        thumbs.push(me.miscThumb = new Slate.cbl.field.RatingThumb({
            index: thumbs.length,
            ownerCt: me,
            slider: me,
            value: null,
            disabled: true
        }));

        // add disabled thumbs for each available value
        for (; i <= maxValue; i++) {
            thumbs.push(new Slate.cbl.field.RatingThumb({
                index: thumbs.length,
                ownerCt: me,
                slider: me,
                value: i,
                disabled: true
            }));
        }
    },

    getValue: function() {
        return this.value;
    },

    setValue: function() {
        var me = this,
            primaryThumb = me.primaryThumb,
            miscRatingsTip = me.miscRatingsTip,
            oldValue = me.value,
            args = arguments,
            argsLength = args.length,
            thumbIndex = 0,
            value = null,
            animate = true,
            changeComplete = false;

        // support various argument formats of sliders and fields
        if (argsLength == 1) {
            value = args[0];
        } else if (argsLength == 2) {
            if (typeof args[1] == 'number') {
                thumbIndex = args[0];
                value = args[1];
            } else {
                value = args[0];
                animate = args[1] !== false;
            }
        } else if (argsLength == 3 || argsLength == 4) {
            thumbIndex = args[0];
            value = args[1];
            animate = args[2] !== false;
            changeComplete = args[3] || false;
        } else {
            Ext.Logger.error('RatingSlider can not handle 4+ arguments');
        }


        // sanity check
        if (thumbIndex != 0) {
            Ext.Logger.error('RatingSlider does not support thumb index other than 0');
        }


        // apply value
        value = me.normalizeValue(value);

        if (value !== oldValue && me.fireEvent('beforechange', me, value, oldValue, primaryThumb) !== false) {
            me.value = value;
            primaryThumb.setValue(value);

            if (me.rendered) {
                primaryThumb.move(me.calculateThumbPosition(value), animate);
                primaryThumb.el.toggleCls('slate-cbl-ratingthumb-parked', value <= me.minValue);

                if (miscRatingsTip && miscRatingsTip.isVisible()) {
                    miscRatingsTip.setValue(value);
                }

                me.fireEvent('change', me, value, primaryThumb);
                me.checkDirty();

                if (changeComplete) {
                    me.fireEvent('changecomplete', me, value, primaryThumb);
                }
            }
        }

        return me;
    },

    normalizeValue: function(value) {
        var me = this,
            maxValue = me.maxValue;

        if (value === null) {
            return value;
        }

        value = Math.round(value);

        if (value >= maxValue) {
            value = maxValue;
        } else if (value < me.minValue && me.getMenuRatings().indexOf(value) == -1) {
            value = null;
        }

        return value;
    },


    // component lifecycle
    onRender: function() {
        var me = this,
            primaryThumb = me.primaryThumb;

        me.callParent(arguments);

        me.promoteThumb(primaryThumb);

        me.primaryThumb.el.on('click', 'onPrimaryThumbClick', me);
    },


    // config handlers
    applySkill: function(skill, oldSkill) {
        if (!skill) {
            return null;
        }

        if (!skill.isModel) {
            if (oldSkill && skill.ID == oldSkill.getId()) {
                oldSkill.set(skill, { dirty: false });
                return oldSkill;
            }

            skill = Slate.cbl.model.Skill.create(skill);
        }

        return skill;
    },

    updateSkill: function(skill) {
        this.setFieldLabel(skill ? skill.get('Descriptor') : null);
    },

    updateLevel: function(level, oldLevel) {
        if (oldLevel) {
            this.removeCls('cbl-level-'+oldLevel);
        }

        if (level) {
            this.addCls('cbl-level-'+level);
        }
    },

    updateMinRating: function(minRating) {
        var me = this;

        // create extra spot for menu
        minRating--;

        if (me.thumbs) {
            me.setMinValue(minRating);
        } else {
            me.minValue = minRating;
        }
    },

    updateMaxRating: function(maxRating) {
        var me = this;

        if (me.thumbs) {
            me.setMaxValue(maxRating);
        } else {
            me.maxValue = maxRating;
        }
    },

    updateMenuRatings: function() {
        var me = this,
            miscRatingsTip = me.miscRatingsTip;

        if (!miscRatingsTip) {
            return;
        }

        Ext.suspendLayouts();
        miscRatingsTip.menu.removeAll();
        miscRatingsTip.menu.add(me.buildMiscRatingsMenuItems());

        // re-apply value in case current value was removed from list
        me.setValue(me.getValue());

        Ext.resumeLayouts(true);
    },


    // event handlers
    onPrimaryThumbClick: function() {
        var me = this,
            value = me.getValue(),
            miscRatingsTip;

        if (value > me.minValue) {
            return;
        }

        miscRatingsTip = me.buildMiscRatingsTip();

        if (miscRatingsTip.isVisible()) {
            miscRatingsTip.hide();
            return;
        }

        miscRatingsTip.setTarget(me.primaryThumb.el);
        miscRatingsTip.setValue(value);
        miscRatingsTip.show();
    },


    // local methods
    buildMiscRatingsTip: function() {
        var me = this,
            miscRatingsTip = me.miscRatingsTip;

        if (!miscRatingsTip) {
            miscRatingsTip = Ext.create('Ext.tip.ToolTip', {
                anchor: 'left',
                autoHide: false,
                cls: 'slate-cbl-ratingslider-miscratingstip',
                items: {
                    xtype: 'menu',
                    floating: false,
                    plain: true,
                    defaultType: 'menucheckitem',
                    defaults: {
                        group: 'level',
                        listeners: {
                            checkchange: function(menuItem, checked) {
                                if (!checked) {
                                    return; // ignore uncheck events
                                }

                                me.setValue(0, menuItem.value, true, true);
                                miscRatingsTip.hide();
                            }
                        }
                    },
                    items: me.buildMiscRatingsMenuItems()
                },
                setValue: function(value) {
                    var menu = miscRatingsTip.menu,
                        valueItem = menu.items.findBy(function(menuItem) {
                            return menuItem.value === value;
                        }),
                        checkedItem;

                    if (valueItem) {
                        valueItem.setChecked(true, true);
                    } else {
                        checkedItem = menu.down('[checked]');

                        if (checkedItem) {
                            checkedItem.setChecked(false, true);
                        }
                    }
                }
            });

            miscRatingsTip.menu = miscRatingsTip.down('menu');

            // remove target on hide so that it does not open again on mouse hover
            miscRatingsTip.on('hide', function() {
                miscRatingsTip.setTarget(null);
            });

            me.miscRatingsTip = miscRatingsTip;
        }

        return miscRatingsTip;
    },

    buildMiscRatingsMenuItems: function() {
        var me = this,
            primaryThumb = me.primaryThumb,
            ratings = Ext.Array.clone(me.getMenuRatings() || []),
            length = ratings.length,
            i = 0, rating,
            itemsCfg = [];

        ratings.push(null);
        length++;

        for (; i < length; i++) {
            rating = ratings[i];

            itemsCfg.push({
                value: rating,
                text: primaryThumb.buildValueHtml(rating)
            });
        }

        return itemsCfg;
    }
});