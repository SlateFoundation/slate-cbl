Ext.define('Slate.cbl.admin.controller.Skills', {
    extend: 'Ext.app.Controller',

    views: [
        'skills.Manager@Slate.cbl.admin.view'
    ],

    stores: [
        'Skills@Slate.cbl.admin.store'
    ],

    refs: {
        skillsManager: {
            selector: 'cbl-admin-skills-manager',
            autoCreate: true,

            xtype: 'cbl-admin-skills-manager'
        },
        skillsGrid: {
            selector: 'cbl-admin-skills-grid',
            autoCreate: true,

            xtype: 'cbl-admin-skills-grid'
        },
        skillsForm: {
            selector: 'cbl-admin-skills-form',
            autoCreate: true,

            xtype: 'cbl-admin-skills-form'
        },
        evidenceRequirementCt: '#evidence-requirements-container',
        saveBtn: 'cbl-admin-skills-form #saveBtn',
        revertBtn: 'cbl-admin-skills-form #revertBtn',
        addLevelBtn: 'cbl-admin-skills-form button[action=add]',
        settingsNavPanel: 'settings-navpanel',
    },

    control: {
        skillsGrid: {
            select: 'onSkillSelect'
        },
        skillsForm: {
            addevidencerequirementlevel: 'addEvidenceRequirementLevel',
            dirtychange: 'onFormDirtyChange'
        },
        saveBtn: {
            click: 'onSaveSkillClick'
        },
        revertBtn: {
            click: 'onRevertChangesClick'
        },
        'cbl-admin-skills-evidencerequirementsfield': {
            destroy: 'onEvidenceRequirementsFieldDestroyed'
        }
    },

    routes: {
        'settings/cbl/skills': 'showSkills'
    },


    showSkills: function() {
        var me = this,
            manager = me.getSkillsManager(),
            grid = me.getSkillsGrid(),
            navPanel = me.getSettingsNavPanel();

        Ext.suspendLayouts();

        Ext.util.History.suspendState();

        navPanel.setActiveLink('settings/cbl/skills');
        navPanel.expand();
        Ext.util.History.resumeState(false); // false to discard any changes to state

        me.getApplication().getController('Viewport').loadCard(manager);
        grid.getStore().load();

        Ext.resumeLayouts(true);
    },

    onSkillSelect: function() {
        var me = this,
            form = me.getSkillsForm(),
            grid = me.getSkillsGrid(),
            skill = grid.getSelectionModel().getSelection()[0];

        form.enable();
        form.loadRecord(skill);
        form.setTitle(skill.get('Code'));
        if (skill.isPhantom) {
            skill.set('DemonstrationsRequired', []);
        }
        me.syncFormButtons();
    },

    onSaveSkillClick: function() {
        var me = this,
            // manager = me.getSkillsManager(),
            form = me.getSkillsForm(),
            skill = form.getRecord();

        // validate form
        form.updateRecord(skill);

        skill.set('DemonstrationsRequired', form.getEvidenceRequirements());

        if (skill.dirty) {
            form.setLoading('Saving skill&hellip;');
            skill.save({
                callback: function(record, operation, success) {
                    form.setLoading(false);
                    if (success) {
                        form.loadRecord(record);
                    } else {
                        Ext.Msg.alert('Failed to save skill', 'This skill failed to save to the server:<br><br>' + (operation.getError() || 'Unknown reason, try again or contact support'));
                    }
                }
            })
        }
    },

    onFormDirtyChange: function(form, dirty) {
        this.syncFormButtons();
    },

    syncFormButtons: function() {
        var me = this,
            form = me.getSkillsForm(),
            dirty = form.isDirty(),
            revertBtn = me.getRevertBtn(),
            saveBtn = me.getSaveBtn(),
            addLevelBtn = me.getAddLevelBtn(),
            evidenceRequirementsDirty = JSON.stringify(form.getRecord().get('DemonstrationsRequired')) !== JSON.stringify(form.getEvidenceRequirements());

        addLevelBtn.setDisabled(!Ext.isNumeric(addLevelBtn.prev('numberfield').getValue()))
        revertBtn.setDisabled(!dirty && !evidenceRequirementsDirty);
        saveBtn.setDisabled(!dirty && !evidenceRequirementsDirty);
    },

    onRevertChangesClick: function(btn) {
        var skillsForm = this.getSkillsForm();
        skillsForm.reset();
        skillsForm.loadRecord(skillsForm.getRecord());
        this.syncFormButtons();
    },

    onEvidenceRequirementsFieldDestroyed: function() {
        this.syncFormButtons();
    },

    addEvidenceRequirementLevel: function(form, field, level) {
        var me = this,
            evidenceRequirementContainer = me.getEvidenceRequirementCt(),
            currentLevels = form.getEvidenceRequirements(),
            index = 0;

        // verify level doesn't exist
        if (currentLevels[level] !== undefined) {
            return Ext.Msg.alert('Error', 'This level already exists. Please select another level.');
        }

        currentLevels[level] = true;
        // find index this level should be inserted at
        index = Object.keys(currentLevels).sort(function(a, b) {
            if (Ext.isNumeric(a) && Ext.isNumeric(b)) {
                return parseInt(a, 10) - parseInt(b, 10);
            } else if (Ext.isNumeric(a)) {
                return -1;
            } else if (Ext.isNumeric(b)) {
                return 1;
            } else {
                return 0;
            }
        }).indexOf(level.toString());

        evidenceRequirementContainer.insert(index, {
            xtype: 'cbl-admin-skills-evidencerequirementsfield',
            level: level
        });

        field.reset();
        this.syncFormButtons();
    }
});