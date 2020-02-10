/**
 * Provides a picker for ratings
 */
Ext.define('Slate.cbl.field.ratings.Slider', {
    extend: 'Ext.slider.Multi',
    xtype: 'slate-cbl-ratings-slider',
    requires: [
        'Ext.tip.ToolTip',
        'Ext.menu.Menu',
        'Ext.menu.CheckItem',

        /* global Slate */
        'Slate.cbl.field.ratings.Thumb',
        'Slate.cbl.model.Skill'
    ],


    isRatingField: true,


    config: {
        skill: null,
        level: null,

        minRating: 5,
        maxRating: 12,
        menuRatings: [4, 3, 2, 1, 0],
        removable: false
    },


    // slider configuration
    useTips: false,


    // field configuration
    labelAlign: 'top',
    labelSeparator: '',
    beforeLabelTextTpl: [
        '<span class="slate-cbl-ratings-slider-bullet"></span>'
    ],


    // component configuration
    disabled: true,
    componentCls: 'slate-cbl-ratings-slider',

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

    onMouseDown: function(ev) {
        var me = this;

        if (ev.getTarget('.slate-cbl-ratings-slider-bullet') && me.getRemovable()) {
            me.fireEvent('removeclick', me);
            return;
        }

        me.callParent(arguments);
    },

    onClickChange: function(trackPoint) {
        var me = this,
            value = me.reversePixelValue(trackPoint);

        if (me.readOnly) {
            return;
        }

        if (Math.round(value) == me.minValue) {
            value = null;
        }

        me.setValue(value);
    },


    // field lifecycle
    initValue: function() {
        var me = this,
            thumbs = me.thumbs,
            minValue = me.minValue,
            maxValue = me.maxValue,
            i = minValue + 1,
            value = me.normalizeValue(me.value);

        me.value = me.originalValue = value;

        // add primary thumb for current value
        thumbs.push(me.primaryThumb = new Slate.cbl.field.ratings.Thumb({
            index: thumbs.length,
            ownerCt: me,
            slider: me,
            value: value,
            constrain: false,
            readOnly: me.readOnly,
            thumbCls: value <= minValue ? 'slate-cbl-ratings-thumb-parked' : null
        }));

        // add misc thumb for menu values
        thumbs.push(me.miscThumb = new Slate.cbl.field.ratings.Thumb({
            index: thumbs.length,
            ownerCt: me,
            slider: me,
            value: null,
            disabled: true
        }));

        // add disabled thumbs for each available value
        for (; i <= maxValue; i++) {
            thumbs.push(new Slate.cbl.field.ratings.Thumb({
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
            changeComplete = true;
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
            Ext.Logger.error('Slider can not handle 4+ arguments');
        }


        // sanity check
        if (thumbIndex != 0) {
            Ext.Logger.error('Slider does not support thumb index other than 0');
        }


        // apply value
        value = me.normalizeValue(value);

        if (value !== oldValue && me.fireEvent('beforechange', me, value, oldValue, primaryThumb) !== false) {
            me.value = value;
            primaryThumb.setValue(value);

            if (me.rendered) {
                primaryThumb.move(me.calculateThumbPosition(value), animate);
                primaryThumb.el.toggleCls('slate-cbl-ratings-thumb-parked', value <= me.minValue);

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

        if (!value && value !== 0) {
            return null;
        }

        value = Math.round(value);

        if (value >= maxValue) {
            value = maxValue;
        } else if (value < me.minValue && me.getMenuRatings().indexOf(value) == -1) {
            value = null;
        }

        return value;
    },

    setReadOnly: function(readOnly) {
        var me = this;

        me.toggleCls('slate-cbl-ratings-slider-removable', me.getRemovable() && !readOnly);

        me.primaryThumb.setReadOnly(readOnly);

        Ext.form.field.Base.prototype.setReadOnly.apply(this, arguments); // skip other slider implementations that mess with thumbs
    },


    // component lifecycle
    onRender: function() {
        var me = this,
            primaryThumb = me.primaryThumb;

        me.callParent(arguments);

        me.promoteThumb(primaryThumb);

        me.primaryThumb.el.on('click', 'onPrimaryThumbClick', me);
    },

    onDisable: function() {
        this.primaryThumb.disable();
        this.updateLayout();
    },

    onEnable: function() {
        this.primaryThumb.enable();
        this.updateLayout();
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
        this.setFieldLabel(skill ? skill.get('Code') + '&mdash;' + skill.get('Descriptor') : null);
    },

    updateLevel: function(level, oldLevel) {
        var me = this;

        if (oldLevel) {
            me.removeCls('cbl-level-'+oldLevel);
        }

        if (level) {
            me.addCls('cbl-level-'+level);
        }

        me.setDisabled(!level);
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

    updateRemovable: function(removable) {
        this.toggleCls('slate-cbl-ratings-slider-removable', removable && !this.readOnly);
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

        if (me.fireEvent('beforetipshow', me, miscRatingsTip) !== false) {
            miscRatingsTip.show();

            me.fireEvent('tipshow', me, miscRatingsTip);

            // create a static listener once to close this tip when any other instance shows its tip
            me.mgr = me.mgr || me.self.on('tipshow', function(slider) {
                if (slider !== me) {
                    miscRatingsTip.hide();
                }
            });
        }
    },


    // local methods
    buildMiscRatingsTip: function() {
        var me = this,
            miscRatingsTip = me.miscRatingsTip;

        if (!miscRatingsTip) {
            miscRatingsTip = Ext.create('Ext.tip.ToolTip', {
                anchor: 'left',
                autoHide: false,
                cls: 'slate-cbl-ratings-slider-miscratingstip',
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

                                me.setValue(menuItem.value);
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
}, function(Slider) {
    // make this class statically observable so instances can monitor other instances for tip showing
    Ext.util.Observable.observe(Slider);
});