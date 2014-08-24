/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.view.teacher.demonstration.CreateWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-teacher-demonstration-createwindow',
    requires: [
        'Slate.cbl.API',

        'Ext.MessageBox',
        'Ext.window.Toast'
    ],

    config: {
        control: {
            'combobox[name=StudentID]': {
                select: 'onStudentSelect'
            },
            'container[reference=competenciesTabPanel] > container': {
                removed: 'onCompetencyCardRemoved'
            },
            'tabpanel[reference=competenciesTabPanel]': {
                tabchange: 'onCompetenciesTabChange'
            },
            'textfield[reference=competenciesSearchField]': {
                change: 'onCompetenciesSearchFieldChange',
                specialkey: 'onCompetenciesSearchFieldSpecialKey'
            },
            'gridpanel[reference=competenciesGrid]': {
                addclick: 'onCompetencyAddClick',
                rowdblclick: 'onCompetencyRowDoubleClick'
            },
            'button[action=submit]': {
                click: 'onSubmitClick'
            }
        }
    },


    toastTpl: [
        '<tpl for="student">',
            '<strong>{FirstName} {LastName}</strong>',
        '</tpl>',
        ' demonstrated',
        '<strong>',
            ' {skills.length}',
            ' <tpl if="skills.length == 1">skill<tpl else>skills</tpl>',
            '.',
        '</strong>'
    ],


    // event handlers
    onStudentSelect: function(studentCombo, student) {
        this.getView().setTitle('Log a demonstration' + (student.length ? ' for ' + student[0].getDisplayName() : ''));
    },

    onCompetenciesSearchFieldChange: function(searchField, value) {
        this.updateCompetencyFilter(value);
    },

    onCompetenciesSearchFieldSpecialKey: function(searchField, ev) {
        var me = this,
            selectionModel = me.lookupReference('competenciesGrid').getSelectionModel();

        switch (ev.getKey()) {
            case ev.ENTER:
                if (selectionModel.getCount()) {
                    me.addCompetency(selectionModel.getLastSelected());
                    ev.stopEvent();
                }
                break;
            case ev.DOWN:
//            case ev.RIGHT:
                selectionModel.selectNext(false, true);
                ev.stopEvent();
                break;
            case ev.UP:
//            case ev.LEFT:
                selectionModel.selectPrevious(false, true);
                ev.stopEvent();
                break;
        }
    },

    onCompetencyAddClick: function(competenciesGrid, competency) {
        this.addCompetency(competency);
    },

    onCompetencyRowDoubleClick: function(competenciesGrid, competency) {
        this.addCompetency(competency);
    },

    onCompetencyCardRemoved: function(competencyCard, competenciesTabPanel) {
        if (competenciesTabPanel.destroying || competenciesTabPanel.destroyed) {
            return;
        }

        var me = this;

        Ext.suspendLayouts();

        me.updateCompetencyFilter();

        me.syncAddComptencyButtonVisibility();

        Ext.resumeLayouts(true);
    },

    onCompetenciesTabChange: function(tabPanel, newCard) {
        var me = this;

        if (newCard.reference == 'competenciesGrid') {
            Ext.defer(function() {
                me.lookupReference('competenciesSearchField').focus();
            }, 250);
        }
    },

    onSubmitClick: function(btn) {
        var me = this,
            createWindow = me.getView(),
            demonstration = createWindow.getDemonstration(),
            formPanel = me.lookupReference('form'),
            studentField = formPanel.getForm().findField('StudentID'),
            selectedStudent = studentField.getSelectedRecord(),
            activeSliders = me.lookupReference('competenciesTabPanel').query('[skill]{getValue()!=7}'),
            activeSlidersLength = activeSliders.length, activeSliderIndex = 0, activeSlider,
            skills = [];

        // compile entered skills into array
        for (; activeSliderIndex < activeSlidersLength; activeSliderIndex++) {
            activeSlider = activeSliders[activeSliderIndex];
            skills.push({
                ID: activeSlider.skill.ID,
                Level: activeSlider.getValue()
            });
        }

        if (!skills.length) {
            Ext.Msg.alert('Not ready to log demonstration', 'Select a competency level for at least one skill');
            return;
        }


        // persist to server
        createWindow.setLoading('Submitting demonstration&hellip;');

        formPanel.updateRecord(demonstration);
        demonstration.set('skills', skills);

        demonstration.save({
            callback: function(record, operation, success) {
                var studentsFieldStore;

                if (success) {
                    Ext.toast(Ext.XTemplate.getTpl(me, 'toastTpl').apply({
                        student: selectedStudent.getData(),
                        skills: skills
                    }), 'Demonstration Logged');

                    if (me.lookupReference('loadNextStudentCheck').checked && !createWindow.destroying && !createWindow.destroyed) {
                        createWindow.setDemonstration(true); // start a new demonstration

                        studentsFieldStore = studentField.getStore();
                        studentField.select(studentsFieldStore.getAt(studentsFieldStore.indexOf(selectedStudent) + 1));

                        createWindow.setLoading(false);
                    } else {
                        createWindow.close();
                    }

                    Slate.cbl.API.fireEvent('demonstrationcreate', demonstration);
                } else {
                    createWindow.setLoading(false);
                    Ext.Msg.show({
                        title: 'Failed to log demonstration',
                        message: operation.getError() || 'Please backup your work to another application and report this to your technical support contact',
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            }
        });
    },


    // protected methods
    addCompetency: function(competency) {
        var me = this,
            createWindow = me.getView(),
            competenciesTabPanel = me.lookupReference('competenciesTabPanel'),
            competenciesSearchField = me.lookupReference('competenciesSearchField'),
            competencyCardConfig = {
                title: competency.get('Code'),
                tabConfig: {
                    tooltip: competenciesTabPanel.getTpl('competencyTipTpl').apply(competency.getData())
                },
                competency: competency,
                items: []
            },
            skillFieldsConfig = competencyCardConfig.items;

        competency.withSkills(function(skills) {
            if (createWindow.destroying || createWindow.destroyed) {
                return;
            }

            var competencyCard;

            skills.each(function(skill) {
                skillFieldsConfig.push({
                    fieldLabel: skill.Descriptor,
                    skill: skill
                });
            });

            Ext.suspendLayouts();

            competencyCard = competenciesTabPanel.insert(competenciesTabPanel.items.getCount() - 1, competencyCardConfig);
            competenciesTabPanel.setActiveItem(competencyCard);

            if (competenciesSearchField.isDirty()) {
                competenciesSearchField.reset(); // changing the value from dirty back to blank will trigger the change handler
            } else {
                me.updateCompetencyFilter(); // if the field was already blank the filter needs to be manually reset to remove the added competency
            }

            me.syncAddComptencyButtonVisibility();

            Ext.resumeLayouts(true);

            // scroll destination won't be measured correctly if this is called before layouts are flushed
            competenciesTabPanel.getTabBar().getLayout().overflowHandler.scrollToItem(competenciesTabPanel.items.last().tab);
        });
    },

    updateCompetencyFilter: function(query) {
        var me = this,
            tabPanelItems = me.lookupReference('competenciesTabPanel').items,
            grid = me.lookupReference('competenciesGrid'),
            store = grid.getStore(),
            groupingFeature = grid.getView().getFeature('grouping'),
            isCompetencyAvailable = function(competency) {
                return !tabPanelItems.findBy(function(card) {
                    return card.competency === competency;
                });
            },
            regex;

        Ext.suspendLayouts();

        query = Ext.String.trim(query || me.lookupReference('competenciesSearchField').getValue());

        store.clearFilter(false);
        if (query) {
            regex =  Ext.String.createRegex(query, false, false);
            store.filterBy(function(competency) {
                return (
                    isCompetencyAvailable(competency) && (
                        regex.test(competency.get('Code')) ||
                        regex.test(competency.get('Descriptor'))
                    )
                );
            });

            if (store.getCount()) {
                groupingFeature.expandAll();
                grid.getSelectionModel().select(store.getAt(0), false, true);
            }
        } else {
            store.filterBy(isCompetencyAvailable);
            groupingFeature.collapseAll();
        }

        Ext.resumeLayouts(true);
    },

    syncAddComptencyButtonVisibility: function() {
        var me = this,
            tabPanel = me.lookupReference('competenciesTabPanel'),
            tabBar = tabPanel.getTabBar(),
            competenciesGrid = me.lookupReference('competenciesGrid');

        if (me.lookupReference('competenciesTabPanel').items.getCount() == 1) {
            tabBar.hide();
        } else {
            competenciesGrid.tab.setHidden(!competenciesGrid.getStore().getCount());
            tabBar.show();
        }
    }
});