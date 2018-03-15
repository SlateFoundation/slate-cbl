/**
 * Implements a custom field for looking up skills and inputting ratings
 *
 * Modeled after a combination of FieldContainer and field.Base
 */
Ext.define('Slate.cbl.field.ratings.SkillsField', {
    extend: 'Slate.ui.form.ContainerField',
    xtype: 'slate-cbl-ratings-skillsfield',
    requires: [
        'Ext.button.Button',

        'Slate.cbl.field.ratings.SkillsCompetency',
        'Slate.cbl.field.ratings.Slider',
        'Slate.cbl.field.SkillsSelector',

        /* global Slate */
        'Slate.sorter.Code'
    ],


    config: {
        selectedStudent: null,
        selectedCompetencies: true,

        skillsSelector: true,
        addSkillsButton: true,
        footer: true

    //     tabPanel: true,
    //     competenciesGrid: true
    },


    // containerfield configuration
    name: 'DemonstrationSkills',
    allowBlank: false,
    blankText: 'At least one rating must be selected',


    // container/component configuration
    componentCls: 'slate-cbl-skillratingsfield',
    layout: 'anchor',
    defaults: {
        xtype: 'slate-cbl-ratings-skillscompetency',
        anchor: '100%'
    },


    // config handlers
    applySkillsSelector: function(skillsSelector, oldSkillsSelector) {
        if (!skillsSelector || typeof skillsSelector == 'boolean') {
            skillsSelector = {
                hidden: !skillsSelector
            };
        }

        if (typeof skillsSelector == 'object' && !skillsSelector.isComponent) {
            skillsSelector = Ext.apply({
                fieldLabel: null,
                flex: 1
            }, skillsSelector);
        }

        return Ext.factory(skillsSelector, 'Slate.cbl.field.SkillsSelector', oldSkillsSelector);
    },

    applyAddSkillsButton: function(addSkillsButton, oldAddSkillsButton) {
        if (!addSkillsButton || typeof addSkillsButton == 'boolean') {
            addSkillsButton = {
                hidden: !addSkillsButton
            };
        }

        if (typeof addSkillsButton == 'object' && !addSkillsButton.isComponent) {
            addSkillsButton = Ext.apply({
                text: 'Add Skills',
                margin: '0 0 0 10'
            }, addSkillsButton);
        }

        return Ext.factory(addSkillsButton, 'Ext.button.Button', oldAddSkillsButton);
    },

    updateAddSkillsButton: function(addSkillsButton) {
        addSkillsButton.on('click', 'onAddSkillsClick', this);
    },

    applyFooter: function(footer, oldFooter) {
        if (!footer || typeof footer == 'boolean') {
            footer = {
                hidden: !footer
            };
        }

        if (typeof footer == 'object' && !footer.isComponent) {
            footer = Ext.apply({
                layout: {
                    type: 'hbox',
                    align: 'center'
                },
                items: [
                    this.getSkillsSelector(),
                    this.getAddSkillsButton()
                ]
            }, footer);
        }

        return Ext.factory(footer, 'Ext.container.Container', oldFooter);
    },


    // container lifecycle
    initItems: function() {
        var me = this,
            skillsStore = Slate.cbl.store.Skills.create();

        me.callParent();

        // apply sorters for tab items, must be able to process both instances and config objects
        me.items.setSorters([
            new Slate.sorter.Code({
                codeFn: function(item) {
                    return item.selectedCompetency;
                }
            })
        ]);

        skillsStore.load({
            include: 'Competency',
            callback: function(skills) {
                me.add([
                    {
                        selectedCompetency: skills[0].get('Competency').Code,
                        items: [
                            {
                                skill: skills[0],
                                level: 9
                            },
                            {
                                skill: skills[1],
                                level: 10
                            },
                            {
                                skill: skills[2],
                                level: 11
                            },
                        ]
                    },
                    {
                        selectedCompetency: skills[11].get('Competency').Code,
                        items: [
                            {
                                skill: skills[11],
                                level: 11
                            },
                            {
                                skill: skills[12],
                                level: 12
                            },
                        ]
                    },
                    me.getFooter()
                ]);
            }
        });
    },


    // event hand
    onAddSkillsClick: function() {
        console.info('Add skills', this.getSkillsSelector().getValue());
    }
});