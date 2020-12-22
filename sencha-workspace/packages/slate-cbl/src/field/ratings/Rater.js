Ext.define('Slate.cbl.field.ratings.Rater', {
    extend: 'Ext.Container',
    xtype: 'slate-cbl-ratings-rater',
    requires: [
        'Slate.cbl.model.Skill'
    ],

    config: {
        skill: null,
        level: null,
    },

    componentCls: 'slate-cbl-ratings-rater',

    items: [{
        xtype: 'label',
        cls: 'x-form-item-label',
        text: 'Skill code and descriptor',
    }, {
        xtype: 'container',
        layout: 'hbox',
        margin: '4 0',
        items: [{
            xtype: 'button',
            scale: 'large',
            text: 'Clear',
            cls: 'slate-cbl-ratings-rater-clear-btn',
<<<<<<< HEAD
            style: {
                borderRadius: '99px',
            },
=======
>>>>>>> 6e40fea9623ff48eb7b28deb85824ae9457a601b
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
<<<<<<< HEAD
=======
                    }, {
                        text: 'DNM',
>>>>>>> 6e40fea9623ff48eb7b28deb85824ae9457a601b
                    }],
                },
            }, {
                text: 'M',
            }, {
<<<<<<< HEAD
                cls: '-text-smaller',
                text: 'DNM',
            }, {
=======
>>>>>>> 6e40fea9623ff48eb7b28deb85824ae9457a601b
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
<<<<<<< HEAD

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

=======
>>>>>>> 6e40fea9623ff48eb7b28deb85824ae9457a601b
    // applySkill: function(skill, oldSkill) {
    //     if (!skill) {
    //         return null;
    //     }

    //     if (!skill.isModel) {
    //         if (oldSkill && skill.ID == oldSkill.getId()) {
    //             oldSkill.set(skill, { dirty: false });
    //             return oldSkill;
    //         }

    //         skill = Slate.cbl.model.Skill.create(skill);
    //     }

    //     return skill;
    // },

    // updateSkill: function(skill) {
    //     this.setFieldLabel(skill ? skill.get('Code') + '&mdash;' + skill.get('Descriptor') : null);
    // },
});
