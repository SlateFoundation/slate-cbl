/**
 * Provides a picker for ratings
 */
Ext.define('Slate.cbl.field.RatingSlider', {
    extend: 'Ext.slider.Multi',
    xtype: 'slate-cbl-ratingslider',
    requires: [
        'Ext.tip.ToolTip',

        /* global Slate */
        'Slate.cbl.field.RatingThumb',
        'Slate.cbl.model.Skill'
    ],


    config: {
        skill: null,
        level: null,

        minRating: 8,
        maxRating: 13,
        menuRatings: [6, 5, 4, 3, 2, 1, 0]
    },


    // slider configuration
    useTips: false,


    // field configuration
    labelAlign: 'top',


    // component configuration
    componentCls: 'slate-cbl-ratingslider',

    listeners: {
        change: function(me, value, thumb) {
            console.info('change', me.id, value, thumb.el.dom);
            thumb.setValue(value);
        }
    },


    // slider lifecycle
    getNearest: function() {
        return this.thumbs[0];
    },

    calculateThumbPosition: function(value) {
        return this.callParent([Math.max(value, this.minValue)]);
    },


    // field lifecycle
    initValue: function() {
        var me = this,
            thumbs = me.thumbs,
            minValue = me.minValue,
            maxValue = me.maxValue,
            i = minValue,
            value = me.value || i || null;

        me.originalValue = value;

        // add primary thumb for current value
        thumbs.push(new Slate.cbl.field.RatingThumb({
            ownerCt: me,
            slider: me,
            value: value,
            index: thumbs.length,
            constrain: false
        }));

        // add disabled thumbs for each available value
        for (; i <= maxValue; i++) {
            thumbs.push(new Slate.cbl.field.RatingThumb({
                ownerCt: me,
                slider: me,
                value: i == minValue ? null : i,
                index: thumbs.length,
                disabled: true,
            }));
        }
    },

    getValue: function() {
        return this.value;
    },

    setValue: function() {
        var me = this,
            oldValue = me.value,
            args = arguments,
            argsLength = args.length,
            thumbIndex = 0,
            value = null,
            animate = true,
            changeComplete = false,
            thumb;

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
        thumb = me.thumbs[thumbIndex];
        value = me.normalizeValue(value);

        if (value !== oldValue && me.fireEvent('beforechange', me, value, oldValue, thumb) !== false) {
            me.value = value;
            thumb.setValue(value);

            if (me.rendered) {
                thumb.move(me.calculateThumbPosition(value), animate);

                me.fireEvent('change', me, value, thumb);
                me.checkDirty();

                if (changeComplete) {
                    me.fireEvent('changecomplete', me, value, thumb);
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
        } else if (value >= me.minValue) {
            value = value;
        } else if (me.getMenuRatings().indexOf(value) == -1) {
            value = null;
        }

        return value;
    },


    // component lifecycle
    onRender: function() {
        var me = this,
            primaryThumb = me.thumbs[0];

        me.callParent(arguments);

        me.promoteThumb(primaryThumb);

        primaryThumb.el.on('click', 'onThumbClick', me);
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

    onThumbClick: function() {
        var me = this,
            specialGradeTip, thumbEl, menuItems;

        if (me.getValue() != me.minValue) {
            return;
        }

        console.info('onThumbClick', arguments);

    //     thumbEl = me.thumbs[0].el;

    //     if (!(specialGradeTip = me.self.specialGradeTip)) {
    //         specialGradeTip = me.self.specialGradeTip = Ext.create('Ext.tip.ToolTip', {
    //             anchor: 'left',
    //             target: thumbEl,
    //             autoHide: false,
    //             cls: 'special-grade-tip',
    //             items: {
    //                 xtype: 'menu',
    //                 floating: false,
    //                 plain: true,
    //                 defaults: {
    //                     checked: false,
    //                     group: 'level',
    //                     listeners: {
    //                         checkchange: function(menuItem, checked) {
    //                             if (!checked) {
    //                                 return; // ignore uncheck events
    //                             }

    //                             specialGradeTip.targetSlider.setParkedValue(menuItem.value);

    //                             Ext.defer(specialGradeTip.hide, 100, specialGradeTip);
    //                         }
    //                     }
    //                 },
    //                 items: [{
    //                     text: '7',
    //                     value: 7
    //                 },{
    //                     text: '6',
    //                     value: 6
    //                 },{
    //                     text: '5',
    //                     value: 5
    //                 },{
    //                     text: '4',
    //                     value: 4
    //                 },{
    //                     text: '3',
    //                     value: 3
    //                 },{
    //                     text: '2',
    //                     value: 2
    //                 },{
    //                     text: '1',
    //                     value: 1
    //                 },{
    //                     text: 'M',
    //                     value: 0
    //                 },{
    //                     text: 'N/A',
    //                     value: null
    //                 }]
    //             },
    //             listeners: {
    //                 hide: function() {
    //                     specialGradeTip.setTarget(null); // remove target on hide so that it does not open again on mouse hover
    //                 }
    //             }
    //         });
    //     } else {
    //         specialGradeTip.setTarget(thumbEl);
    //     }

    //     menuItems = specialGradeTip.down('menu').items;

    //     (
    //         menuItems.findBy(function(item) {
    //             return item.value === me.getParkedValue();
    //         }) ||
    //         menuItems.last()
    //     ).setChecked(true, true);

    //     specialGradeTip.targetSlider = me;
    //     specialGradeTip.show();
    }
});