Ext.define('Slate.cbl.field.ratings.Rater', {
    extend: 'Ext.Container',
    xtype: 'slate-cbl-ratings-rater',
    requires: [
        'Ext.button.Button',
        'Ext.button.Segmented',
        'Ext.form.Label',

        /* global Slate */
        'Slate.cbl.model.Skill'
    ],


    isRatingField: true,


    config: {
        skill: null,
        level: null,

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
            },
            items: [{
                cls: 'slate-cbl-ratings-rater-menu-btn',
                glyph: 'xf0c9', // fa-bars
                menu: {
                    items: [{
                        text: '1',
                    }, {
                        text: '2',
                    }, {
                        text: '3',
                    }, {
                        text: '4',
                    }],
                },
            }, {
                text: 'M',
            }, {
                cls: '-text-smaller',
                text: 'DNM',
            }, {
                text: '5',
            }, {
                text: '6',
            }, {
                text: '7',
            }, {
                text: '8',
            }, {
                text: '9',
            }, {
                text: '10',
            }, {
                text: '11',
            }, {
                text: '12',
            }, {
                glyph: 'xf00c', // fa-check
            }],
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


    // component lifecycle
    initItems: function() {
        var me = this;

        me.callParent();

        me.items.insert(0, me.getLabel());
    },
});
