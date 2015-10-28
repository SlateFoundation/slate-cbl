/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.view.teacher.demonstration.EditWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-teacher-demonstration-editwindow',
    requires: [
        'Slate.cbl.API',
        'Slate.cbl.field.LevelSlider',
        'Slate.cbl.data.Skills',

        'Ext.MessageBox',
        'Ext.window.Toast',
        'Ext.util.MixedCollection'
    ],

    config: {
        control: {
            '#': {
                show: 'onShow',
                beforeshow: 'onBeforeShow',
                loaddemonstration: 'onLoadDemonstration'
            },
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
                rowclick: 'onCompetencyRowDoubleClick'
            },
            'button[action=submit]': {
                click: 'onSubmitClick'
            }
        }
    },


    toastTitleTpl: [
        '<tpl if="wasPhantom">',
            'Demonstration Logged',
        '<tpl else>',
            'Demonstration Edited',
        '</tpl>'
    ],

    toastBodyTpl: [
        '<tpl if="wasPhantom">',
            '<tpl for="student">',
                '<strong>{FirstName} {LastName}</strong>',
            '</tpl>',
            ' demonstrated',
            ' <strong>',
                '{skills.length}',
                ' <tpl if="skills.length == 1">skill<tpl else>skills</tpl>',
                '.',
            '</strong>',
        '<tpl else>',
            'Updated',
            ' <strong>',
                '{skills.length}',
                ' <tpl if="skills.length == 1">skill<tpl else>skills</tpl>',
            '</strong>',
            ' demonstrated by',
            '<tpl for="student">',
                ' <strong>',
                    '{FirstName} {LastName}',
                    '.',
                '</strong>',
            '</tpl>',
        '</tpl>'
    ],


    // event handlers
    onBeforeShow: function(editWindow) {
        var defaultCompetency = editWindow.getDefaultCompetency();

        if (defaultCompetency) {
            this.addCompetency(defaultCompetency);
        }
    },

    onShow: function(editWindow) {
        var me = this,
            competenciesGrid = me.lookupReference('competenciesGrid'),
            store = Ext.getStore('cbl-competencies');

        // load global competencies store the first time a window shows
        if (!store.isLoaded()) {
            competenciesGrid.setLoading('Loading competencies&hellip;');

            store.on('load', function() {
                competenciesGrid.setLoading(false);
            }, me, { single: true });

            if (!store.isLoading()) {
                store.load();
            }
        }
    },

    onLoadDemonstration: function(editWindow, demonstration) {
        var me = this,
            competenciesGrid = me.lookupReference('competenciesGrid'),
            competenciesStore = Ext.getStore('cbl-competencies'),
            _restoreSavedSkills;

        // if loading a phantom, leave the form unloaded so empty fields aren't marked invalid
        if (demonstration.phantom) {
            return;
        }

        Ext.suspendLayouts();

        // if loading an existing demonstration, load it into the form immediately.
        me.lookupReference('form').loadRecord(demonstration);
        me.lookupReference('loadNextStudentCheck').setVisible(demonstration.phantom);

        competenciesGrid.setLoading('Loading competencies&hellip;');

        // define closure for finishing this operation by loading already-saved skills into competencies grid
        _restoreSavedSkills = function() {
            var skills = demonstration.get('Skills') || [],
                skillsByCompetencyId = {},
                competenciesToLoad = [],
                skillsLength = skills.length, skillIndex = 0, demonstrationSkill, competencyId,
                _onCompetencyReady, _onFinished;

            _onCompetencyReady = function(competency, competencyCard) {
                var competencySkills = skillsByCompetencyId[competency.getId()],
                    competencySkillsLength = competencySkills.length,
                    competencySkillIndex = 0,
                    competencySkill;

                // remove competency from the queue
                Ext.Array.remove(competenciesToLoad, competency.getId());

                // load skills into competency
                for (; competencySkillIndex < competencySkillsLength; competencySkillIndex++) {
                    competencySkill = competencySkills[competencySkillIndex];
                    competencyCard.down('slate-cbl-levelsliderfield{skill.getId()=='+competencySkill.SkillID+'}').setLevel(competencySkill.DemonstratedLevel);
                }

                // finish loading cycle when the queue is empty
                if (!competenciesToLoad.length) {
                    competenciesGrid.setLoading(false);
                    Ext.resumeLayouts(true);
                    me.scrollCompetenciesTabsToEnd();
                }
            };

            // group skills by competency and a queue of competencies to be loaded
            for (; skillIndex < skillsLength; skillIndex++) {
                demonstrationSkill = skills[skillIndex];
                competencyId = demonstrationSkill.Skill.CompetencyID;

                if (competencyId in skillsByCompetencyId) {
                    skillsByCompetencyId[competencyId].push(demonstrationSkill);
                } else {
                    competenciesToLoad.push(competencyId);
                    skillsByCompetencyId[competencyId] = [demonstrationSkill];
                }
            }

            // load all competencies in the queue
            for (competencyId in skillsByCompetencyId) {
                if (skillsByCompetencyId.hasOwnProperty(competencyId)) {
                    me.addCompetency(competenciesStore.getById(competencyId), _onCompetencyReady, me, true); // true to insert sorted
                }
            }
        };

        // competencies grid must be loaded before restoring saved skills
        if (competenciesStore.isLoaded()) {
            _restoreSavedSkills();
        } else {
            competenciesStore.on('load', _restoreSavedSkills, me, { single: true });
        }
    },

    onStudentSelect: function(studentCombo, student) {
        this.getView().setTitle('Log a demonstration' + (student.length ? ' for ' + student[0].getDisplayName() : ''));
    },

    onCompetenciesSearchFieldChange: function(searchField, value) {
        this.updateCompetencyFilter(value);
    },

    onCompetenciesSearchFieldSpecialKey: function(searchField, ev) {
        var me = this,
            competenciesGrid = me.lookupReference('competenciesGrid'),
            selectionModel = competenciesGrid.getSelectionModel();

        switch (ev.getKey()) {
            case ev.ENTER:
                if (selectionModel.getCount()) {
                    ev.stopEvent();
                    competenciesGrid.setLoading('Loading skills&hellip;');
                    me.addCompetency(selectionModel.getLastSelected(), function() {
                        competenciesGrid.setLoading(false);
                    });
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
        competenciesGrid.setLoading('Loading skills&hellip;');
        this.addCompetency(competency, function() {
            competenciesGrid.setLoading(false);
        });
    },

    onCompetencyRowDoubleClick: function(competenciesGrid, competency) {
        competenciesGrid.setLoading('Loading skills&hellip;');
        this.addCompetency(competency, function() {
            competenciesGrid.setLoading(false);
        });
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
            editWindow = me.getView(),
            demonstration = editWindow.getDemonstration(),
            wasPhantom = demonstration.phantom,
            formPanel = me.lookupReference('form'),
            studentField = formPanel.getForm().findField('StudentID'),
            selectedStudent = studentField.getSelectedRecord(),
            activeSliders = me.lookupReference('competenciesTabPanel').query('[skill]{getLevel()!==null}'),
            activeSlidersLength = activeSliders.length, activeSliderIndex = 0, activeSlider,
            skills = [];

        // compile entered skills into array
        for (; activeSliderIndex < activeSlidersLength; activeSliderIndex++) {
            activeSlider = activeSliders[activeSliderIndex];
            skills.push({
                SkillID: activeSlider.skill.getId(),
                DemonstratedLevel: activeSlider.getLevel()
            });
        }

        if (!skills.length) {
            Ext.Msg.alert('Not ready to log demonstration', 'Select a competency level for at least one skill');
            return;
        }


        // persist to server
        editWindow.setLoading('Submitting demonstration&hellip;');

        formPanel.updateRecord(demonstration);
        demonstration.set('Skills', skills);

        demonstration.save({
            callback: function(record, operation, success) {
                var studentsFieldStore,
                    tplData;

                if (success) {
                    tplData = {
                        wasPhantom: wasPhantom,
                        student: selectedStudent.getData(),
                        skills: skills
                    };

                    Ext.toast(
                        Ext.XTemplate.getTpl(me, 'toastBodyTpl').apply(tplData),
                        Ext.XTemplate.getTpl(me, 'toastTitleTpl').apply(tplData)
                    );

                    if (wasPhantom && me.lookupReference('loadNextStudentCheck').checked && !editWindow.destroying && !editWindow.destroyed) {
                        // start a new demonstration
                        editWindow.setDemonstration({
                            Class: demonstration.get('Class')
                        });

                        studentsFieldStore = studentField.getStore();
                        studentField.select(studentsFieldStore.getAt(studentsFieldStore.indexOf(selectedStudent) + 1));

                        editWindow.setLoading(false);
                    } else {
                        editWindow.close();
                    }

                    Slate.cbl.API.fireEvent('demonstrationsave', demonstration);
                } else {
                    editWindow.setLoading(false);
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
    addCompetency: function(competency, callback, scope, insertSorted) {
        var me = this,
            editWindow = me.getView(),
            competenciesStore = Ext.getStore('cbl-competencies'),
            competenciesTabPanel = me.lookupReference('competenciesTabPanel'),
            competenciesSearchField = me.lookupReference('competenciesSearchField'),
            competencyCardConfig = {
                competency: competency,
                items: []
            },
            skillFieldsConfig = competencyCardConfig.items;

        // convert competency id to instance
        if (!competency.isModel) {
            // defer addCompetency until competencies store is loaded if necessary
            if (competenciesStore.isLoaded()) {
                competency = competenciesStore.getById(competency);
            } else {
                competenciesStore.on('load', function() {
                    me.addCompetency(competency, callback, scope, insertSorted);
                }, null, { single: true });

                return;
            }
        }


        competencyCardConfig.title = competency.get('Code');

        Slate.cbl.data.Skills.getAllByCompetency(competency, function(skills) {
            if (editWindow.destroying || editWindow.destroyed) {
                return;
            }

            var competencyCard, insertIndex;

            skills.each(function(skill) {
                skillFieldsConfig.push({
                    fieldLabel: skill.get('Descriptor'),
                    skill: skill
                });
            });

            Ext.suspendLayouts();

            if (insertSorted) {
                // slightly hackey -- items is AbstractMixedCollection which doesn't have findInsertionIndex, but
                // findInsertionIndex is a public method on MixedCollection which directly extends its abstract
                // variant to add sorting methods
                insertIndex = Ext.util.MixedCollection.prototype.findInsertionIndex.call(competenciesTabPanel.items, competencyCardConfig, function(a, b) {
                    // the add competencies grid is always last
                    if (a.reference == 'competenciesGrid') {
                        return 1;
                    } else if (b.reference == 'competenciesGrid') {
                        return -1;
                    }

                    // sort by title -- this could be inaccurate if codes have numbers appended that are multiple digits but not zerofilled
                    return a.title.localeCompare(b.title);
                });
            } else {
                insertIndex = competenciesTabPanel.items.getCount() - 1;
            }

            competencyCard = competenciesTabPanel.insert(insertIndex, competencyCardConfig);
            competencyCard.down('#competencyDescription').update(competency.getData());
            competenciesTabPanel.setActiveItem(competencyCard);


            if (competenciesSearchField.isDirty()) {
                competenciesSearchField.reset(); // changing the value from dirty back to blank will trigger the change handler
            } else {
                me.updateCompetencyFilter(); // if the field was already blank the filter needs to be manually reset to remove the added competency
            }

            me.syncAddComptencyButtonVisibility();

            Ext.resumeLayouts(true);

            me.scrollCompetenciesTabsToEnd(); // must be called after resuming layouts

            Ext.callback(callback, scope, [competency, competencyCard]);
        });
    },

    scrollCompetenciesTabsToEnd: function() {
        var me = this,
            competenciesTabPanel = me.lookupReference('competenciesTabPanel'),
            competenciesTabBar = competenciesTabPanel.getTabBar(),
            _doScroll = function() {
                competenciesTabBar.getLayout().overflowHandler.scrollToItem(competenciesTabPanel.items.last().tab);
            };

        if (competenciesTabBar.rendered) {
            _doScroll();
        } else {
            competenciesTabBar.on('afterrender', _doScroll, me, { single: true });
        }
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
            tabPanel = me.lookupReference('competenciesTabPanel');

        tabPanel.getTabBar().setHidden(tabPanel.items.getCount() == 1);
    }
});