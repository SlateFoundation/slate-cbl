Ext.define('Slate.cbl.admin.overrides.SettingsNavPanel', {override:'SlateAdmin.view.settings.NavPanel', initComponent:function() {
  var me = this;
  me.data = me.data.concat({href:'#settings/cbl/skills', text:'CBL Skills'});
  me.callParent(arguments);
}});
Ext.define('Slate.cbl.admin.model.Skill', {extend:'Ext.data.Model', requires:['Slate.proxy.Records', 'Ext.data.identifier.Negative'], idProperty:'ID', identifier:'negative', fields:[{name:'ID', type:'int', allowNull:true}, {name:'Class', type:'string', defaultValue:'Slate\\CBL\\Skill'}, {name:'Created', type:'date', dateFormat:'timestamp', allowNull:true}, {name:'CreatorID', type:'int', allowNull:true}, {name:'RevisionID', type:'int', allowNull:true}, {name:'Modified', type:'date', dateFormat:'timestamp', 
allowNull:true}, {name:'ModifierID', type:'int', allowNull:true}, {name:'CompetencyID', type:'int'}, {name:'Code', type:'string'}, {name:'Descriptor', type:'string'}, {name:'Statement', type:'string'}, 'DemonstrationsRequired'], proxy:{type:'slate-records', url:'/cbl/skills'}});
Ext.define('Slate.cbl.admin.store.Skills', {extend:'Ext.data.Store', model:'Slate.cbl.admin.model.Skill', remoteSort:true, pageSize:50});
Ext.define('Slate.cbl.admin.view.skills.Grid', {extend:'Ext.grid.Panel', requires:['Ext.toolbar.Paging'], xtype:'cbl-admin-skills-grid', store:'Skills', height:'100%', dockedItems:[{xtype:'pagingtoolbar', store:'Skills', dock:'bottom', displayInfo:true}], columns:{defaults:{flex:1}, items:[{dataIndex:'Code', text:'Code'}, {dataIndex:'Descriptor', text:'Descriptor', flex:5}, {dataIndex:'Statement', text:'Statement', flex:5}]}});
Ext.define('Slate.cbl.admin.view.skills.EvidenceRequirementsField', {extend:'Ext.form.FieldContainer', xtype:'cbl-admin-skills-evidencerequirementsfield', requires:['Ext.form.field.Number', 'Ext.layout.container.HBox'], layout:'hbox', fieldLabel:'', config:{level:'default', value:0}, initComponent:function() {
  var me = this, level = me.getLevel();
  me.items = [{xtype:'numberfield', fieldLabel:level == 'default' ? 'Default Level' : 'Level ' + level, value:me.getValue(), minValue:0, listeners:{change:function(field, val) {
    this.up('cbl-admin-skills-evidencerequirementsfield').setValue(val);
  }}}];
  if (level !== 'default') {
    me.items.push({xtype:'button', cls:'glyph-danger', glyph:61526, text:'Remove', handler:function() {
      this.up('fieldcontainer').destroy();
    }});
  }
  me.callParent(arguments);
}});
Ext.define('Slate.cbl.admin.view.skills.Form', {extend:'Ext.form.Panel', xtype:'cbl-admin-skills-form', requires:['Ext.form.field.ComboBox', 'Ext.form.field.Display', 'Ext.form.field.Number', 'Ext.form.field.Text', 'Ext.form.field.TextArea', 'Ext.panel.Panel', 'Ext.toolbar.Fill', 'Slate.cbl.admin.view.skills.EvidenceRequirementsField'], disabled:true, title:'Selected Skill', componentCls:'cbl-admin-skills-editor', bodyPadding:10, scrollable:'vertical', trackResetOnLoad:true, defaults:{labelWidth:70, 
labelAlign:'right', anchor:'100%'}, items:[{xtype:'displayfield', name:'Code', fieldLabel:'Code'}, {xtype:'textareafield', name:'Descriptor', fieldLabel:'Descriptor', allowBlank:false}, {xtype:'textareafield', name:'Statement', fieldLabel:'Statement', allowBlank:false, grow:true}, {xtype:'panel', itemId:'evidence-requirements-container', title:'Evidence Requirements', tbar:[{xtype:'numberfield', fieldLabel:'Level', minValue:1, isFormField:false, listeners:{change:function() {
  this.next('button').setDisabled(!this.getValue());
}}}, {xtype:'tbfill'}, {text:'Add Level', action:'add', disabled:true, glyph:61525, cls:'glyph-success', handler:function() {
  var form = this.up('form'), field = this.prev('numberfield'), level = field.getValue();
  if (Ext.isNumeric(level)) {
    form.fireEvent('addevidencerequirementlevel', form, field, level);
  }
}}]}], buttons:[{itemId:'revertBtn', disabled:true, text:'Revert Changes', cls:'glyph-danger', glyph:61527}, {xtype:'tbfill'}, {itemId:'saveBtn', disabled:true, text:'Save Changes', cls:'glyph-success', glyph:61528}], loadRecord:function(record) {
  var me = this, evidenceRequirementsCt = me.down('#evidence-requirements-container'), requiredDemos = 0, items = [], key;
  evidenceRequirementsCt.removeAll();
  if (record && (requiredDemos = record.get('DemonstrationsRequired'))) {
    for (key in requiredDemos) {
      if (requiredDemos.hasOwnProperty(key)) {
        items.push(Ext.factory({level:key, value:requiredDemos[key]}, 'Slate.cbl.admin.view.skills.EvidenceRequirementsField'));
      }
    }
  }
  evidenceRequirementsCt.add(items);
  me.callParent(arguments);
}, getEvidenceRequirements:function(level) {
  var me = this, evidenceRequirements = {}, evidenceRequirementFields = me.query('cbl-admin-skills-evidencerequirementsfield'), i = 0;
  for (; i < evidenceRequirementFields.length; i++) {
    evidenceRequirements[evidenceRequirementFields[i].getLevel()] = evidenceRequirementFields[i].getValue();
  }
  if (level) {
    return evidenceRequirements[level];
  }
  return evidenceRequirements;
}});
Ext.define('Slate.cbl.admin.view.skills.Manager', {extend:'Ext.Container', xtype:'cbl-admin-skills-manager', requires:['Slate.cbl.admin.view.skills.Grid', 'Slate.cbl.admin.view.skills.Form'], layout:'border', items:[{region:'west', split:true, xtype:'cbl-admin-skills-grid', autoScroll:true, width:500}, {region:'center', xtype:'cbl-admin-skills-form', flex:1}]});
Ext.define('Slate.cbl.admin.controller.Skills', {extend:'Ext.app.Controller', views:['skills.Manager@Slate.cbl.admin.view'], stores:['Skills@Slate.cbl.admin.store'], refs:{skillsManager:{selector:'cbl-admin-skills-manager', autoCreate:true, xtype:'cbl-admin-skills-manager'}, skillsGrid:{selector:'cbl-admin-skills-grid', autoCreate:true, xtype:'cbl-admin-skills-grid'}, skillsForm:{selector:'cbl-admin-skills-form', autoCreate:true, xtype:'cbl-admin-skills-form'}, evidenceRequirementCt:'#evidence-requirements-container', 
saveBtn:'cbl-admin-skills-form #saveBtn', revertBtn:'cbl-admin-skills-form #revertBtn', addLevelBtn:'cbl-admin-skills-form button[action\x3dadd]', settingsNavPanel:'settings-navpanel'}, control:{skillsGrid:{select:'onSkillSelect'}, skillsForm:{addevidencerequirementlevel:'addEvidenceRequirementLevel', dirtychange:'onFormDirtyChange'}, saveBtn:{click:'onSaveSkillClick'}, revertBtn:{click:'onRevertChangesClick'}, 'cbl-admin-skills-evidencerequirementsfield':{destroy:'onEvidenceRequirementsFieldDestroyed'}}, 
routes:{'settings/cbl/skills':'showSkills'}, showSkills:function() {
  var me = this, manager = me.getSkillsManager(), grid = me.getSkillsGrid(), navPanel = me.getSettingsNavPanel();
  Ext.suspendLayouts();
  Ext.util.History.suspendState();
  navPanel.setActiveLink('settings/cbl/skills');
  navPanel.expand();
  Ext.util.History.resumeState(false);
  me.getApplication().getController('Viewport').loadCard(manager);
  grid.getStore().load();
  Ext.resumeLayouts(true);
}, onSkillSelect:function() {
  var me = this, form = me.getSkillsForm(), grid = me.getSkillsGrid(), skill = grid.getSelectionModel().getSelection()[0];
  form.enable();
  form.loadRecord(skill);
  form.setTitle(skill.get('Code'));
  if (skill.isPhantom) {
    skill.set('DemonstrationsRequired', []);
  }
  me.syncFormButtons();
}, onSaveSkillClick:function() {
  var me = this, form = me.getSkillsForm(), skill = form.getRecord();
  form.updateRecord(skill);
  skill.set('DemonstrationsRequired', form.getEvidenceRequirements());
  if (skill.dirty) {
    form.setLoading('Saving skill\x26hellip;');
    skill.save({callback:function(record, operation, success) {
      form.setLoading(false);
      if (success) {
        form.loadRecord(record);
      } else {
        Ext.Msg.alert('Failed to save skill', 'This skill failed to save to the server:\x3cbr\x3e\x3cbr\x3e' + (operation.getError() || 'Unknown reason, try again or contact support'));
      }
    }});
  }
}, onFormDirtyChange:function(form, dirty) {
  this.syncFormButtons();
}, syncFormButtons:function() {
  var me = this, form = me.getSkillsForm(), dirty = form.isDirty(), revertBtn = me.getRevertBtn(), saveBtn = me.getSaveBtn(), addLevelBtn = me.getAddLevelBtn(), evidenceRequirementsDirty = JSON.stringify(form.getRecord().get('DemonstrationsRequired')) !== JSON.stringify(form.getEvidenceRequirements());
  addLevelBtn.setDisabled(!Ext.isNumeric(addLevelBtn.prev('numberfield').getValue()));
  revertBtn.setDisabled(!dirty && !evidenceRequirementsDirty);
  saveBtn.setDisabled(!dirty && !evidenceRequirementsDirty);
}, onRevertChangesClick:function(btn) {
  var skillsForm = this.getSkillsForm();
  skillsForm.reset();
  skillsForm.loadRecord(skillsForm.getRecord());
  this.syncFormButtons();
}, onEvidenceRequirementsFieldDestroyed:function() {
  this.syncFormButtons();
}, addEvidenceRequirementLevel:function(form, field, level) {
  var me = this, evidenceRequirementContainer = me.getEvidenceRequirementCt(), currentLevels = form.getEvidenceRequirements(), index = 0;
  if (currentLevels[level] !== undefined) {
    return Ext.Msg.alert('Error', 'This level already exists. Please select another level.');
  }
  currentLevels[level] = true;
  index = Object.keys(currentLevels).sort(function(a, b) {
    if (Ext.isNumeric(a) && Ext.isNumeric(b)) {
      return parseInt(a, 10) - parseInt(b, 10);
    } else {
      if (Ext.isNumeric(a)) {
        return -1;
      } else {
        if (Ext.isNumeric(b)) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  }).indexOf(level.toString());
  evidenceRequirementContainer.insert(index, {xtype:'cbl-admin-skills-evidencerequirementsfield', level:level});
  field.reset();
  this.syncFormButtons();
}});
Ext.define('Slate.cbl.admin.overrides.SlateAdmin', {override:'SlateAdmin.Application', requires:['Slate.cbl.admin.controller.Skills'], initControllers:function() {
  this.callParent();
  this.getController('Slate.cbl.admin.controller.Skills');
}});
