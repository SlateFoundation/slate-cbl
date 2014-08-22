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
            '#': {
                beforeshow: 'onBeforeWindowShow'
            },
            'combobox[name=StudentID]': {
                select: 'onStudentSelect'
            },
            'button[action=submit]': {
                click: 'onSubmitClick'
            },
            'container[reference=competenciesTabPanel] > container': {
                removed: 'onCompetencyCardRemoved'
            },
            'container[reference=addCompetencyCt] button': {
                click: 'onAddCompetencyButtonClick'
            }
        }
    },


    // event handlers
    onBeforeWindowShow: function(createWindow) {
        var me = this,
            competenciesStore = Ext.getStore('cbl-competencies'),
            buttonConfigs = [];

        competenciesStore.each(function(competency) {
            buttonConfigs.push({
                text: competency.get('Descriptor'),
                tooltip: competency.get('Statement'),
                competency: competency
            });
        });
        
        me.lookupReference('addCompetencyCt').add(buttonConfigs);
    },
    
    onStudentSelect: function(studentCombo, student) {
        this.getView().setTitle('Log a demonstration' + (student.length ? ' for ' + student[0].getDisplayName() : ''));
    },
    
    onAddCompetencyButtonClick: function(button) {
        this.addCompetency(button.competency);
    },
    
    onCompetencyCardRemoved: function(competencyCard, competenciesTabPanel) {
        if (competenciesTabPanel.destroying || competenciesTabPanel.destroyed) {
            return;
        }
        
        var me = this,
            addCompetencyCt = me.lookupReference('addCompetencyCt');
        
        Ext.suspendLayouts();

        addCompetencyCt.items.findBy(function(button) {
            return button.competency === competencyCard.competency;
        }).show();

        me.syncAddComptencyButtonVisibility();
        
        Ext.resumeLayouts(true);
    },
    
    onSubmitClick: function(btn) {
        var me = this,
            createWindow = me.getView(),
            demonstration = createWindow.getDemonstration(),
            formPanel = me.lookupReference('form'),
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
                if (success) {
//                    createWindow.setDemonstration(true); // TODO: delete me
//                    createWindow.setLoading(false); // TODO: delete me

                    createWindow.close();

                    Slate.cbl.API.fireEvent('demonstrationcreate', demonstration);

                    Ext.toast('The demonstration has been logged to the student’s&nbsp;record.', 'Demonstration Logged');
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
            button = me.lookupReference('addCompetencyCt').items.findBy(function(button) {
                return button.competency === competency;
            }),
            competenciesTabPanel = me.lookupReference('competenciesTabPanel'),
            competencyCardConfig = {
                title: competency.get('Code'),
                tabConfig: {
                    tooltip: Ext.String.format('<h3>{0}</h3><p>{1}</p>', competency.get('Descriptor'), competency.get('Statement'))
                },
                competency: competency,
                items: []
            },
            skillFieldsConfig = competencyCardConfig.items;
        
        button.disable();
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
            button.hide();
            button.enable();

            me.syncAddComptencyButtonVisibility();
            
            Ext.resumeLayouts(true);
        });
    },

    syncAddComptencyButtonVisibility: function() {
        var me = this,
            addCompetencyCt = me.lookupReference('addCompetencyCt');
            
        addCompetencyCt.tab.setHidden(
            me.lookupReference('competenciesTabPanel').items.getCount() == 1 ||!addCompetencyCt.down(':not([hidden])')
        );
    }
});