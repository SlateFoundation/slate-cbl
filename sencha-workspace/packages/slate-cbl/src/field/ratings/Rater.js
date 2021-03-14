Ext.define('Slate.cbl.field.ratings.Rater', {
    extend: 'Slate.ui.form.ContainerField',
    xtype: 'slate-cbl-ratings-rater',
    requires: [
        'Ext.button.Button',
        'Ext.button.Segmented',
        'Ext.form.Label',
        'Ext.util.Format',

        /* global Slate */
        'Slate.cbl.model.Skill',
        'Slate.cbl.util.Config',
    ],


    isRatingField: true,


    config: {
        // configuration:
        minRating: 5,
        maxRating: 12,
        menuRatings: [4, 3, 2, 1],

        enableMissing: true,
        enableDidNotMeet: true,
        enableCheckmark: true,

        // state:
        skill: null,
        level: null,

        // subcomponents:
        label: false,
    },


    componentCls: 'slate-cbl-ratings-rater',
    items: [{
        xtype: 'container',
        layout: 'hbox',
        margin: '4 0',
        items: [{
            xtype: 'button',
            scale: 'large',
            text: 'Clear',
            cls: 'slate-cbl-ratings-rater-clear-btn',
            style: {
                borderRadius: '99px',
            },
        }, {
            flex: 1,

            xtype: 'segmentedbutton',
            margin: '0 0 0 16',
            defaults: {
                scale: 'large',
            }
        }],
    }],


    // config handlers
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
        this.setLabel(skill ? skill.get('Code') + '—' + skill.get('Descriptor') : null);
    },

    applyLabel: function(labelCmp, oldLabelCmp) {
        if (!labelCmp || typeof labelCmp == 'boolean') {
            labelCmp = {
                hidden: !labelCmp
            };
        } else if (typeof labelCmp == 'string') {
            labelCmp = {
                text: labelCmp
            };
        }

        if (Ext.isSimpleObject(labelCmp)) {
            Ext.applyIf(labelCmp, {
                cls: 'x-form-item-label',
            });
        }

        return Ext.factory(labelCmp, 'Ext.form.Label', oldLabelCmp);
    },


    // field lifecycle
    initValue: function() {
        var me = this,
            value = me.normalizeValue(me.value);

        me.value = value;

        // normalize twice so value/originalValue aren't references to same object instance
        me.originalValue = me.normalizeValue(value);

        me.loadValue();
    },

    normalizeValue: function(value) {
        var me = this,
            maxValue = me.maxValue,
            rating = value.DemonstratedLevel;

        if (!rating && rating !== 0) {
            rating = null;
        } else {
            rating = Math.round(rating);
    
            if (rating >= maxValue) {
                rating = maxValue;
            } else if (rating < me.minValue && me.getMenuRatings().indexOf(rating) == -1) {
                rating = null;
            }
        }

        // IMPORTANT: return a fresh object
        return {
            Class: value.Class || null,
            DemonstratedLevel: rating,
            TargetLevel: value.TargetLevel || null,
        };
    },

    isEqual: function(value1, value2) {
        if (!value1 || !value2) {
            return false;
        }

        if (value1.Class != value2.Class) {
            return false;
        }

        if (value1.TargetLevel != value2.TargetLevel) {
            return false;
        }

        if (value1.DemonstratedLevel != value2.DemonstratedLevel) {
            return false;
        }

        return true;
    },

    onChange: function(value, oldValue) {
        this.loadValue();
        this.callParent(arguments);
    },

    loadValue: function() {
        var me = this,
            value = me.value;

        console.info('loadValue', value);
        me.setLevel(value.TargetLevel);
        me.segmentedBtn.setValue(value.DemonstratedLevel);
    },


    // component lifecycle
    initItems: function() {
        var me = this,
            minRating = me.getMinRating(),
            maxRating = me.getMaxRating(),
            menuRatingItemsCfg = [],
            menuRatings = me.getMenuRatings(),
            menuRatingsLength = menuRatings && menuRatings.length,
            menuRatingsIndex = 0,
            rating, segmentedBtn;

        me.callParent();

        // grab references to pre-configured items
        segmentedBtn = me.segmentedBtn = me.down('segmentedbutton');

        // insert config-managed label component
        me.items.insert(0, me.getLabel());

        // insert menu ratings button
        if (menuRatingsLength) {
            for (; menuRatingsIndex < menuRatingsLength; menuRatingsIndex++) {
                rating = menuRatings[menuRatingsIndex];

                menuRatingItemsCfg.push({
                    value: rating,
                    text: Ext.util.Format.htmlEncode(Slate.cbl.util.Config.getAbbreviationForRating(rating)),
                    tooltip: Slate.cbl.util.Config.getTitleForRating(rating),
                    tooltipType: 'title'
                });
            }

            me.menuBtn = segmentedBtn.add({
                value: 'MENU',
                cls: 'slate-cbl-ratings-rater-menu-btn',
                glyph: 'xf0c9', // fa-bars
                menu: {
                    items: menuRatingItemsCfg,
                    plain: true,
                    defaultType: 'menucheckitem',
                    defaults: {
                        group: 'rating',
                        listeners: {
                            checkchange: function(menuItem, checked) {
                                if (!checked) {
                                    return; // ignore uncheck events
                                }

                                me.menuBtn.value = menuItem.value;
                                me.menuBtn.setPressed(true);
                                me.segmentedBtn.setValue(menuItem.value);
                            }
                        }
                    },
                    listeners: {
                        beforeshow: function(menu) {
                            menu.setWidth(me.menuBtn.getWidth())
                        }
                    }
                },
                listeners: {
                    beforetoggle: function(btn, pressed) {
                        var checkedItem;
                        
                        // return menu button back to MENU value on un-press
                        if (!pressed && btn === me.menuBtn) {
                            btn.value = 'MENU';
                            checkedItem = btn.down('[checked]');
                            if (checkedItem) {
                                checkedItem.setChecked(false, true);
                            }
                        }

                        // prevent selecting menu button with no value set yet
                        if (pressed && btn.value == 'MENU') {
                            return false;
                        }
                    }
                }
            });
        }

        // insert M and DNM buttons
        if (me.getEnableMissing()) {
            segmentedBtn.add({
                value: 'M',
                text: Ext.util.Format.htmlEncode(Slate.cbl.util.Config.getAbbreviationForRating('M')),
                tooltip: Slate.cbl.util.Config.getTitleForRating('M'),
                tooltipType: 'title'
            });
        }

        if (me.getEnableDidNotMeet()) {
            segmentedBtn.add({
                value: 'DNM',
                text: Ext.util.Format.htmlEncode(Slate.cbl.util.Config.getAbbreviationForRating('DNM')),
                tooltip: Slate.cbl.util.Config.getTitleForRating('DNM'),
                tooltipType: 'title'
            });
        }

        // insert min->max rating buttons
        for (rating = minRating; rating <= maxRating; rating++) {
            segmentedBtn.add({
                value: rating,
                text: Ext.util.Format.htmlEncode(Slate.cbl.util.Config.getAbbreviationForRating(rating)),
                tooltip: Slate.cbl.util.Config.getTitleForRating(rating),
                tooltipType: 'title'
            });
        }

        // insert checkmark button
        if (me.getEnableCheckmark()) {
            segmentedBtn.add({
                value: 'CHECK',
                glyph: 'xf00c', // fa-check
                tooltip: Slate.cbl.util.Config.getTitleForRating('CHECK'),
                tooltipType: 'title'
            });
        }
    },
});
